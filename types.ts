
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ActivityLevel {
  SEDENTARY = 1.2,      // 久坐
  LIGHTLY_ACTIVE = 1.375, // 轻度
  MODERATELY_ACTIVE = 1.55, // 中度
  VERY_ACTIVE = 1.725,  // 高强度
  EXTRA_ACTIVE = 1.9    // 运动员级
}

export interface UserProfile {
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
}

export interface MacroGoals {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  calories: number; // per 100g
  protein: number;  // per 100g
  fat: number;      // per 100g
  carbs: number;    // per 100g
}

export interface ExerciseEntry {
  id: string;
  name: string;
  caloriesBurned: number;
  timestamp: number;
}

export interface DailyLogEntry {
  id: string;
  foodId: string;
  foodName: string;
  icon: string;
  weight: number; // intake amount in grams
  timestamp: number;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface TrendDay {
  dateLabel: string;
  calories: number;
  goal: number;
  protein: number;
  proteinGoal: number;
  fat: number;
  fatGoal: number;
  carbs: number;
  carbsGoal: number;
}
