
import React, { useState } from 'react';
import { FoodItem } from '../types';

interface Props {
  foodDb: FoodItem[];
  setFoodDb: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  onLogFood: (food: FoodItem, weight: number) => void;
  onBack: () => void;
}

const PRESET_ICONS = [
  '🍱', '🍗', '🥩', '🐟', '🥚', '🥛', '🍞', '🍚', '🍜', '🍝', 
  '🥦', '🌽', '🍎', '🍌', '🥑', '🥜', '☕', '🍵', '🥤', '🍰'
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="搜索您的私人食物库..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4.5 bg-white border border-[#F4F1EA] shadow-sm rounded-2xl text-[14px] font-bold text-[#5B544D] placeholder-[#CEC3B8] focus:ring-2 focus:ring-[#84A59D]/20 outline-none transition-all"
          />
          <svg className="w-5 h-5 absolute left-4.5 top-1/2 -translate-y-1/2 text-[#CEC3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-14 h-14 flex items-center justify-center bg-[#84A59D] text-white rounded-2xl shadow-xl shadow-[#84A59D]/30 hover:bg-[#5B756E] transition-all active:scale-90"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {selectedFood && (
        <div className="fixed inset-0 bg-[#5B544D]/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-9 shadow-2xl space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-[#F4F1EA]">
                {selectedFood.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-[#5B544D] tracking-tight">{selectedFood.name}</h3>
                <p className="text-[12px] font-black text-[#A5998D] uppercase tracking-[0.1em] mt-1">{selectedFood.calories} <span className="text-[9px] opacity-60 lowercase">kcal/100g</span></p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-[#CEC3B8] uppercase tracking-[0.3em] ml-1">记录重量 (g)</label>
              <input 
                type="number"
                value={logWeight}
                onChange={(e) => setLogWeight(e.target.value)}
                className="w-full p-6 bg-[#FDFBF7] rounded-3xl text-3xl font-black text-[#5B544D] border-2 border-[#F4EFEA] focus:border-[#84A59D] outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-4.5 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-black text-[14px]">取消</button>
              <button onClick={handleLog} className="flex-1 py-4.5 bg-[#84A59D] text-white rounded-2xl font-black text-[14px] shadow-xl shadow-[#84A59D]/25 active:scale-95 transition-all">记录摄入</button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-[#5B544D]/40 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-sm p-9 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-xl font-black text-[#5B544D] tracking-tight">添加自定义食物</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#CEC3B8] uppercase tracking-[0.2em] mb-4 ml-1">选择识别图标</label>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewFood({...newFood, icon})}
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${newFood.icon === icon ? 'bg-[#84A59D] text-white scale-110 shadow-lg' : 'bg-[#FDFBF7] border border-[#F4F1EA] opacity-60 hover:opacity-100'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-[#CEC3B8] uppercase tracking-[0.2em] ml-1">食物名称</label>
                <input 
                  placeholder="如：自制全麦煎饼" 
                  className="w-full p-5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[14px] font-bold text-[#5B544D] outline-none focus:ring-2 focus:ring-[#84A59D]/20 transition-all"
                  value={newFood.name}
                  onChange={e => setNewFood({...newFood, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">热量 (kcal)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4.5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[14px] font-bold text-[#5B544D] outline-none focus:border-[#84A59D]/50"
                    value={newFood.calories || ''}
                    onChange={e => setNewFood({...newFood, calories: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">蛋白 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4.5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[14px] font-bold text-[#5B544D] outline-none"
                    value={newFood.protein || ''}
                    onChange={e => setNewFood({...newFood, protein: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">脂肪 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4.5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[14px] font-bold text-[#5B544D] outline-none"
                    value={newFood.fat || ''}
                    onChange={e => setNewFood({...newFood, fat: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">碳水 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4.5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[14px] font-bold text-[#5B544D] outline-none"
                    value={newFood.carbs || ''}
                    onChange={e => setNewFood({...newFood, carbs: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-4.5 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-black text-[14px]">取消</button>
              <button onClick={handleAddFood} className="flex-1 py-4.5 bg-[#84A59D] text-white rounded-2xl font-black text-[14px] shadow-xl shadow-[#84A59D]/25">确认新增</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredFood.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-[#F4F1EA]">
             <p className="text-[11px] font-black text-[#CEC3B8] uppercase tracking-[0.3em]">发现新的美味并添加它</p>
          </div>
        ) : (
          filteredFood.map(food => (
            <div 
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="bg-white p-5 rounded-[2.2rem] border border-[#F4F1EA] shadow-sm flex justify-between items-center group active:scale-[0.98] transition-all cursor-pointer hover:border-[#84A59D]/30"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-[#F4F1EA] group-hover:bg-white group-hover:scale-110 transition-all">
                  {food.icon || '🍱'}
                </div>
                <div>
                  <h4 className="text-[16px] font-black text-[#5B544D] tracking-tight">{food.name}</h4>
                  <p className="text-[11px] text-[#A5998D] font-black mt-1">
                    {food.calories}kcal · P{food.protein} F{food.fat} C{food.carbs}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => deleteFood(food.id, e)}
                className="p-3 text-[#F4F1EA] hover:text-[#D9A78D] transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodManager;
