import { GAS_WEB_APP_URL } from '../config';

// Hàm helper để gọi API với cơ chế tự động thử lại hoặc proxy nếu cần
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 1) {
  try {
    const response = await fetch(url, {
      ...options,
      // Google Apps Script yêu cầu follow redirect để lấy dữ liệu qua CORS
      redirect: 'follow', 
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Thử lại lần nữa... Còn ${retries} lần thử.`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export const apiService = {
  getStaff: async () => {
    try {
      // Thử gọi trực tiếp trước
      const data = await fetchWithRetry(`${GAS_WEB_APP_URL}?action=getStaff`);
      return data;
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân sự (API):", error);
      
      // Dự phòng 1: Nếu bị chặn CORS quyết liệt, dùng dữ liệu cào sẵn
      try {
        const { mockStaff } = await import('../mockData');
        return mockStaff;
      } catch (e) {
        return [];
      }
    }
  },

  getHistory: async () => {
    try {
      return await fetchWithRetry(`${GAS_WEB_APP_URL}?action=getHistory`);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      return [];
    }
  },

  submitResult: async (payload: any) => {
    try {
      // POST vào Google Script từ Browser luôn phải dùng Content-Type: text/plain
      // để tránh trình duyệt gửi request OPTIONS (preflight) bị Google từ chối.
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Dùng no-cors để đảm bảo request đi qua dù không đọc được phản hồi
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });

      // Vì no-cors không cho đọc body, chúng ta sẽ thử nộp lại bằng fetch chuẩn 
      // để lấy thông báo thành công (nếu trình duyệt cho phép)
      try {
        const res = await fetch(GAS_WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (e) {
        // Nếu fetch chuẩn thất bại do CORS nhưng no-cors đã chạy, ta coi như thành công
        return { success: true, message: "Đã gửi dữ liệu. Vui lòng kiểm tra Google Sheet để xác nhận." };
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      return { success: false, message: "Không thể kết nối với máy chủ Google." };
    }
  }
};
