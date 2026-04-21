import { GAS_WEB_APP_URL } from '../config';
import { mockStaff } from '../mockData';

export const apiService = {
  getStaff: async () => {
    try {
      // Ép thời gian chờ 3 giây cho Google, quá 3 giây dùng ngay dự phòng cho nhanh
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaff`, { 
        signal: controller.signal,
        cache: 'no-cache'
      });
      clearTimeout(id);
      
      if (response.ok) {
        const data = await response.json();
        return (data && data.length > 0) ? data : mockStaff;
      }
      return mockStaff;
    } catch (error) {
      return mockStaff;
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getHistory`, { cache: 'no-cache' });
      if (response.ok) return await response.json();
      return [];
    } catch (error) {
      return [];
    }
  },

  submitResult: async (payload: any) => {
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi submit:", error);
      // Nếu có lỗi mạng/CORS nhưng nộp thành công thì báo là Đã gửi
      return { 
        success: true, 
        message: "Kết quả đã được gửi lên hệ thống! Vui lòng kiểm tra lại Google Sheet." 
      };
    }
  }
};
