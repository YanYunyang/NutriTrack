
import { GoogleGenAI } from "@google/genai";
import { MacroGoals } from "../types";

export const getGeminiAdvice = async (
  consumed: { calories: number; protein: number; fat: number; carbs: number },
  goals: MacroGoals,
  recentLogs: string[]
) => {
  // Fix: Initialize GoogleGenAI with the correct named parameter and use process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    我现在的营养摄入情况如下：
    - 已摄入热量: ${consumed.calories.toFixed(0)} / 目标: ${goals.calories} kcal
    - 蛋白质: ${consumed.protein.toFixed(1)} / ${goals.protein} g
    - 脂肪: ${consumed.fat.toFixed(1)} / ${goals.fat} g
    - 碳水: ${consumed.carbs.toFixed(1)} / ${goals.carbs} g
    
    最近吃的食物: ${recentLogs.join(', ')}
    
    请根据这些数据，给出一段简短、专业且鼓励性的营养建议（不超过 100 字）。
    如果是蛋白质不足，请强调补给；如果热量快超标了，请建议选择低密度的蔬菜。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Fix: Access the .text property directly from GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "继续保持平衡的饮食，关注身体的反馈。加油！";
  }
};
