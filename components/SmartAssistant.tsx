
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
    const timer = setTimeout(() => {
      fetchAdvice();
    }, 1500);
    return () => clearTimeout(timer);
  }, [logs.length]);

  return (
    <div className="space-y-8 pb-4">
      <div className="bg-[#F4F1EA] rounded-[2rem] p-7 border border-[#E9E4DB] relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-sm shadow-sm">🌱</div>
          <h3 className="text-xs font-bold text-[#5B756E] tracking-[0.15em] uppercase">营养建议</h3>
          <button 
            onClick={fetchAdvice}
            disabled={loading}
            className="ml-auto p-2 text-[#A5998D] hover:text-[#84A59D] transition-colors"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        
        <div className="text-[14px] text-[#6B635B] leading-relaxed font-medium">
          {loading ? (
            <div className="flex gap-1.5 py-1">
              <div className="w-1.5 h-1.5 bg-[#CEC3B8] rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-[#CEC3B8] rounded-full animate-pulse [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-[#CEC3B8] rounded-full animate-pulse [animation-delay:0.4s]" />
            </div>
          ) : (
            advice || "正在根据您的饮食结构生成智能建议..."
          )}
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4 px-1">
          <h4 className="text-[10px] font-bold text-[#CEC3B8] tracking-[0.2em] uppercase">健康推荐</h4>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recommendations.map(rec => (
              <div 
                key={rec.foodId}
                onClick={() => onAddFood(foodDb.find(f => f.id === rec.foodId)!)}
                className="flex-shrink-0 w-36 bg-white border border-[#F4F1EA] p-5 rounded-2xl shadow-sm hover:border-[#84A59D]/40 transition-all active:scale-95 cursor-pointer"
              >
                <div className="text-[12px] font-bold text-[#5B544D] truncate">{rec.name}</div>
                <div className="text-[10px] text-[#84A59D] mt-1.5 font-bold">{rec.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAssistant;
