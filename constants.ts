
import { FoodItem, Gender, ActivityLevel, UserProfile } from './types';

export const INITIAL_FOOD_DB: FoodItem[] = [
  { id: '1', name: '鸡胸肉', icon: '🍗', calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  { id: '2', name: '鸡蛋 (1个)', icon: '🥚', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
  { id: '3', name: '西兰花', icon: '🥦', calories: 34, protein: 2.8, fat: 0.4, carbs: 7 },
  { id: '4', name: '全麦面包', icon: '🍞', calories: 247, protein: 13, fat: 3.4, carbs: 41 },
  { id: '5', name: '三文鱼', icon: '🐟', calories: 208, protein: 20, fat: 13, carbs: 0 },
  { id: '6', name: '牛油果', icon: '🥑', calories: 160, protein: 2, fat: 15, carbs: 9 },
  { id: '7', name: '大米饭', icon: '🍚', calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
];

export const DEFAULT_PROFILE: UserProfile = {
  gender: Gender.MALE,
  age: 25,
  weight: 70,
  height: 175,
  activityLevel: ActivityLevel.MODERATELY_ACTIVE
};

export const STORAGE_KEYS = {
  PROFILE: 'nutri_profile',
  GOALS: 'nutri_goals',
  FOOD_DB: 'nutri_foods',
  LOGS: 'nutri_logs',
  EXERCISE_LOGS: 'nutri_exercise'
};
