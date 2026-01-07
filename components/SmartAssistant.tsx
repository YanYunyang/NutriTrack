
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
    <div className="space-y-8 pb-4">
      <div className="bg-[#F4F1EA] rounded-[2.5rem] p-8 border border-[#E9E4DB] relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-white rounded-2xl flex items-center justify-center text-lg shadow-sm">🌱</div>
          <div className="flex flex-col">
            <h3 className="text-xs font-black text-[#5B756E] tracking-[0.2em] uppercase">营养建议</h3>
            <span className="text-[8px] text-[#A5998D] font-black uppercase tracking-[0.2em] mt-1 opacity-60">Local Intelligence</span>
          </div>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="ml-auto p-2.5 text-[#A5998D] hover:text-[#84A59D] transition-colors"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="text-[14px] text-[#6B635B] leading-relaxed font-bold">
          {loading ? (
            <div className="flex gap-2 py-2">
              <div className="w-2 h-2 bg-[#CEC3B8] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#CEC3B8] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-[#CEC3B8] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            advice || "正在为您计算今日饮食的最佳优化方案..."
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-5 px-1">
          <h4 className="text-[10px] font-black text-[#CEC3B8] tracking-[0.3em] uppercase">健康灵感</h4>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recommendations.map(rec => (
              <div 
                key={rec.foodId}
                onClick={() => onAddFood(foodDb.find(f => f.id === rec.foodId)!)}
                className="flex-shrink-0 w-40 bg-white border border-[#F4F1EA] p-6 rounded-[2rem] shadow-sm hover:border-[#84A59D]/40 transition-all active:scale-95 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-white group-hover:scale-110 transition-all">
                  {foodDb.find(f => f.id === rec.foodId)?.icon || '🍱'}
                </div>
                <div className="text-[13px] font-black text-[#5B544D] truncate">{rec.name}</div>
                <div className="text-[10px] text-[#84A59D] mt-2 font-black tracking-tight">{rec.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
