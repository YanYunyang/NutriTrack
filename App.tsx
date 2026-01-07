
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, MacroGoals, FoodItem, DailyLogEntry, ExerciseEntry
} from './types';
import { INITIAL_FOOD_DB, DEFAULT_PROFILE, STORAGE_KEYS } from './constants';
import { 
  calculateTDEE, 
  calculateMacroGoalsFromCalories,
  calculateConsumedNutrients,
  getWeeklyTrendData,
  pruneOldEntries
} from './utils/calculators';

// Components
import GoalSetter from './components/GoalSetter';
import FoodManager from './components/FoodManager';
import DailyDashboard from './components/DailyDashboard';
import SmartAssistant from './components/SmartAssistant';
import HistoryTrend from './components/HistoryTrend';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'goals' | 'food' | 'history'>('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [goals, setGoals] = useState<MacroGoals>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (saved) return JSON.parse(saved);
    const tdee = calculateTDEE(DEFAULT_PROFILE);
    return calculateMacroGoalsFromCalories(tdee);
  });

  const [foodDb, setFoodDb] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_DB);
    const initialList: FoodItem[] = saved ? JSON.parse(saved) : INITIAL_FOOD_DB;
    
    // 数据修复逻辑：如果本地存储的内置食物缺失图标，则从配置中找回
    return initialList.map(item => {
      const reference = INITIAL_FOOD_DB.find(f => f.id === item.id);
      // 如果是内置食物 ID，且图标缺失或为默认占位符，则更新图标
      if (reference && (!item.icon || item.icon === '🍱')) {
        return { ...item, icon: reference.icon };
      }
      return item;
    });
  });

  const [logs, setLogs] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? pruneOldEntries(JSON.parse(saved)) : [];
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS);
    return saved ? pruneOldEntries(JSON.parse(saved)) : [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) setCurrentDate(now);
    }, 60000);
    return () => clearInterval(interval);
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    localStorage.setItem(STORAGE_KEYS.FOOD_DB, JSON.stringify(foodDb));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(exerciseLogs));
  }, [profile, goals, foodDb, logs, exerciseLogs]);

  const todayStr = currentDate.toISOString().split('T')[0];
  const todayLogs = useMemo(() => logs.filter(log => new Date(log.timestamp).toISOString().split('T')[0] === todayStr), [logs, todayStr]);
  const todayExercise = useMemo(() => exerciseLogs.filter(ex => new Date(ex.timestamp).toISOString().split('T')[0] === todayStr), [exerciseLogs, todayStr]);
  
  const consumed = useMemo(() => calculateConsumedNutrients(todayLogs), [todayLogs]);
  const totalBurned = useMemo(() => Math.round(todayExercise.reduce((acc, ex) => acc + ex.caloriesBurned, 0)), [todayExercise]);
  
  const trendData = useMemo(() => getWeeklyTrendData(logs, goals), [logs, goals]);

  const addLog = (food: FoodItem, weight: number) => {
    const factor = weight / 100;
    const newEntry: DailyLogEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      icon: food.icon || '🍱',
      weight,
      timestamp: Date.now(),
      nutrients: {
        calories: Math.round(food.calories * factor),
        protein: food.protein * factor,
        fat: food.fat * factor,
        carbs: food.carbs * factor,
      }
    };
    setLogs(prev => pruneOldEntries([newEntry, ...prev]));
  };

  return (
    <div className="min-h-screen pb-32 max-w-lg mx-auto bg-[#FDFBF7] relative flex flex-col font-medium">
      <header className="px-8 py-7 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-40">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#A5998D] font-black uppercase tracking-[0.3em]">NutriTrack Pro</span>
          <h1 className="text-xl font-black text-[#5B544D] tracking-tight mt-1">
            {view === 'dashboard' ? '今日营养概览' : view === 'history' ? '饮食趋势分析' : view === 'food' ? '食物库管理' : '个人偏好设置'}
          </h1>
        </div>
        <button 
          onClick={() => setView('goals')}
          className="w-11 h-11 bg-white border border-[#F4F1EA] rounded-2xl flex items-center justify-center text-[#84A59D] shadow-sm active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </button>
      </header>

      <main className="px-6 flex-grow">
        {view === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <DailyDashboard 
              consumed={consumed} 
              exerciseBurned={totalBurned}
              goals={goals} 
              logs={todayLogs} 
              onDeleteLog={(id) => setLogs(l => l.filter(x => x.id !== id))}
              onClearLogs={() => setLogs([])}
              onAddClick={() => setView('food')}
            />
            <SmartAssistant consumed={consumed} goals={goals} foodDb={foodDb} logs={todayLogs} onAddFood={() => setView('food')} />
          </div>
        )}
        {view === 'history' && <HistoryTrend trendData={trendData} />}
        {view === 'food' && <FoodManager foodDb={foodDb} setFoodDb={setFoodDb} onLogFood={addLog} onBack={() => setView('dashboard')} />}
        {view === 'goals' && <GoalSetter profile={profile} setProfile={setProfile} goals={goals} setGoals={setGoals} todayExercise={todayExercise} onAddExercise={(n, c) => setExerciseLogs(p => [...p, { id: Date.now().toString(), name: n, caloriesBurned: c, timestamp: Date.now() }])} onDeleteExercise={(id) => setExerciseLogs(e => e.filter(x => x.id !== id))} onSave={() => setView('dashboard')} />}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#5B544D] px-2 py-2 flex justify-around items-center rounded-3xl shadow-2xl z-50">
        {[
          { id: 'dashboard', label: '主页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
          { id: 'history', label: '趋势', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { id: 'food', label: '记录', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex-1 flex flex-col items-center py-2.5 rounded-2xl transition-all duration-300 ${view === item.id ? 'bg-[#84A59D] text-white' : 'text-[#CEC3B8]'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d={item.icon} /></svg>
            <span className="text-[9px] mt-1 font-black tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
