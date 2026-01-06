
import React from 'react';
import { TrendDay } from '../types';

interface Props {
  trendData: TrendDay[];
}

const HistoryTrend: React.FC<Props> = ({ trendData }) => {
  const maxCal = Math.max(...trendData.map(d => Math.max(d.calories, d.goal)), 2000);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
            Weekly Trends
          </h3>
          <div className="px-3 py-1 bg-emerald-50 rounded-full">
             <span className="text-[10px] text-emerald-600 font-bold">Stable</span>
          </div>
        </div>
        
        <div className="flex items-end justify-between h-40 gap-3 px-1">
          {trendData.map((day, idx) => {
            const heightPerc = (day.calories / maxCal) * 100;
            const goalPerc = (day.goal / maxCal) * 100;
            const isOver = day.calories > day.goal;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full">
                {/* Value display */}
                <div className="mb-2 h-4 flex items-end">
                   <span className={`text-[9px] font-bold ${isOver ? 'text-orange-400' : 'text-gray-300'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                     {day.calories}
                   </span>
                </div>
                
                {/* Bar Container */}
                <div className="w-full relative flex items-end justify-center flex-grow bg-gray-50/50 rounded-full overflow-hidden">
                  <div 
                    className="absolute w-full border-t border-dashed border-gray-200 z-10"
                    style={{ bottom: `${goalPerc}%` }}
                  />
                  <div 
                    className={`w-1.5 transition-all duration-700 ease-out rounded-full ${isOver ? 'bg-orange-300' : 'bg-emerald-300'}`}
                    style={{ height: `${heightPerc}%` }}
                  />
                </div>
                
                <span className="text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-tighter">{day.dateLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-1">
        <div className="bg-blue-50/30 p-6 rounded-[2rem] border border-blue-50">
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Avg Protein</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {Math.round(trendData.reduce((acc, d) => acc + d.protein, 0) / 7)}<span className="text-xs font-medium ml-1">g</span>
          </p>
        </div>
        <div className="bg-orange-50/30 p-6 rounded-[2rem] border border-orange-50">
          <p className="text-[9px] text-orange-400 font-bold uppercase tracking-widest">Avg Carbs</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {Math.round(trendData.reduce((acc, d) => acc + d.carbs, 0) / 7)}<span className="text-xs font-medium ml-1">g</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryTrend;
