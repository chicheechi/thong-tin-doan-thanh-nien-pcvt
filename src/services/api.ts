import { GAS_WEB_APP_URL } from '../config';

export const apiService = {
  getStaff: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaff`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân sự:", error);
      return [];
    }
  },

  getHistory: async () => {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getHistory`, {
        method: 'GET',
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
      return [];
    }
  },

  submitResult: async (payload: any) => {
    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        // Chú ý: Dùng text/plain để vượt qua rào cản CORS (preflight OPTIONS) của Google Apps Script
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      return { success: false, message: error instanceof Error ? error.message : "Lỗi mạng" };
    }
  }
};
