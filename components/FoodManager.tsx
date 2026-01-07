
import React, { useState } from 'react';
import { FoodItem } from '../types';

interface Props {
  foodDb: FoodItem[];
  setFoodDb: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  onLogFood: (food: FoodItem, weight: number) => void;
  onBack: () => void;
}

const PRESET_ICONS = [
  '🍱', '🍗', '🥩', '🐟', '🦐', '🥚', '🥛', '🍞', '🍚', '🍜', '🍝', '🥣',
  '🥦', '🥗', '🥕', '🍅', '🌽', '🍎', '🍌', '🥑', '🫐', '🍓', '🥜', '🍠',
  '☕', '🍵', '🥤', '🍰'
];

const FoodManager: React.FC<Props> = ({ foodDb, setFoodDb, onLogFood, onBack }) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [logWeight, setLogWeight] = useState('100');

  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '', icon: '🍱', calories: 0, protein: 0, fat: 0, carbs: 0
  });

  const filteredFood = foodDb.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddFood = () => {
    if (!newFood.name) return;
    const item: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      icon: newFood.icon || '🍱',
      calories: Number(newFood.calories) || 0,
      protein: Number(newFood.protein) || 0,
      fat: Number(newFood.fat) || 0,
      carbs: Number(newFood.carbs) || 0,
    };
    setFoodDb(prev => [...prev, item]);
    setNewFood({ name: '', icon: '🍱', calories: 0, protein: 0, fat: 0, carbs: 0 });
    setShowAddForm(false);
  };

  const handleLog = () => {
    if (selectedFood && logWeight) {
      onLogFood(selectedFood, parseFloat(logWeight));
      setSelectedFood(null);
      onBack();
    }
  };

  const deleteFood = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要从食物库中移除吗？')) {
      setFoodDb(prev => prev.filter(f => f.id !== id));
    }
  };

  // 实时热量预览计算
  const previewCalories = selectedFood ? Math.round((selectedFood.calories * (parseFloat(logWeight) || 0)) / 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Search Bar */}
      <div className="bg-[#F4F1EA] rounded-full px-5 py-3.5 flex items-center gap-4 border border-[#E9E4DB] sticky top-4 z-10 shadow-sm">
        <svg className="w-4 h-4 md:w-5 md:h-5 text-[#A5998D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="在库中搜索食材..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[14px] md:text-[15px] font-bold text-[#5B544D] placeholder-[#CEC3B8]"
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <h4 className="text-[10px] font-black text-[#A5998D] opacity-60 uppercase tracking-[0.2em]">所有食材资源</h4>
        <button 
          onClick={() => setShowAddForm(true)}
          className="text-[10px] md:text-[11px] font-black text-[#84A59D] uppercase flex items-center gap-1.5 bg-[#84A59D]/10 px-4 py-2 rounded-full border border-[#84A59D]/10 hover:bg-[#84A59D]/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          录入新食材
        </button>
      </div>

      <div className="space-y-3 px-0.5 pb-24">
        {filteredFood.map(food => (
          <div 
            key={food.id}
            onClick={() => setSelectedFood(food)}
            className="bg-white p-4 rounded-[1.75rem] border border-[#F4F1EA] flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer group shadow-sm hover:border-[#84A59D]/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-xl md:text-2xl border border-[#F4F1EA] group-hover:bg-[#F4F1EA] transition-colors shadow-inner">
                {food.icon || '🍱'}
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#5B544D] tracking-tight">{food.name}</h4>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] text-[#84A59D] font-black uppercase tracking-wide">{food.calories} kcal/100g</span>
                  <span className="text-[10px] text-[#CEC3B8] font-bold opacity-30">|</span>
                  <span className="text-[10px] text-[#A5998D] font-bold uppercase tracking-tighter">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</span>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => deleteFood(food.id, e)}
              className="p-2.5 text-[#E9E4DB] hover:text-[#D9A78D] opacity-0 group-hover:opacity-100 transition-all shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Selected Food Logging Dialog */}
      {selectedFood && (
        <div className="fixed inset-0 bg-[#5B544D]/50 backdrop-blur-md z-[120] flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2.5rem] w-full max-w-lg p-8 pb-12 shadow-2xl space-y-8 animate-in slide-in-from-bottom-full duration-500">
            <div className="w-12 h-1.5 bg-[#F4F1EA] rounded-full mx-auto" />
            
            <div className="flex items-center gap-5 bg-[#FDFBF7] p-5 rounded-3xl border border-[#F4F1EA]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-[#F4F1EA]">{selectedFood.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-[#5B544D] tracking-tight">{selectedFood.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                   <div className="px-2 py-0.5 bg-[#84A59D]/10 text-[#84A59D] rounded-md text-[9px] font-black uppercase">记录预览</div>
                   <span className="text-sm font-black text-[#5B544D]">{previewCalories} <span className="text-[10px] text-[#A5998D]">kcal</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-[#A5998D] uppercase tracking-widest">摄入重量</label>
                <span className="text-xs font-black text-[#CEC3B8]">g (克)</span>
              </div>
              <input 
                type="number" 
                value={logWeight} 
                onChange={(e) => setLogWeight(e.target.value)}
                className="w-full p-6 bg-[#FDFBF7] rounded-[2rem] text-5xl font-black text-[#5B544D] border-2 border-[#F4F1EA] focus:border-[#84A59D] outline-none text-center"
                autoFocus
                inputMode="numeric"
                pattern="\d*"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedFood(null)} className="py-5 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-black active:scale-95 transition-transform">取消</button>
              <button onClick={handleLog} className="py-5 bg-[#84A59D] text-white rounded-2xl font-black shadow-lg shadow-[#84A59D]/30 active:scale-95 transition-transform">立即加入日志</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Food Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#F4F1EA] lg:bg-[#5B544D]/20 z-[130] flex justify-center animate-in slide-in-from-right-full duration-400">
          <div className="bg-white w-full max-w-lg p-6 flex flex-col safe-top overflow-y-auto scrollbar-hide">
            <header className="flex items-center justify-between mb-8 px-2">
              <button onClick={() => setShowAddForm(false)} className="w-11 h-11 bg-[#FDFBF7] border border-[#F4F1EA] rounded-full flex items-center justify-center text-[#5B544D] active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>
              <h3 className="text-lg font-black text-[#5B544D]">新增食物到库</h3>
              <div className="w-11 h-11" />
            </header>
            <div className="space-y-8 max-w-md mx-auto w-full px-2">
              <div className="flex flex-col items-center gap-6">
                <div className="w-24 h-24 bg-[#FDFBF7] rounded-[2.5rem] border-2 border-dashed border-[#84A59D]/20 flex items-center justify-center text-5xl shadow-inner">{newFood.icon}</div>
                <div className="flex gap-3 overflow-x-auto w-full pb-4 scrollbar-hide px-1">
                  {PRESET_ICONS.map(icon => (
                    <button key={icon} onClick={() => setNewFood({...newFood, icon})} className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${newFood.icon === icon ? 'bg-[#84A59D] text-white scale-110 shadow-lg shadow-[#84A59D]/20' : 'bg-[#FDFBF7] border border-[#F4F1EA] opacity-60 hover:opacity-100'}`}>{icon}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#A5998D] uppercase tracking-widest ml-1">食材名称</label>
                  <input className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] font-bold text-[#5B544D] focus:border-[#84A59D] outline-none transition-colors" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} placeholder="例如: 澳洲和牛" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'calories', label: '热量 (kcal)' },
                    { key: 'protein', label: '蛋白质 (g)' },
                    { key: 'fat', label: '脂肪 (g)' },
                    { key: 'carbs', label: '碳水 (g)' }
                  ].map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black text-[#A5998D] uppercase ml-1">{field.label}</label>
                      <input type="number" className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] font-black text-[#5B544D] focus:border-[#84A59D] outline-none transition-colors" value={(newFood as any)[field.key] || ''} onChange={e => setNewFood({...newFood, [field.key]: parseFloat(e.target.value)})} placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleAddFood} className="w-full py-5 bg-[#84A59D] text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-[#84A59D]/20 active:scale-95 transition-all mb-12">存入我的食物库</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManager;
