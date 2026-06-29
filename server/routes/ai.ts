import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { GoogleGenAI } from "@google/genai";

const router = Router();
router.use(requireAuth);

router.post("/suggest-estimate", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback if AI is not configured
      return res.json({
        estimatedEffort: "4 hours",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reasoning: "API Key missing. Default fallback provided."
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      You are an expert project manager estimating a task.
      Task Title: ${title}
      Description: ${description || 'None provided'}
      
      Respond with ONLY a valid JSON object matching this schema, nothing else:
      {
        "estimatedEffort": "string (e.g., '2 hours', '1 day')",
        "dueDate": "ISO Date string representing a recommended deadline",
        "reasoning": "A short, 1-sentence reasoning"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("No response from AI");
    
    const json = JSON.parse(response.text);
    res.json(json);
  } catch (err: any) {
    console.error("AI Error:", err);
    // Graceful fallback
    res.json({
      estimatedEffort: "TBD",
      dueDate: new Date().toISOString(),
      reasoning: "AI suggestion failed. Please set manually."
    });
  }
});

export const aiRoutes = router;
