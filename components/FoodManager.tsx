
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

  // New Food Form State
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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search & Add Header */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="搜索食物库..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white border border-[#F4F1EA] shadow-sm rounded-2xl text-[13px] font-medium text-[#5B544D] placeholder-[#CEC3B8] focus:ring-1 focus:ring-[#84A59D] outline-none"
          />
          <svg className="w-5 h-5 absolute left-4 top-4.5 text-[#CEC3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-14 h-14 flex items-center justify-center bg-[#84A59D] text-white rounded-2xl shadow-lg shadow-[#84A59D]/20 hover:bg-[#5B756E] transition-all active:scale-95"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Selected Food Logging Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-[#5B544D]/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-[#F4F1EA]">
                {selectedFood.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#5B544D]">{selectedFood.name}</h3>
                <p className="text-[11px] font-bold text-[#A5998D] uppercase tracking-wider">{selectedFood.calories} kcal / 100g</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#CEC3B8] uppercase tracking-widest ml-1">本次摄入重量 (克)</label>
              <input 
                type="number"
                value={logWeight}
                onChange={(e) => setLogWeight(e.target.value)}
                className="w-full p-5 bg-[#FDFBF7] rounded-2xl text-2xl font-black text-[#5B544D] border border-[#F4EFEA] focus:ring-1 focus:ring-[#84A59D] outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-4 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-bold text-[13px]">取消</button>
              <button onClick={handleLog} className="flex-1 py-4 bg-[#84A59D] text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-[#84A59D]/20">确认记录</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Food Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#5B544D]/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-lg font-bold text-[#5B544D]">新增自定义食物</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#CEC3B8] uppercase tracking-widest mb-2 ml-1">选择图标</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {PRESET_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewFood({...newFood, icon})}
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all ${newFood.icon === icon ? 'bg-[#84A59D] text-white scale-110 shadow-md' : 'bg-[#FDFBF7] border border-[#F4F1EA] grayscale-[0.5] opacity-60'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <input 
                placeholder="食物名称 (如: 煎牛排)" 
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[13px] font-bold text-[#5B544D] outline-none focus:ring-1 focus:ring-[#84A59D]"
                value={newFood.name}
                onChange={e => setNewFood({...newFood, name: e.target.value})}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#CEC3B8] uppercase ml-1">热量 (kcal)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[13px] font-bold text-[#5B544D] outline-none"
                    value={newFood.calories || ''}
                    onChange={e => setNewFood({...newFood, calories: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#CEC3B8] uppercase ml-1">蛋白质 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[13px] font-bold text-[#5B544D] outline-none"
                    value={newFood.protein || ''}
                    onChange={e => setNewFood({...newFood, protein: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#CEC3B8] uppercase ml-1">脂肪 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[13px] font-bold text-[#5B544D] outline-none"
                    value={newFood.fat || ''}
                    onChange={e => setNewFood({...newFood, fat: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#CEC3B8] uppercase ml-1">碳水 (g)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-[13px] font-bold text-[#5B544D] outline-none"
                    value={newFood.carbs || ''}
                    onChange={e => setNewFood({...newFood, carbs: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <p className="text-[9px] text-[#A5998D] text-center font-bold">* 以上数值均为每 100g 含量</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-4 bg-[#F4F1EA] text-[#A5998D] rounded-2xl font-bold text-[13px]">取消</button>
              <button onClick={handleAddFood} className="flex-1 py-4 bg-[#84A59D] text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-[#84A59D]/20">保存食物</button>
            </div>
          </div>
        </div>
      )}

      {/* Food List */}
      <div className="space-y-3">
        {filteredFood.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-[#F4F1EA]">
             <p className="text-[11px] font-bold text-[#CEC3B8] uppercase tracking-widest">没有找到相关食物</p>
          </div>
        ) : (
          filteredFood.map(food => (
            <div 
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="bg-white p-5 rounded-[1.75rem] border border-[#F4F1EA] shadow-sm flex justify-between items-center group active:scale-[0.98] transition-all cursor-pointer hover:border-[#84A59D]/30"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center text-xl shadow-inner border border-[#F4F1EA] group-hover:bg-white transition-colors">
                  {food.icon || '🍱'}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#5B544D]">{food.name}</h4>
                  <p className="text-[10px] text-[#A5998D] font-bold mt-0.5">
                    {food.calories}kcal · P{food.protein} F{food.fat} C{food.carbs}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => deleteFood(food.id, e)}
                className="p-2 text-[#F4F1EA] hover:text-[#D9A78D] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FoodManager;
