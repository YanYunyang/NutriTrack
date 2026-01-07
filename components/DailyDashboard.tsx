
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

  const MacroItem = ({ label, current, target, color, icon }: { label: string, current: number, target: number, color: string, icon: string }) => {
    const percent = Math.min(Math.round((current / target) * 100), 100);
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <span className="text-[10px] font-black text-[#A5998D] tracking-[0.15em] uppercase">{label}</span>
          </div>
          <span className="text-[13px] font-black text-[#5B544D]">{Math.round(current)}<span className="text-[9px] opacity-40 ml-0.5 font-bold">g</span></span>
        </div>
        <div className="h-2 w-full bg-[#F4F1EA] rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 rounded-full ${color}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="relative bg-white rounded-[2.5rem] p-7 sm:p-9 shadow-[0_15px_40px_rgba(165,153,141,0.06)] border border-[#F4F1EA] flex items-center justify-between overflow-hidden">
        <div className="relative z-10 space-y-2.5 flex-1 min-w-0 pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-[#84A59D] tracking-[0.2em] uppercase whitespace-nowrap">剩余预算</span>
            {exerciseBurned > 0 && (
              <span className="text-[9px] px-2 py-0.5 bg-[#84A59D]/10 text-[#84A59D] rounded-lg font-black whitespace-nowrap">
                + {Math.round(exerciseBurned)} 运动奖励
              </span>
            )}
          </div>
          <div className="text-6xl font-black text-[#5B544D] tracking-tighter truncate">
            {remainingCals}
          </div>
          <p className="text-[11px] text-[#A5998D] font-bold tracking-wide">
            今日计划: <span className="text-[#84A59D] font-black">{adjustedGoal} kcal</span>
          </p>
        </div>
        
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="50" className="stroke-[#F4F1EA]" strokeWidth="8" fill="none" />
              <circle 
                cx="56" cy="56" r="50" 
                className="stroke-[#84A59D]" strokeWidth="8" fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - calPercent / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
             <span className="text-lg font-black text-[#5B544D]">{calPercent}%</span>
           </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FDFBF7] rounded-full blur-[60px] opacity-80" />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#F4F1EA] space-y-7">
        <MacroItem label="蛋白质" current={consumed.protein} target={goals.protein} color="bg-[#A8BCC9]" icon="🥩" />
        <MacroItem label="碳水" current={consumed.carbs} target={goals.carbs} color="bg-[#D9A78D]" icon="🍞" />
        <MacroItem label="脂肪" current={consumed.fat} target={goals.fat} color="bg-[#E9C46A]" icon="🥑" />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xs font-black text-[#CEC3B8] tracking-[0.25em] uppercase">今日日志</h3>
          <div className="flex gap-4 items-center">
            {logs.length > 0 && (
              <button onClick={onClearLogs} className="text-[10px] text-[#CEC3B8] font-black hover:text-[#D9A78D] transition-colors uppercase tracking-widest">
                清空
              </button>
            )}
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#84A59D] text-white rounded-2xl text-[11px] font-black shadow-xl shadow-[#84A59D]/25 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.8" d="M12 4v16m8-8H4" />
              </svg>
              记录饮食
            </button>
          </div>
        </div>
        
        {logs.length === 0 ? (
          <div onClick={onAddClick} className="py-20 text-center bg-[#F9F7F4]/50 rounded-[2.5rem] border-2 border-dashed border-[#E9E4DB] cursor-pointer hover:bg-[#F4F1EA] transition-all group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F4EFEA] group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-[#CEC3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-[13px] text-[#A5998D] font-bold tracking-wide">暂无进食记录，开启美好一天</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="bg-white px-6 py-5 rounded-[2rem] flex items-center justify-between group border border-[#F4F1EA] hover:border-[#84A59D]/30 transition-all shadow-sm">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-[#F4EFEA]">
                     {log.icon || '🍱'}
                   </div>
                   <div>
                     <h4 className="text-[15px] font-black text-[#5B544D]">{log.foodName}</h4>
                     <p className="text-[11px] text-[#A5998D] font-black mt-1">
                       {log.weight}g · {Math.round(log.nutrients.calories)} <span className="text-[9px] opacity-60">kcal</span>
                     </p>
                   </div>
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="p-2.5 text-[#E9E4DB] hover:text-[#D9A78D] transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyDashboard;
