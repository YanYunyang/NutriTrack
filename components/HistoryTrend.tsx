
import React, { useState, useEffect } from 'react';
import { TrendDay } from '../types';
import { getTrendAnalysis } from '../services/geminiService';

interface Props {
  trendData: TrendDay[];
}

const HistoryTrend: React.FC<Props> = ({ trendData }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'calories' | 'macros'>('calories');

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const res = await getTrendAnalysis(trendData);
      setAnalysis(res);
      setLoading(false);
    };
    fetchAnalysis();
  }, [trendData]);

  const maxCal = Math.max(...trendData.map(d => Math.max(d.calories, d.goal)), 2000);

  const MacroMiniChart = ({ 
    label, 
    data, 
    goalKey, 
    valKey, 
    color, 
    bgColor 
  }: { 
    label: string, 
    data: TrendDay[], 
    goalKey: keyof TrendDay, 
    valKey: keyof TrendDay, 
    color: string,
    bgColor: string
  }) => {
    // 计算平均达成率
    const avgPercent = Math.round(
      (data.reduce((acc, d) => acc + (d[valKey] as number), 0) / 
       data.reduce((acc, d) => acc + (d[goalKey] as number), 0)) * 100
    );

    return (
      <div className={`${bgColor} rounded-[2rem] p-5 border border-[#F4F1EA] space-y-4`}>
        <div className="flex justify-between items-center px-1">
          <h5 className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{label}达成趋势</h5>
          <span className={`text-[10px] font-black ${color} bg-white px-2 py-0.5 rounded-full shadow-sm`}>周均 {avgPercent}%</span>
        </div>
        
        <div className="h-32 flex items-end justify-between gap-1 relative pt-4">
          {/* 100% 水位线 */}
          <div className="absolute left-0 right-0 border-t border-dashed border-[#5B544D]/20 z-0" style={{ bottom: '70%' }}>
            <span className="absolute -top-3 right-0 text-[6px] font-black text-[#CEC3B8] uppercase">Target</span>
          </div>

          {data.map((day, i) => {
            const val = day[valKey] as number;
            const goal = day[goalKey] as number;
            const percent = (val / goal) * 70; // 70% 高度设为目标水位线点
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
                <div className="w-full relative flex flex-col items-center justify-end h-full">
                  <div 
                    className={`w-3 md:w-4 rounded-t-full transition-all duration-700 ${color.replace('text-', 'bg-')} ${percent > 70 ? 'brightness-90 shadow-lg' : 'opacity-80'}`}
                    style={{ height: `${Math.min(percent, 100)}%` }}
                  />
                </div>
                <span className="text-[7px] font-bold text-[#CEC3B8] mt-2 group-last:text-[#84A59D] group-last:font-black">
                  {day.dateLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, goal, unit, colorClass, bgClass }: { label: string, value: number, goal: number, unit: string, colorClass: string, bgClass: string }) => {
    const diff = value - goal;
    const isOver = diff > 0;
    const absDiff = Math.abs(Math.round(diff));

    return (
      <div className={`${bgClass} p-5 rounded-[2rem] border border-[#F4F1EA] shadow-sm`}>
        <p className={`text-[9px] ${colorClass} font-black uppercase tracking-[0.2em]`}>{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-black text-[#5B544D]">{Math.round(value)}</span>
          <span className="text-[10px] font-bold text-[#A5998D] opacity-40">/ {Math.round(goal)} {unit}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-[9px] font-black text-[#CEC3B8] uppercase">{isOver ? '超出' : '缺口'}</span>
          <span className={`text-[10px] font-black ${isOver ? 'text-[#D9A78D]' : 'text-[#84A59D]'}`}>
            {isOver ? '+' : '-'}{absDiff} {unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Smart Analysis Header */}
      <div className="bg-[#5B756E] rounded-[2.5rem] p-8 shadow-2xl shadow-[#5B756E]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-lg">💡</div>
          <h3 className="text-[11px] font-black text-white tracking-[0.3em] uppercase">周度饮食趋势报告</h3>
        </div>
        <div className="text-[14px] text-white/90 leading-relaxed font-medium whitespace-pre-line relative z-10">
          {loading ? (
            <div className="flex gap-2 py-2">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            analysis || "正在扫描数据..."
          )}
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex bg-[#F4F1EA] p-1.5 rounded-[1.5rem] mx-1 border border-white">
        <button 
          onClick={() => setActiveTab('calories')}
          className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${activeTab === 'calories' ? 'bg-white shadow-md text-[#84A59D]' : 'text-[#A5998D] opacity-60'}`}
        >
          热量趋势
        </button>
        <button 
          onClick={() => setActiveTab('macros')}
          className={`flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest transition-all ${activeTab === 'macros' ? 'bg-white shadow-md text-[#84A59D]' : 'text-[#A5998D] opacity-60'}`}
        >
          营养达成率
        </button>
      </div>

      {activeTab === 'calories' ? (
        <div className="bg-white rounded-[3rem] p-8 border border-[#F4F1EA] shadow-sm">
          <div className="flex items-end justify-between h-56 gap-2 md:gap-4 relative">
             {/* 100% Calorie Line */}
             <div className="absolute left-0 right-0 border-t border-dashed border-[#5B544D]/10 z-0" style={{ bottom: '70%' }} />
             
             {trendData.map((day, idx) => {
               const percent = (day.calories / day.goal) * 70;
               return (
                 <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative">
                   <div 
                     className={`w-3 md:w-4 rounded-t-full transition-all duration-1000 ${percent > 75 ? 'bg-[#D9A78D]' : 'bg-[#84A59D]'}`}
                     style={{ height: `${Math.min(percent, 100)}%` }}
                   />
                   <span className={`text-[8px] mt-4 font-black uppercase ${idx === 6 ? 'text-[#84A59D]' : 'text-[#CEC3B8]'}`}>{day.dateLabel}</span>
                 </div>
               );
             })}
          </div>
          <div className="mt-8 flex justify-center gap-4">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#84A59D]" /><span className="text-[9px] font-black text-[#A5998D] uppercase">正常</span></div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D9A78D]" /><span className="text-[9px] font-black text-[#A5998D] uppercase">超量</span></div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <MacroMiniChart label="蛋白质" data={trendData} valKey="protein" goalKey="proteinGoal" color="text-[#A8BCC9]" bgColor="bg-[#F4F7F9]" />
          <MacroMiniChart label="碳水化合物" data={trendData} valKey="carbs" goalKey="carbsGoal" color="text-[#D9A78D]" bgColor="bg-[#FAF4F2]" />
          <MacroMiniChart label="脂肪" data={trendData} valKey="fat" goalKey="fatGoal" color="text-[#E9C46A]" bgColor="bg-[#FAF8F1]" />
        </div>
      )}

      {/* Average Statistics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {(() => {
          const validTrend = trendData.filter(d => d.calories > 0);
          const count = validTrend.length || 1;
          const sum = (key: keyof TrendDay) => validTrend.reduce((acc, d) => acc + (d[key] as number), 0) / count;

          return (
            <>
              <StatCard label="蛋白质均值" value={sum('protein')} goal={sum('proteinGoal')} unit="g" colorClass="text-[#A8BCC9]" bgClass="bg-[#F4F7F9]" />
              <StatCard label="碳水均值" value={sum('carbs')} goal={sum('carbsGoal')} unit="g" colorClass="text-[#D9A78D]" bgClass="bg-[#FAF4F2]" />
              <StatCard label="脂肪均值" value={sum('fat')} goal={sum('fatGoal')} unit="g" colorClass="text-[#E9C46A]" bgClass="bg-[#FAF8F1]" />
              <StatCard label="总热量均值" value={sum('calories')} goal={sum('goal')} unit="kcal" colorClass="text-[#84A59D]" bgClass="bg-[#F6F8F7]" />
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default HistoryTrend;
