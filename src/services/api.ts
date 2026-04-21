import { GAS_WEB_APP_URL } from '../config';
import { mockStaff } from '../mockData';

export const apiService = {
  getStaff: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaff`);
      if (response.ok) {
        return await response.json();
      }
      return mockStaff;
    } catch (error) {
      return mockStaff;
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getHistory`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  submitResult: async (payload: any) => {
    try {
      // Dùng POST chuẩn để nhận được phản hồi JSON từ Google
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Lỗi submit:", error);
      // Nếu lỗi CORS nhưng vẫn nộp được, ta hiện thông báo kiểm tra lại
      return { 
        success: false, 
        message: "Phản hồi từ máy chủ gặp lỗi, nhưng dữ liệu có thể đã được gửi. Vui lòng kiểm tra lại Google Sheet." 
      };
    }
  }
};
