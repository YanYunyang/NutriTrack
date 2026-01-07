
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
    <div className="space-y-12">
      {/* Main Stats - Clearer & Fresher */}
      <div className="relative overflow-hidden pt-4">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
             <p className="text-[11px] text-[#A5998D] font-black tracking-[0.2em] uppercase">剩余热量摄入</p>
             <div className="flex items-baseline gap-2">
               <span className="text-7xl font-black text-[#5B544D] tracking-tighter">{remainingCals}</span>
               <span className="text-xl font-black text-[#84A59D]">kcal</span>
             </div>
           </div>
           
           <div className="relative w-24 h-24">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="#F4F1EA" strokeWidth="10" />
               <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#84A59D" strokeWidth="10" 
                strokeDasharray="282.7" 
                strokeDashoffset={282.7 * (1 - calPercent / 100)} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-xs font-black text-[#5B544D]">{calPercent}%</span>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-white border border-[#F4F1EA] p-6 rounded-[2.5rem] shadow-sm">
          {[
            { label: '蛋白质', val: consumed.protein, goal: goals.protein, color: 'bg-[#A8BCC9]' },
            { label: '碳水', val: consumed.carbs, goal: goals.carbs, color: 'bg-[#D9A78D]' },
            { label: '脂肪', val: consumed.fat, goal: goals.fat, color: 'bg-[#E9C46A]' }
          ].map(m => (
            <div key={m.label} className="space-y-2">
              <span className="text-[10px] text-[#A5998D] font-black tracking-widest uppercase">{m.label}</span>
              <div className="text-[15px] font-black text-[#5B544D]">{Math.round(m.val)}g</div>
              <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F4F1EA] overflow-hidden">
                <div 
                  className={`h-full ${m.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min((m.val / m.goal) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs - Minimalist List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-[#CEC3B8] tracking-[0.2em] uppercase px-1">今日进食日志</h3>
          <button onClick={onAddClick} className="w-10 h-10 bg-[#FDFBF7] border border-[#F4F1EA] rounded-2xl flex items-center justify-center text-[#84A59D] active:scale-90 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="py-20 text-center bg-[#FDFBF7] rounded-[3rem] border-2 border-dashed border-[#F4EFEA]">
            <p className="text-[13px] text-[#A5998D] font-bold">还没有记录，开始规划今天的第一餐</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="bg-white p-5 rounded-[2rem] border border-[#F4F1EA] flex items-center justify-between group transition-all hover:border-[#84A59D]/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#FDFBF7] border border-[#F4F1EA] rounded-2xl flex items-center justify-center text-2xl">{log.icon}</div>
                  <div>
                    <h4 className="font-black text-[#5B544D] tracking-tight">{log.foodName}</h4>
                    <p className="text-[11px] text-[#A5998D] font-bold uppercase mt-1">{log.weight}g · {Math.round(log.nutrients.calories)} kcal</p>
                  </div>
                </div>
                <button onClick={() => onDeleteLog(log.id)} className="p-3 text-[#F4F1EA] hover:text-[#D9A78D] transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
