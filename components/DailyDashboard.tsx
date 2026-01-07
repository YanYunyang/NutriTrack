
import React from 'react';
import { MacroGoals, DailyLogEntry } from '../types';

interface Props {
  consumed: { calories: number; protein: number; fat: number; carbs: number };
  exerciseBurned?: number;
  goals: MacroGoals;
  logs: DailyLogEntry[];
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
  onAddClick: () => void;
}

const DailyDashboard: React.FC<Props> = ({ consumed, exerciseBurned = 0, goals, logs, onDeleteLog, onClearLogs, onAddClick }) => {
  const adjustedGoal = Math.round(goals.calories + exerciseBurned);
  const roundedConsumed = Math.round(consumed.calories);
  const calPercent = Math.min(Math.round((roundedConsumed / adjustedGoal) * 100), 100);
  const remainingCals = Math.max(0, adjustedGoal - roundedConsumed);

  return (
    <div className="space-y-8 relative">
      {/* Dashboard Card - MD3 Large Surface */}
      <div className="bg-[#F4F1EA] p-8 rounded-[2rem] flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black tracking-widest text-[#A5998D] uppercase">剩余额度</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-[#5B544D] tracking-tighter">{remainingCals}</span>
              <span className="text-lg font-black text-[#84A59D]">kcal</span>
            </div>
          </div>
          <div className="relative w-24 h-24">
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
               <span className="text-[13px] font-black text-[#5B544D]">{calPercent}%</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '蛋白质', val: consumed.protein, goal: goals.protein, color: 'bg-[#A8BCC9]' },
            { label: '碳水', val: consumed.carbs, goal: goals.carbs, color: 'bg-[#D9A78D]' },
            { label: '脂肪', val: consumed.fat, goal: goals.fat, color: 'bg-[#E9C46A]' }
          ].map(m => (
            <div key={m.label} className="bg-white/60 p-4 rounded-2xl flex flex-col gap-1.5 border border-white/40">
              <span className="text-[9px] font-black text-[#A5998D] uppercase">{m.label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[14px] font-black text-[#5B544D]">{Math.round(m.val)}</span>
                <span className="text-[10px] font-bold text-[#CEC3B8]">/ {Math.round(m.goal)}g</span>
              </div>
              <div className="h-1.5 w-full bg-[#E9E4DB] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${m.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log List - MD3 List Style */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-[#CEC3B8] tracking-[0.2em] uppercase">今日进食日志</h3>
        </div>

        {logs.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-[#F4F1EA] rounded-[2rem]">
            <p className="text-[13px] text-[#A5998D] font-black">轻按右下角开始记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-[1.75rem] flex items-center justify-between border border-[#F4F1EA] active:scale-[0.98] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl border border-[#F4F1EA] shadow-inner">{log.icon}</div>
                  <div>
                    <h4 className="font-black text-[#5B544D] tracking-tight leading-tight">{log.foodName}</h4>
                    <p className="text-[11px] text-[#A5998D] font-bold mt-1 uppercase">{log.weight}g · {Math.round(log.nutrients.calories)} kcal</p>
                  </div>
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="p-3 text-[#E9E4DB] hover:text-[#D9A78D] transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MD3 FAB - Large Floating Action Button */}
      <button 
        onClick={onAddClick}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#84A59D] text-white rounded-[1.25rem] shadow-2xl flex items-center justify-center active:scale-90 active:bg-[#5B756E] transition-all z-50 ring-4 ring-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
      </button>
    </div>
  );
};

export default DailyDashboard;
