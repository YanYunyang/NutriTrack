
import { UserProfile, MacroGoals, DailyLogEntry, FoodItem, TrendDay, Gender } from '../types';

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 */
export const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  if (gender === Gender.MALE) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

/**
 * Calculate TDEE
 */
export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  return bmr * profile.activityLevel;
};

/**
 * Default distribution: 30% Protein, 40% Carbs, 30% Fat
 */
export const calculateMacroGoalsFromCalories = (calories: number): MacroGoals => {
  return {
    calories,
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fat: Math.round((calories * 0.3) / 9),
  };
};

/**
 * Sum nutrients for a specific set of logs
 */
export const calculateConsumedNutrients = (logs: DailyLogEntry[]) => {
  return logs.reduce((acc, log) => ({
    calories: acc.calories + log.nutrients.calories,
    protein: acc.protein + log.nutrients.protein,
    fat: acc.fat + log.nutrients.fat,
    carbs: acc.carbs + log.nutrients.carbs,
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
};

/**
 * Get data for the last 7 days
 */
export const getWeeklyTrendData = (logs: DailyLogEntry[], goals: MacroGoals): TrendDay[] => {
  const trend: TrendDay[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('zh-CN', { weekday: 'short' });
    
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      return logDate === dateStr;
    });
    
    const totals = calculateConsumedNutrients(dayLogs);
    
    trend.push({
      dateLabel: i === 0 ? '今日' : dayLabel,
      calories: Math.round(totals.calories),
      goal: goals.calories,
      protein: totals.protein,
      fat: totals.fat,
      carbs: totals.carbs
    });
  }
  
  return trend;
};

/**
 * Intelligent filter for recommendations
 */
export const getSmartRecommendations = (
  foodDb: FoodItem[],
  consumed: { calories: number; protein: number; fat: number; carbs: number },
  goals: MacroGoals
) => {
  const calGap = goals.calories - consumed.calories;
  const proGap = goals.protein - consumed.protein;
  const fatGap = goals.fat - consumed.fat;
  const carbGap = goals.carbs - consumed.carbs;

  if (calGap <= 0) return [];

  const gaps = [
    { type: 'protein', value: proGap },
    { type: 'fat', value: fatGap },
    { type: 'carbs', value: carbGap }
  ].sort((a, b) => b.value - a.value);

  const topGap = gaps[0];

  return foodDb.map(food => {
    let score = 0;
    if (topGap.type === 'protein') score = (food.protein / (food.calories || 1)) * 100;
    if (topGap.type === 'fat') score = (food.fat / (food.calories || 1)) * 100;
    if (topGap.type === 'carbs') score = (food.carbs / (food.calories || 1)) * 100;

    if (proGap < 10) score -= (food.protein / 10);
    if (fatGap < 5) score -= (food.fat / 5);
    if (carbGap < 15) score -= (food.carbs / 10);

    return { 
      foodId: food.id, 
      name: food.name, 
      score,
      reason: `富含${topGap.type === 'protein' ? '蛋白质' : topGap.type === 'fat' ? '优质脂肪' : '能量'}`
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);
};
