
import { GoogleGenAI } from "@google/genai";
import { MacroGoals, TrendDay } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiAdvice = async (
  consumed: { calories: number; protein: number; fat: number; carbs: number },
  goals: MacroGoals,
  recentLogs: string[]
) => {
  const ai = getAI();
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
    return response.text;
  } catch (error) {
    console.error("Gemini Advice Error:", error);
    return "继续保持平衡的饮食，关注身体的反馈。加油！";
  }
};

export const getTrendAnalysis = async (trendData: TrendDay[]) => {
  const ai = getAI();
  const summary = trendData.map(d => 
    `${d.dateLabel}: 
    热量: 实测${d.calories}/目标${d.goal}kcal
    蛋白质: 实测${d.protein.toFixed(0)}/目标${d.proteinGoal}g
    碳水: 实测${d.carbs.toFixed(0)}/目标${d.carbsGoal}g
    脂肪: 实测${d.fat.toFixed(0)}/目标${d.fatGoal}g`
  ).join('\n');

  const prompt = `
    这是我过去 7 天的饮食趋势及目标对比数据：
    ${summary}
    
    请作为一名资深营养师进行深度分析：
    1. 评估热量和三大营养素的实测值与目标的偏差情况。
    2. 识别是否有持续性的营养不平衡（例如蛋白质持续不足或脂肪经常超标）。
    3. 给出下周的一个极具操作性的核心改进建议。
    要求：语言温暖、专业，避开模棱两可的话，总字数控制在 150 字以内。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Trend Analysis Error:", error);
    return "数据收集中，建议您继续记录以获取更精准的周报分析。目前看来您的饮食习惯正在逐步建立中。";
  }
};
