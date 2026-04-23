import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));

  // API Routes
  app.post("/api/analyze-certificate", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        res.status(400).json({ error: "No image provided" });
        return;
      }

      // Initialize Gemini AI
      if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        res.status(500).json({ error: "Configuration error" });
        return;
      }
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Clean base64 string
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        "Hãy nhìn vào bức ảnh này và cho tôi biết đây có phải là hình ảnh chụp một giấy chứng nhận, bằng khen, hoặc kết quả hoàn thành bài thi hợp lệ không? Trả lời chính xác bằng 1 trong 2 cụm từ sau, không thêm bất kỳ chữ nào khác: 'Đã có chứng nhận' hoặc 'Chưa có chứng nhận'."
      ]);

      const text = result.response.text()?.trim() || "Chưa có chứng nhận";
      
      // Ensure strict output
      let finalResult = "Chưa có chứng nhận";
      if (text.includes("Đã có chứng nhận")) {
        finalResult = "Đã có chứng nhận";
      }

      res.json({ result: finalResult });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Lỗi khi phân tích hình ảnh" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from the dist directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
