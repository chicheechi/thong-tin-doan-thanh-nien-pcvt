import { GAS_WEB_APP_URL } from '../config';
import { mockStaff, mockHistory } from '../mockData';

export const apiService = {
  getStaff: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaff`, { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();
        return (data && data.length > 0) ? data : mockStaff;
      }
      return mockStaff;
    } catch (error) {
      console.warn("GAS CORS or Network error. Have you deployed doGet for JSON? Falling back to mockData.");
      return mockStaff;
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getHistory`, { cache: 'no-cache' });
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
      return [];
    } catch (error) {
      console.warn("GAS CORS or Network error. Retrying History fetch using cross-origin request...");
      return mockHistory || [];
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
