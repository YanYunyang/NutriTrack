
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
      <div className="space-y-2.5">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">{icon}</span>
            <span className="text-[10px] font-bold text-[#A5998D] tracking-wider uppercase">{label}</span>
          </div>
          <span className="text-xs font-bold text-[#5B544D]">{Math.round(current)}g</span>
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
      <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(165,153,141,0.05)] border border-[#F4F1EA] flex items-center justify-between overflow-hidden">
        <div className="relative z-10 space-y-2 flex-1 min-w-0 pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-[#84A59D] tracking-[0.2em] uppercase whitespace-nowrap">剩余热量</span>
            {exerciseBurned > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#84A59D]/10 text-[#84A59D] rounded-full font-bold whitespace-nowrap">
                + {Math.round(exerciseBurned)} 运动奖励
              </span>
            )}
          </div>
          <div className="text-5xl font-bold text-[#5B544D] tracking-tighter truncate">
            {remainingCals}
          </div>
          <p className="text-[11px] text-[#A5998D] font-medium">
            今日预算: <span className="text-[#84A59D] font-bold">{adjustedGoal} kcal</span>
          </p>
        </div>
        
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="50" className="stroke-[#F4F1EA]" strokeWidth="7" fill="none" />
              <circle 
                cx="56" cy="56" r="50" 
                className="stroke-[#84A59D]" strokeWidth="7" fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - calPercent / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
             <span className="text-base font-black text-[#5B544D]">{calPercent}%</span>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F6F1] rounded-full blur-[50px] opacity-60" />
      </div>

      <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-[#F4F1EA] space-y-6">
        <MacroItem label="蛋白质" current={consumed.protein} target={goals.protein} color="bg-[#A8BCC9]" icon="🥩" />
        <MacroItem label="碳水" current={consumed.carbs} target={goals.carbs} color="bg-[#D9A78D]" icon="🍞" />
        <MacroItem label="脂肪" current={consumed.fat} target={goals.fat} color="bg-[#E9C46A]" icon="🥑" />
      </div>

      <div className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#CEC3B8] tracking-widest uppercase">今日日志</h3>
          <div className="flex gap-4 items-center">
            {logs.length > 0 && (
              <button onClick={onClearLogs} className="text-[10px] text-[#CEC3B8] font-bold hover:text-red-400 transition-colors uppercase">
                清空
              </button>
            )}
            <button 
              onClick={onAddClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#84A59D] text-white rounded-full text-[11px] font-bold shadow-lg shadow-[#84A59D]/20 active:scale-95 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              记录饮食
            </button>
          </div>
        </div>
        
        {logs.length === 0 ? (
          <div onClick={onAddClick} className="py-16 text-center bg-[#F9F7F4]/50 rounded-[2rem] border border-dashed border-[#E9E4DB] cursor-pointer hover:bg-[#F4F1EA] transition-colors">
            <p className="text-xs text-[#CEC3B8] font-medium tracking-wide">暂无进食记录，开启美好一天</p>
            <p className="text-[10px] text-[#84A59D] mt-2 font-bold underline">点击开始记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white px-6 py-5 rounded-[1.5rem] flex items-center justify-between group border border-[#F4F1EA] hover:border-[#84A59D]/30 transition-all">
                <div className="flex items-center gap-5">
                   <div className="w-11 h-11 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-xl shadow-inner border border-[#F4EFEA]">
                     {log.foodName.includes('鸡') ? '🍗' : log.foodName.includes('蛋') ? '🍳' : log.foodName.includes('菜') ? '🥗' : '🍱'}
                   </div>
                   <div>
                     <h4 className="text-[15px] font-bold text-[#5B544D]">{log.foodName}</h4>
                     <p className="text-[11px] text-[#A5998D] font-bold mt-0.5">
                       {log.weight}g · {Math.round(log.nutrients.calories)} kcal
                     </p>
                   </div>
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="p-2 text-[#E9E4DB] hover:text-[#D9A78D] transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
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
