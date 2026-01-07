
import { FoodItem, Gender, ActivityLevel, UserProfile } from './types';

export const INITIAL_FOOD_DB: FoodItem[] = [
  // --- 优质蛋白质 ---
  { id: '1', name: '鸡胸肉', icon: '🍗', calories: 165, protein: 31, fat: 3.6, carbs: 0 },
  { id: '2', name: '鸡蛋 (1个)', icon: '🥚', calories: 78, protein: 6.3, fat: 5.3, carbs: 0.6 },
  { id: '5', name: '三文鱼', icon: '🐟', calories: 208, protein: 20, fat: 13, carbs: 0 },
  { id: '8', name: '瘦牛肉', icon: '🥩', calories: 250, protein: 26, fat: 15, carbs: 0 },
  { id: '9', name: '鲜虾', icon: '🦐', calories: 99, protein: 20, fat: 1.1, carbs: 0.2 },
  { id: '10', name: '豆腐', icon: '🥣', calories: 81, protein: 8, fat: 4.8, carbs: 1.9 },
  
  // --- 谷物与主食 ---
  { id: '7', name: '大米饭', icon: '🍚', calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  { id: '4', name: '全麦面包', icon: '🍞', calories: 247, protein: 13, fat: 3.4, carbs: 41 },
  { id: '11', name: '荞麦面', icon: '🍜', calories: 340, protein: 13, fat: 2.5, carbs: 70 },
  { id: '12', name: '红薯', icon: '🍠', calories: 86, protein: 1.6, fat: 0.1, carbs: 20 },
  { id: '13', name: '燕麦片', icon: '🥣', calories: 389, protein: 16.9, fat: 6.9, carbs: 66 },
  { id: '14', name: '意大利面', icon: '🍝', calories: 158, protein: 5.8, fat: 0.9, carbs: 31 },

  // --- 蔬菜类 ---
  { id: '3', name: '西兰花', icon: '🥦', calories: 34, protein: 2.8, fat: 0.4, carbs: 7 },
  { id: '15', name: '菠菜', icon: '🥗', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
  { id: '16', name: '胡萝卜', icon: '🥕', calories: 41, protein: 0.9, fat: 0.2, carbs: 10 },
  { id: '17', name: '西红柿', icon: '🍅', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
  { id: '18', name: '生菜沙拉', icon: '🥗', calories: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },

  // --- 水果与坚果 ---
  { id: '6', name: '牛油果', icon: '🥑', calories: 160, protein: 2, fat: 15, carbs: 9 },
  { id: '19', name: '苹果', icon: '🍎', calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { id: '20', name: '香蕉', icon: '🍌', calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
  { id: '21', name: '混合坚果', icon: '🥜', calories: 607, protein: 20, fat: 54, carbs: 21 },
  { id: '22', name: '蓝莓', icon: '🫐', calories: 57, protein: 0.7, fat: 0.3, carbs: 14 },

  // --- 饮品 ---
  { id: '23', name: '黑咖啡', icon: '☕', calories: 2, protein: 0.1, fat: 0, carbs: 0 },
  { id: '24', name: '绿茶', icon: '🍵', calories: 1, protein: 0, fat: 0, carbs: 0 },
  { id: '25', name: '无糖豆浆', icon: '🥛', calories: 31, protein: 3.3, fat: 1.6, carbs: 1.2 },
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
