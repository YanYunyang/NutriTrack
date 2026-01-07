
import React, { useState, useEffect } from 'react';
import { FoodItem, MacroGoals, DailyLogEntry } from '../types';
import { getSmartRecommendations } from '../utils/calculators';
import { getGeminiAdvice } from '../services/geminiService';

interface Props {
  consumed: { calories: number; protein: number; fat: number; carbs: number };
  goals: MacroGoals;
  foodDb: FoodItem[];
  logs: DailyLogEntry[];
  onAddFood: (f: FoodItem) => void;
}

const SmartAssistant: React.FC<Props> = ({ consumed, goals, foodDb, logs, onAddFood }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const recommendations = getSmartRecommendations(foodDb, consumed, goals);

  const fetchAdvice = async () => {
    setLoading(true);
    const recentNames = logs.slice(0, 5).map(l => l.foodName);
    const res = await getGeminiAdvice(consumed, goals, recentNames);
    setAdvice(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, [logs.length, goals.calories]);

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-[#84A59D] text-white p-8 rounded-[3rem] shadow-xl shadow-[#84A59D]/10 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl">🌿</span>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">智能饮食建议</h3>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="ml-auto p-1 text-white/60 hover:text-white transition-colors"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        <p className="text-[15px] font-black leading-relaxed tracking-tight">
          {loading ? "正在计算您的专属方案..." : advice}
        </p>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-5 px-1">
          <h4 className="text-[10px] font-black text-[#CEC3B8] tracking-[0.3em] uppercase">补给灵感</h4>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recommendations.map(rec => {
              const food = foodDb.find(f => f.id === rec.foodId);
              return (
                <div 
                  key={rec.foodId}
                  onClick={() => food && onAddFood(food)}
                  className="flex-shrink-0 w-44 bg-white border border-[#F4F1EA] p-6 rounded-[2.5rem] shadow-sm hover:border-[#84A59D] transition-all cursor-pointer active:scale-95 group"
                >
                  <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {food?.icon}
                  </div>
                  <h5 className="font-black text-[#5B544D] truncate">{rec.name}</h5>
                  <p className="text-[10px] text-[#84A59D] font-black mt-1 uppercase tracking-wider">{rec.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
