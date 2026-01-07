
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
    if (window.confirm('确定要删除这种食物吗？')) {
      setFoodDb(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      {/* MD3 Search Bar */}
      <div className="bg-[#F4F1EA] rounded-full px-5 py-2.5 flex items-center gap-4 border border-[#E9E4DB] sticky top-4 z-10 shadow-sm">
        <svg className="w-5 h-5 text-[#A5998D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          placeholder="搜索食材..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-[#5B544D] placeholder-[#CEC3B8]"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-[#CEC3B8]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="flex justify-between items-center px-2">
        <h4 className="text-[10px] font-black text-[#A5998D] uppercase tracking-[0.2em]">常用食物</h4>
        <button 
          onClick={() => setShowAddForm(true)}
          className="text-[11px] font-black text-[#84A59D] uppercase tracking-wider flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          手动新增
        </button>
      </div>

      <div className="space-y-3">
        {filteredFood.map(food => (
          <div 
            key={food.id}
            onClick={() => setSelectedFood(food)}
            className="bg-white p-4 rounded-[1.75rem] border border-[#F4F1EA] flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl border border-[#F4F1EA] group-hover:bg-white transition-colors">
                {food.icon || '🍱'}
              </div>
              <div>
                <h4 className="text-[15px] font-black text-[#5B544D] tracking-tight">{food.name}</h4>
                <p className="text-[11px] text-[#A5998D] font-black mt-1 uppercase">
                  {food.calories} kcal/100g
                </p>
              </div>
            </div>
            <button 
              onClick={(e) => deleteFood(food.id, e)}
              className="p-3 text-[#F4F1EA] hover:text-[#D9A78D] opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Modal overlays remain standard but with MD3 styling */}
      {selectedFood && (
        <div className="fixed inset-0 bg-[#5B544D]/50 backdrop-blur-md z-[60] flex items-end animate-in fade-in duration-300">
          <div className="bg-white rounded-t-[2.5rem] w-full p-8 pb-12 shadow-2xl space-y-8 animate-in slide-in-from-bottom-full duration-500">
            <div className="w-12 h-1.5 bg-[#F4F1EA] rounded-full mx-auto mb-2" />
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-3xl flex items-center justify-center text-3xl border border-[#F4F1EA]">
                {selectedFood.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-[#5B544D] tracking-tight">{selectedFood.name}</h3>
                <p className="text-[12px] font-black text-[#84A59D] uppercase mt-1">{selectedFood.calories} kcal / 100g</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-[#A5998D] uppercase tracking-widest ml-1">摄入重量 (g)</label>
              <input 
                type="number"
                value={logWeight}
                onChange={(e) => setLogWeight(e.target.value)}
                className="w-full p-6 bg-[#FDFBF7] rounded-3xl text-4xl font-black text-[#5B544D] border-2 border-[#F4F1EA] focus:border-[#84A59D] outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-4.5 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-black">取消</button>
              <button onClick={handleLog} className="flex-1 py-4.5 bg-[#84A59D] text-white rounded-2xl font-black shadow-lg shadow-[#84A59D]/30">加入日志</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-white z-[70] p-6 animate-in slide-in-from-right-full duration-400 overflow-y-auto">
          <header className="flex items-center justify-between mb-8">
            <button onClick={() => setShowAddForm(false)} className="w-12 h-12 bg-[#F4F1EA] rounded-full flex items-center justify-center text-[#5B544D]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 className="text-lg font-black text-[#5B544D]">创建新食材</h3>
            <div className="w-12 h-12" />
          </header>

          <div className="space-y-8 max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-4">
               <div className="w-24 h-24 bg-[#FDFBF7] rounded-[2rem] border-2 border-dashed border-[#84A59D]/20 flex items-center justify-center text-5xl">
                 {newFood.icon}
               </div>
               <div className="flex gap-3 overflow-x-auto w-full pb-4 scrollbar-hide px-2">
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewFood({...newFood, icon})}
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${newFood.icon === icon ? 'bg-[#84A59D] text-white scale-110' : 'bg-[#F4F1EA] opacity-60'}`}
                    >
                      {icon}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#A5998D] uppercase tracking-widest px-1">食材全名</label>
                <input 
                  className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] font-bold text-[#5B544D]"
                  value={newFood.name}
                  onChange={e => setNewFood({...newFood, name: e.target.value})}
                  placeholder="例如: 特级黑芝麻"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['calories', 'protein', 'fat', 'carbs'].map(key => (
                  <div key={key} className="space-y-2">
                    <label className="text-[10px] font-black text-[#A5998D] uppercase px-1">{key === 'calories' ? '热量 (kcal)' : key === 'protein' ? '蛋白 (g)' : key === 'fat' ? '脂肪 (g)' : '碳水 (g)'}</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] font-black text-[#5B544D]"
                      value={(newFood as any)[key] || ''}
                      onChange={e => setNewFood({...newFood, [key]: parseFloat(e.target.value)})}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddFood}
              className="w-full py-5 bg-[#84A59D] text-white rounded-[1.75rem] font-black text-lg shadow-xl shadow-[#84A59D]/20"
            >
              完成并保存
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodManager;
