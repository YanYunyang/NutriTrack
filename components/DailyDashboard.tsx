
import React from 'react';
import { MacroGoals, DailyLogEntry } from '../types';

interface Props {
  consumed: { calories: number; protein: number; fat: number; carbs: number };
  exerciseBurned?: number;
  goals: MacroGoals;
  logs: DailyLogEntry[];
  onDeleteLog: (id: string) => void;
  onClearLogs: () => void;
}

const DailyDashboard: React.FC<Props> = ({ consumed, exerciseBurned = 0, goals, logs, onDeleteLog, onClearLogs }) => {
  const adjustedGoal = goals.calories + exerciseBurned;
  const calPercent = Math.min(Math.round((consumed.calories / adjustedGoal) * 100), 100);
  const remainingCals = Math.max(0, adjustedGoal - Math.round(consumed.calories));

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
      {/* Warm Calorie Ring */}
      <div className="relative bg-white rounded-[2rem] p-9 shadow-[0_10px_30px_rgba(165,153,141,0.05)] border border-[#F4F1EA] flex items-center justify-between overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#84A59D] tracking-[0.2em] uppercase">剩余热量</span>
            {exerciseBurned > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 bg-[#84A59D]/10 text-[#84A59D] rounded-full font-bold">
                + {exerciseBurned} 运动奖励
              </span>
            )}
          </div>
          <div className="text-5xl font-bold text-[#5B544D] tracking-tighter">
            {remainingCals}
          </div>
          <p className="text-[11px] text-[#A5998D] font-medium">
            今日预算: <span className="text-[#84A59D] font-bold">{adjustedGoal} kcal</span>
          </p>
        </div>
        
        <div className="relative w-28 h-28 flex items-center justify-center">
           <svg className="w-full h-full -rotate-90">
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
             <span className="text-lg font-black text-[#5B544D]">{calPercent}%</span>
           </div>
        </div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F9F6F1] rounded-full blur-[50px] opacity-60" />
      </div>

      {/* Warm Macros List */}
      <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-[#F4F1EA] space-y-6">
        <MacroItem label="蛋白质" current={consumed.protein} target={goals.protein} color="bg-[#A8BCC9]" icon="🥩" />
        <MacroItem label="碳水" current={consumed.carbs} target={goals.carbs} color="bg-[#D9A78D]" icon="🍞" />
        <MacroItem label="脂肪" current={consumed.fat} target={goals.fat} color="bg-[#E9C46A]" icon="🥑" />
      </div>

      {/* History List */}
      <div className="space-y-5">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-[#CEC3B8] tracking-widest uppercase">今日日志</h3>
          {logs.length > 0 && (
            <button onClick={onClearLogs} className="text-[10px] text-[#CEC3B8] font-bold hover:text-red-300 transition-colors uppercase">
              清空
            </button>
          )}
        </div>
        
        {logs.length === 0 ? (
          <div className="py-16 text-center bg-[#F9F7F4]/50 rounded-[2rem] border border-dashed border-[#E9E4DB]">
            <p className="text-xs text-[#CEC3B8] font-medium tracking-wide">暂无进食记录，开启美好一天</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div 
                key={log.id} 
                className="bg-white px-6 py-5 rounded-[1.5rem] flex items-center justify-between group border border-[#F4F1EA] hover:border-[#84A59D]/30 transition-all"
              >
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
