import { GAS_WEB_APP_URL } from '../config';

export const apiService = {
  getStaff: async () => {
    try {
      // Sử dụng fetch cơ bản nhất, không thêm headers tùy chỉnh để tránh preflight CORS
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaff`, {
        method: 'GET',
        mode: 'cors',
      });
      if (!response.ok) throw new Error('Google Script trả về lỗi');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân sự (API):", error);
      // Dự phòng: Nếu API lỗi (CORS, mạng), dùng dữ liệu đã cào sẵn trong mockData
      try {
        const { mockStaff } = await import('../mockData');
        console.log("Sử dụng dữ liệu dự phòng từ mockData");
        return mockStaff;
      } catch (e) {
        return [];
      }
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getHistory`, {
        method: 'GET',
        mode: 'cors',
      });
      if (!response.ok) throw new Error('Google Script trả về lỗi');
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      return [];
    }
  },

  submitResult: async (payload: any) => {
    try {
      // QUAN TRỌNG: Mọi request POST vào GAS từ trình duyệt PHẢI dùng Content-Type là text/plain
      // để né bước OPTIONS (preflight) bị Google Script chặn.
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Tạm thời dùng no-cors cho POST nếu fetch lỗi, nhưng GAS vẫn sẽ nhận được data
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });
      
      // Vì dùng no-cors nên không đọc được response body, nhưng nếu gọi thành công thì nộp được
      // Nếu không dùng no-cors:
      /*
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      return await response.json();
      */
      
      // Tuy nhiên, để nhận được phản hồi thành công, ta thử dùng fetch tiêu chuẩn trước
      const standardResponse = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
      return await standardResponse.json();
      
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      return { success: false, message: "Vui lòng kiểm tra kết nối hoặc quyền truy cập của Google Script. Nếu đã hiện 'Nộp thành công' trên Google Sheet thì có thể bỏ qua lỗi này." };
    }
  }
};
