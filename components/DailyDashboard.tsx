
import React, { useState } from 'react';
import { MacroGoals, DailyLogEntry, FoodItem } from '../types';

interface Props {
  consumed: { calories: number; protein: number; fat: number; carbs: number };
  exerciseBurned?: number;
  goals: MacroGoals;
  logs: DailyLogEntry[];
  foodDb: FoodItem[];
  onDeleteLog: (id: string) => void;
  onAddLog: (food: FoodItem, weight: number) => void;
}

const DailyDashboard: React.FC<Props> = ({ consumed, exerciseBurned = 0, goals, logs, foodDb, onDeleteLog, onAddLog }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedQuickFood, setSelectedQuickFood] = useState<FoodItem | null>(null);
  const [weight, setWeight] = useState('100');

  const adjustedGoal = Math.round(goals.calories + exerciseBurned);
  const roundedConsumed = Math.round(consumed.calories);
  const calPercent = Math.min(Math.round((roundedConsumed / adjustedGoal) * 100), 100);
  const remainingCals = Math.max(0, adjustedGoal - roundedConsumed);

  // 搜索过滤
  const filteredFood = foodDb.filter(f => f.name.includes(search)).slice(0, 12);

  const handleQuickAdd = () => {
    if (selectedQuickFood) {
      onAddLog(selectedQuickFood, parseFloat(weight) || 0);
      setSelectedQuickFood(null);
      setShowQuickAdd(false);
      setSearch('');
    }
  };

  const currentPreviewCals = selectedQuickFood ? Math.round((selectedQuickFood.calories * (parseFloat(weight) || 0)) / 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {/* Dashboard Card */}
      <div className="bg-[#F4F1EA] p-6 md:p-8 rounded-[2rem] flex flex-col gap-6 md:gap-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black tracking-widest text-[#A5998D] opacity-60 uppercase">今日剩余</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black text-[#5B544D] tracking-tighter">{remainingCals}</span>
              <span className="text-sm md:text-lg font-black text-[#84A59D]">kcal</span>
            </div>
          </div>
          <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="#E9E4DB" strokeWidth="10" />
               <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#84A59D" strokeWidth="10" 
                strokeDasharray="282.7" 
                strokeDashoffset={282.7 * (1 - calPercent / 100)} 
                strokeLinecap="round"
                className="transition-all duration-1000"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[11px] md:text-[13px] font-black text-[#5B544D]">{calPercent}%</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {[
            { label: '蛋白', val: consumed.protein, goal: goals.protein, color: 'bg-[#A8BCC9]' },
            { label: '碳水', val: consumed.carbs, goal: goals.carbs, color: 'bg-[#D9A78D]' },
            { label: '脂肪', val: consumed.fat, goal: goals.fat, color: 'bg-[#E9C46A]' }
          ].map(m => (
            <div key={m.label} className="bg-white/60 p-3 md:p-4 rounded-2xl flex flex-col gap-1.5 border border-white/40">
              <span className="text-[8px] md:text-[9px] font-black text-[#A5998D] uppercase truncate">{m.label}</span>
              <div className="flex items-baseline gap-0.5 md:gap-1 flex-wrap">
                <span className="text-[12px] md:text-[14px] font-black text-[#5B544D]">{Math.round(m.val)}</span>
                <span className="text-[9px] font-bold text-[#CEC3B8] opacity-70">/ {Math.round(m.goal)}g</span>
              </div>
              <div className="h-1 md:h-1.5 w-full bg-[#E9E4DB] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${m.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log List */}
      <div className="space-y-4">
        <h3 className="text-[10px] md:text-xs font-black text-[#CEC3B8] tracking-[0.2em] uppercase px-2">进食记录</h3>

        {logs.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-[#F4F1EA] rounded-[2rem] mx-1">
            <p className="text-[12px] md:text-[13px] text-[#A5998D] font-black">记录你的第一餐美味</p>
          </div>
        ) : (
          <div className="space-y-3 px-1">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-[1.75rem] flex items-center justify-between border border-[#F4F1EA] active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-xl md:text-2xl border border-[#F4F1EA] shrink-0 shadow-inner">
                    {log.icon}
                  </div>
                  <div className="truncate">
                    <h4 className="font-black text-[#5B544D] tracking-tight leading-tight truncate">{log.foodName}</h4>
                    <p className="text-[10px] md:text-[11px] text-[#A5998D] font-bold mt-0.5 uppercase tracking-wide">{log.weight}g · {Math.round(log.nutrients.calories)} kcal</p>
                  </div>
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="p-2 md:p-3 text-[#E9E4DB] hover:text-[#D9A78D] transition-colors shrink-0">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB - Direct Quick Add Flow */}
      <button 
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-24 w-14 h-14 md:w-16 md:h-16 bg-[#84A59D] text-white rounded-[1.25rem] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-40 ring-4 ring-white"
        style={{ right: 'max(1rem, calc((100vw - 32rem) / 2 + 1.5rem))' }}
      >
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
      </button>

      {/* Quick Add Full-screen Search Overlay */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-[#5B544D]/30 backdrop-blur-xl z-[100] flex flex-col safe-top animate-in fade-in duration-300">
          <div className="flex-1 bg-[#FDFBF7] flex flex-col w-full max-w-lg mx-auto shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-12 duration-500 rounded-t-[2.5rem] mt-10">
             <header className="p-6 flex items-center gap-4">
                <button onClick={() => setShowQuickAdd(false)} className="p-2 text-[#A5998D] hover:text-[#5B544D] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex-1 bg-[#F4F1EA] rounded-full px-5 py-3 flex items-center gap-3 border border-[#E9E4DB] focus-within:ring-2 focus-within:ring-[#84A59D]/20 transition-all">
                   <svg className="w-4 h-4 text-[#A5998D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   <input 
                    className="bg-transparent border-none outline-none text-sm font-bold text-[#5B544D] w-full placeholder-[#CEC3B8]"
                    placeholder="搜搜看你想吃什么？"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                   />
                </div>
             </header>

             <div className="flex-1 overflow-y-auto px-6 py-2 space-y-3 pb-24 scrollbar-hide">
                {search.length === 0 ? (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest pl-1">推荐食材</p>
                    <div className="space-y-2">
                       {foodDb.slice(0, 8).map(food => (
                         <button 
                            key={food.id}
                            onClick={() => setSelectedQuickFood(food)}
                            className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-[#F4F1EA] hover:bg-[#F4F1EA] transition-all text-left shadow-sm active:scale-[0.98]"
                          >
                            <div className="w-11 h-11 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-xl border border-[#F4F1EA]">{food.icon}</div>
                            <div className="flex-1">
                              <p className="text-[15px] font-black text-[#5B544D]">{food.name}</p>
                              <p className="text-[10px] text-[#A5998D] font-black uppercase tracking-wide">{food.calories} kcal/100g</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                            </div>
                          </button>
                       ))}
                    </div>
                  </div>
                ) : filteredFood.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <p className="text-sm font-bold">没有在库中找到 "{search}"...</p>
                  </div>
                ) : (
                  filteredFood.map(food => (
                    <button 
                      key={food.id}
                      onClick={() => setSelectedQuickFood(food)}
                      className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-[#F4F1EA] hover:bg-[#F4F1EA] transition-all text-left shadow-sm active:scale-[0.98]"
                    >
                      <div className="w-11 h-11 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-xl border border-[#F4F1EA]">{food.icon}</div>
                      <div className="flex-1">
                        <p className="text-[15px] font-black text-[#5B544D]">{food.name}</p>
                        <p className="text-[10px] text-[#A5998D] font-black uppercase tracking-wide">{food.calories} kcal/100g</p>
                      </div>
                    </button>
                  ))
                )}
             </div>
          </div>

          {/* Weight Selection Dialog inside the Quick Add flow */}
          {selectedQuickFood && (
            <div className="fixed inset-0 bg-[#5B544D]/60 backdrop-blur-md z-[110] flex items-end justify-center animate-in fade-in duration-300 px-4 pb-12">
               <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-8 animate-in slide-in-from-bottom-full duration-400">
                  <div className="w-12 h-1.5 bg-[#F4F1EA] rounded-full mx-auto" />
                  
                  <div className="flex items-center gap-5 bg-[#FDFBF7] p-5 rounded-3xl border border-[#F4F1EA]">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#F4F1EA]">{selectedQuickFood.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#5B544D] tracking-tight">{selectedQuickFood.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                         <div className="px-2 py-0.5 bg-[#84A59D]/10 text-[#84A59D] rounded-md text-[9px] font-black uppercase">预计热量</div>
                         <span className="text-sm font-black text-[#5B544D]">{currentPreviewCals} <span className="text-[10px] text-[#A5998D]">kcal</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black text-[#A5998D] uppercase tracking-widest">摄入克数</label>
                      <span className="text-xs font-black text-[#CEC3B8]">GRAMS</span>
                    </div>
                    <input 
                      type="number" 
                      value={weight} 
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-6 bg-[#FDFBF7] rounded-[2rem] text-5xl font-black text-[#5B544D] border-2 border-[#F4F1EA] focus:border-[#84A59D] outline-none text-center"
                      autoFocus
                      inputMode="numeric"
                      pattern="\d*"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSelectedQuickFood(null)} className="py-5 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-black active:scale-95 transition-transform">返回搜索</button>
                    <button onClick={handleQuickAdd} className="py-5 bg-[#84A59D] text-white rounded-2xl font-black shadow-lg shadow-[#84A59D]/30 active:scale-95 transition-transform">确认记录</button>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyDashboard;
