
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

  const maxCal = Math.max(...trendData.map(d => Math.max(d.calories, d.goal)), 2000);
  // 为了让图表更清晰，宏量营养素的最大值需要同时考虑实测值和目标值
  const maxMacro = Math.max(...trendData.map(d => Math.max(d.protein, d.fat, d.carbs, d.proteinGoal, d.fatGoal, d.carbsGoal)), 100);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      const res = await getTrendAnalysis(trendData);
      setAnalysis(res);
      setLoading(false);
    };
    fetchAnalysis();
  }, [trendData]);

  const StatCard = ({ label, value, goal, unit, colorClass, bgClass }: { label: string, value: number, goal: number, unit: string, colorClass: string, bgClass: string }) => (
    <div className={`${bgClass} p-5 rounded-[1.5rem] border border-transparent hover:border-current/10 transition-all`}>
      <p className={`text-[9px] ${colorClass} font-bold uppercase tracking-widest`}>{label}</p>
      <p className="text-xl font-bold text-[#5B544D] mt-1">
        {value}<span className="text-[10px] font-medium opacity-40 ml-1">/ {goal} {unit}</span>
      </p>
      <div className="mt-2 h-1 w-full bg-white/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass.replace('text-', 'bg-')} opacity-60 rounded-full transition-all duration-1000`} 
          style={{ width: `${Math.min((value / goal) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* AI Weekly Insight */}
      <div className="bg-[#84A59D] rounded-[2rem] p-7 shadow-xl shadow-[#84A59D]/10 relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-sm">✨</div>
          <h3 className="text-[11px] font-bold text-white tracking-[0.2em] uppercase">AI 目标对比深度分析</h3>
        </div>
        <div className="text-[13px] text-white/90 leading-relaxed font-medium">
          {loading ? (
            <div className="flex gap-1.5 py-1">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          ) : (
            analysis || "正在对比您的实际摄入与目标差异..."
          )}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex bg-[#F4F1EA] p-1.5 rounded-2xl border border-[#E9E4DB] mx-1">
        <button 
          onClick={() => setActiveTab('calories')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all ${activeTab === 'calories' ? 'bg-white shadow-sm text-[#84A59D]' : 'text-[#CEC3B8]'}`}
        >
          热量趋势
        </button>
        <button 
          onClick={() => setActiveTab('macros')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-tight transition-all ${activeTab === 'macros' ? 'bg-white shadow-sm text-[#84A59D]' : 'text-[#CEC3B8]'}`}
        >
          营养素对比
        </button>
      </div>

      {/* Dynamic Chart Area */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-[#F4F1EA] shadow-sm">
        <div className="flex items-end justify-between h-48 gap-3">
          {trendData.map((day, idx) => {
            const isOver = day.calories > day.goal;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group h-full">
                <div className="relative flex items-end justify-center w-full flex-grow bg-[#FDFBF7] rounded-full overflow-hidden border border-[#F4F1EA]/50">
                  {activeTab === 'calories' ? (
                    <>
                      <div 
                        className="absolute w-full border-t border-dashed border-[#CEC3B8]/40 z-10"
                        style={{ bottom: `${(day.goal / maxCal) * 100}%` }}
                      />
                      <div 
                        className={`w-2 transition-all duration-1000 ease-out rounded-full ${isOver ? 'bg-[#D9A78D]' : 'bg-[#84A59D]'}`}
                        style={{ height: `${(day.calories / maxCal) * 100}%` }}
                      />
                    </>
                  ) : (
                    <div className="flex items-end gap-[3px] h-full pb-1 relative w-full justify-center">
                      {/* Protein Actual vs Goal Marker */}
                      <div className="flex flex-col items-center relative h-full justify-end">
                         <div className="w-1.5 bg-[#A8BCC9] rounded-full transition-all duration-700" style={{ height: `${(day.protein / maxMacro) * 100}%` }} />
                         <div className="absolute w-2 h-[2px] bg-[#5B544D]/20 z-10" style={{ bottom: `${(day.proteinGoal / maxMacro) * 100}%` }} />
                      </div>
                      {/* Carbs Actual vs Goal Marker */}
                      <div className="flex flex-col items-center relative h-full justify-end">
                        <div className="w-1.5 bg-[#D9A78D] rounded-full transition-all duration-700 delay-100" style={{ height: `${(day.carbs / maxMacro) * 100}%` }} />
                        <div className="absolute w-2 h-[2px] bg-[#5B544D]/20 z-10" style={{ bottom: `${(day.carbsGoal / maxMacro) * 100}%` }} />
                      </div>
                      {/* Fat Actual vs Goal Marker */}
                      <div className="flex flex-col items-center relative h-full justify-end">
                        <div className="w-1.5 bg-[#E9C46A] rounded-full transition-all duration-700 delay-200" style={{ height: `${(day.fat / maxMacro) * 100}%` }} />
                        <div className="absolute w-2 h-[2px] bg-[#5B544D]/20 z-10" style={{ bottom: `${(day.fatGoal / maxMacro) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#CEC3B8] mt-4 font-bold uppercase tracking-tighter">{day.dateLabel}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-6">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#A8BCC9]" /><span className="text-[9px] font-bold text-[#A5998D]">蛋白</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D9A78D]" /><span className="text-[9px] font-bold text-[#A5998D]">碳水</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#E9C46A]" /><span className="text-[9px] font-bold text-[#A5998D]">脂肪</span></div>
          {activeTab === 'macros' && (
            <div className="flex items-center gap-1.5"><div className="w-2 h-[2px] bg-[#5B544D]/30" /><span className="text-[9px] font-bold text-[#CEC3B8]">目标线</span></div>
          )}
        </div>
      </div>

      {/* Average Stats Grid with Goals */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <StatCard 
          label="蛋白均值" 
          value={Math.round(trendData.reduce((acc, d) => acc + d.protein, 0) / 7)} 
          goal={Math.round(trendData.reduce((acc, d) => acc + d.proteinGoal, 0) / 7)}
          unit="g" 
          colorClass="text-[#A8BCC9]" 
          bgClass="bg-[#F4F7F9]" 
        />
        <StatCard 
          label="碳水均值" 
          value={Math.round(trendData.reduce((acc, d) => acc + d.carbs, 0) / 7)} 
          goal={Math.round(trendData.reduce((acc, d) => acc + d.carbsGoal, 0) / 7)}
          unit="g" 
          colorClass="text-[#D9A78D]" 
          bgClass="bg-[#FAF4F2]" 
        />
        <StatCard 
          label="脂肪均值" 
          value={Math.round(trendData.reduce((acc, d) => acc + d.fat, 0) / 7)} 
          goal={Math.round(trendData.reduce((acc, d) => acc + d.fatGoal, 0) / 7)}
          unit="g" 
          colorClass="text-[#E9C46A]" 
          bgClass="bg-[#FAF8F1]" 
        />
        <StatCard 
          label="日均热量" 
          value={Math.round(trendData.reduce((acc, d) => acc + d.calories, 0) / 7)} 
          goal={Math.round(trendData.reduce((acc, d) => acc + d.goal, 0) / 7)}
          unit="kcal" 
          colorClass="text-[#84A59D]" 
          bgClass="bg-[#F6F8F7]" 
        />
      </div>
    </div>
  );
};

export default HistoryTrend;
