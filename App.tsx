
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
    return saved ? JSON.parse(saved) : INITIAL_FOOD_DB;
  });

  const [logs, setLogs] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? pruneOldEntries(JSON.parse(saved)) : [];
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS);
    return saved ? pruneOldEntries(JSON.parse(saved)) : [];
  });

  // 日期自动检查与数据清理
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate()) {
        setCurrentDate(now);
        setLogs(prev => pruneOldEntries(prev));
        setExerciseLogs(prev => pruneOldEntries(prev));
      }
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
      icon: food.icon,
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

  const addExercise = (name: string, calories: number) => {
    const newEntry: ExerciseEntry = {
      id: Date.now().toString(),
      name,
      caloriesBurned: Math.round(calories),
      timestamp: Date.now()
    };
    setExerciseLogs(prev => pruneOldEntries([...prev, newEntry]));
  };

  const deleteExercise = (id: string) => {
    setExerciseLogs(prev => prev.filter(ex => ex.id !== id));
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const clearLogs = () => {
    if (window.confirm('确定要清除今日所有记录吗？')) {
      const todayLogsSet = new Set(todayLogs.map(l => l.id));
      setLogs(prev => prev.filter(l => !todayLogsSet.has(l.id)));
      const todayExSet = new Set(todayExercise.map(e => e.id));
      setExerciseLogs(prev => prev.filter(e => !todayExSet.has(e.id)));
    }
  };

  return (
    <div className="min-h-screen pb-28 max-w-lg mx-auto bg-[#FDFBF7] shadow-xl relative flex flex-col">
      <header className="bg-white/60 backdrop-blur-md px-6 py-5 sticky top-0 z-50 border-b border-[#F4EFEA] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#84A59D] rounded-xl flex items-center justify-center shadow-lg shadow-[#84A59D]/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[17px] font-black tracking-tight text-[#5B756E]">NutriTrack</h1>
            <p className="text-[9px] text-[#A5998D] font-black uppercase tracking-[0.2em]">{currentDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} Wellness</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#F4F1EA] shadow-sm flex items-center justify-center text-[#84A59D]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </header>

      <main className="p-6 flex-grow">
        {view === 'dashboard' && (
          <div className="space-y-10">
            <DailyDashboard 
              consumed={consumed} 
              exerciseBurned={totalBurned}
              goals={goals} 
              logs={todayLogs} 
              onDeleteLog={deleteLog}
              onClearLogs={clearLogs}
              onAddClick={() => setView('food')}
            />
            <SmartAssistant 
              consumed={consumed} 
              goals={goals} 
              foodDb={foodDb} 
              logs={todayLogs}
              onAddFood={(food) => setView('food')}
            />
          </div>
        )}

        {view === 'history' && (
          <HistoryTrend trendData={trendData} />
        )}

        {view === 'goals' && (
          <GoalSetter 
            profile={profile} 
            setProfile={setProfile} 
            goals={goals} 
            setGoals={setGoals} 
            todayExercise={todayExercise}
            onAddExercise={addExercise}
            onDeleteExercise={deleteExercise}
            onSave={() => setView('dashboard')}
          />
        )}

        {view === 'food' && (
          <FoodManager 
            foodDb={foodDb} 
            setFoodDb={setFoodDb} 
            onLogFood={addLog}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-2xl border border-[#F4EFEA] px-2 py-2 flex justify-around items-center rounded-[2rem] shadow-[0_20px_50px_rgba(165,153,141,0.15)] z-50">
        <button onClick={() => setView('dashboard')} className={`relative flex-1 py-3 flex flex-col items-center transition-all duration-300 ${view === 'dashboard' ? 'text-[#84A59D]' : 'text-[#CEC3B8]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">概览</span>
          {view === 'dashboard' && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#84A59D] rounded-full" />}
        </button>
        <button onClick={() => setView('history')} className={`relative flex-1 py-3 flex flex-col items-center transition-all duration-300 ${view === 'history' ? 'text-[#84A59D]' : 'text-[#CEC3B8]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">趋势</span>
          {view === 'history' && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#84A59D] rounded-full" />}
        </button>
        <button onClick={() => setView('food')} className={`relative flex-1 py-3 flex flex-col items-center transition-all duration-300 ${view === 'food' ? 'text-[#84A59D]' : 'text-[#CEC3B8]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">记录</span>
          {view === 'food' && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#84A59D] rounded-full" />}
        </button>
        <button onClick={() => setView('goals')} className={`relative flex-1 py-3 flex flex-col items-center transition-all duration-300 ${view === 'goals' ? 'text-[#84A59D]' : 'text-[#CEC3B8]'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">我的</span>
          {view === 'goals' && <div className="absolute -bottom-1 w-1.5 h-1.5 bg-[#84A59D] rounded-full" />}
        </button>
      </nav>
    </div>
  );
};

export default App;
