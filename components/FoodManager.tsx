
import React, { useState } from 'react';
import { FoodItem } from '../types';

interface Props {
  foodDb: FoodItem[];
  setFoodDb: React.Dispatch<React.SetStateAction<FoodItem[]>>;
  onLogFood: (food: FoodItem, weight: number) => void;
  onBack: () => void;
}

const FoodManager: React.FC<Props> = ({ foodDb, setFoodDb, onLogFood, onBack }) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [logWeight, setLogWeight] = useState('100');

  // New Food Form State
  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '', calories: 0, protein: 0, fat: 0, carbs: 0
  });

  const filteredFood = foodDb.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddFood = () => {
    if (!newFood.name) return;
    const item: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: Number(newFood.calories) || 0,
      protein: Number(newFood.protein) || 0,
      fat: Number(newFood.fat) || 0,
      carbs: Number(newFood.carbs) || 0,
    };
    setFoodDb(prev => [...prev, item]);
    setNewFood({ name: '', calories: 0, protein: 0, fat: 0, carbs: 0 });
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
    <div className="space-y-4">
      {/* Search & Add Header */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="搜索食物..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 shadow-sm rounded-xl text-sm"
          />
          <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Selected Food Logging Modal Overlay */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">记录摄入: {selectedFood.name}</h3>
            <p className="text-xs text-gray-500">每100g含: {selectedFood.calories}kcal, 蛋:{selectedFood.protein}g, 脂:{selectedFood.fat}g, 碳:{selectedFood.carbs}g</p>
            <div>
              <label className="block text-xs mb-1 font-medium text-gray-700">摄入重量 (克)</label>
              <input 
                type="number"
                value={logWeight}
                onChange={(e) => setLogWeight(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl text-lg font-bold border-emerald-500 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedFood(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium">取消</button>
              <button onClick={handleLog} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold">确认记录</button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Food Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full p-6 space-y-4">
            <h3 className="text-lg font-bold">新增自定义食物</h3>
            <div className="space-y-3">
              <input 
                placeholder="食物名称" 
                className="w-full p-3 bg-gray-50 rounded-xl text-sm"
                value={newFood.name}
                onChange={e => setNewFood({...newFood, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" placeholder="热量 (kcal/100g)" 
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm"
                  value={newFood.calories || ''}
                  onChange={e => setNewFood({...newFood, calories: parseFloat(e.target.value)})}
                />
                <input 
                  type="number" placeholder="蛋白质 (g/100g)" 
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm"
                  value={newFood.protein || ''}
                  onChange={e => setNewFood({...newFood, protein: parseFloat(e.target.value)})}
                />
                <input 
                  type="number" placeholder="脂肪 (g/100g)" 
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm"
                  value={newFood.fat || ''}
                  onChange={e => setNewFood({...newFood, fat: parseFloat(e.target.value)})}
                />
                <input 
                  type="number" placeholder="碳水 (g/100g)" 
                  className="w-full p-3 bg-gray-50 rounded-xl text-sm"
                  value={newFood.carbs || ''}
                  onChange={e => setNewFood({...newFood, carbs: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-medium">取消</button>
              <button onClick={handleAddFood} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold">保存食物</button>
            </div>
          </div>
        </div>
      )}

      {/* Food List */}
      <div className="space-y-3">
        {filteredFood.map(food => (
          <div 
            key={food.id}
            onClick={() => setSelectedFood(food)}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-gray-800">{food.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {food.calories}kcal · 蛋{food.protein}脂{food.fat}碳{food.carbs} (每100g)
              </p>
            </div>
            <button 
              onClick={(e) => deleteFood(food.id, e)}
              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodManager;
