
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, MacroGoals, ExerciseEntry } from '../types';
import { calculateTDEE, calculateMacroGoalsFromCalories } from '../utils/calculators';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  goals: MacroGoals;
  setGoals: (g: MacroGoals) => void;
  todayExercise: ExerciseEntry[];
  onAddExercise: (name: string, calories: number) => void;
  onDeleteExercise: (id: string) => void;
  onSave: () => void;
}

const GoalSetter: React.FC<Props> = ({ 
  profile, setProfile, goals, setGoals, 
  todayExercise, onAddExercise, onDeleteExercise, 
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'manual' | 'exercise'>('profile');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCals, setExerciseCals] = useState('');

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    const newTdee = calculateTDEE(newProfile);
    setGoals(calculateMacroGoalsFromCalories(newTdee));
  };

  const handleLogExercise = () => {
    if (!exerciseCals) return;
    onAddExercise(exerciseName || '未命名运动', parseInt(exerciseCals));
    setExerciseName('');
    setExerciseCals('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Tabs */}
      <div className="flex bg-[#F4F1EA] p-1.5 rounded-2xl border border-[#E9E4DB]">
        <button 
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-[#84A59D]' : 'text-[#CEC3B8]'}`}
          onClick={() => setActiveTab('profile')}
        >
          个人画像
        </button>
        <button 
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${activeTab === 'exercise' ? 'bg-white shadow-sm text-[#84A59D]' : 'text-[#CEC3B8]'}`}
          onClick={() => setActiveTab('exercise')}
        >
          运动补充
        </button>
        <button 
          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all ${activeTab === 'manual' ? 'bg-white shadow-sm text-[#84A59D]' : 'text-[#CEC3B8]'}`}
          onClick={() => setActiveTab('manual')}
        >
          手动目标
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-[2rem] p-7 border border-[#F4F1EA] shadow-sm space-y-6">
          <h2 className="text-[13px] font-bold text-[#5B544D] mb-4 tracking-widest uppercase">身体基础信息</h2>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">性别</label>
              <select 
                value={profile.gender}
                onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              >
                <option value={Gender.MALE}>先生</option>
                <option value={Gender.FEMALE}>女士</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">年龄 (岁)</label>
              <input 
                type="number"
                value={profile.age}
                onChange={(e) => updateProfile({ age: parseInt(e.target.value) || 0 })}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">体重 (kg)</label>
              <input 
                type="number"
                value={profile.weight}
                onChange={(e) => updateProfile({ weight: parseFloat(e.target.value) || 0 })}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">身高 (cm)</label>
              <input 
                type="number"
                value={profile.height}
                onChange={(e) => updateProfile({ height: parseFloat(e.target.value) || 0 })}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">生活运动强度</label>
            <select 
              value={profile.activityLevel}
              onChange={(e) => updateProfile({ activityLevel: parseFloat(e.target.value) as ActivityLevel })}
              className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
            >
              <option value={ActivityLevel.SEDENTARY}>极少运动 (x1.2)</option>
              <option value={ActivityLevel.LIGHTLY_ACTIVE}>轻度活动 (x1.375)</option>
              <option value={ActivityLevel.MODERATELY_ACTIVE}>中度运动 (x1.55)</option>
              <option value={ActivityLevel.VERY_ACTIVE}>高强度运动 (x1.725)</option>
              <option value={ActivityLevel.EXTRA_ACTIVE}>运动员级 (x1.9)</option>
            </select>
          </div>

          <div className="mt-8 pt-8 border-t border-[#F4EFEA] flex justify-between items-center">
            <div>
              <p className="text-[10px] text-[#CEC3B8] font-bold tracking-widest uppercase">计算基准 TDEE</p>
              <p className="text-3xl font-bold text-[#84A59D]">{Math.round(calculateTDEE(profile))} <span className="text-xs font-normal text-[#A5998D]">kcal/日</span></p>
            </div>
            <button 
              onClick={onSave}
              className="px-6 py-4 bg-[#84A59D] text-white rounded-2xl font-bold text-[13px] hover:bg-[#5B756E] transition-all shadow-md active:scale-95"
            >
              更新同步
            </button>
          </div>
        </div>
      )}

      {activeTab === 'exercise' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-7 border border-[#F4F1EA] shadow-sm">
            <h2 className="text-[13px] font-bold text-[#5B544D] mb-6 tracking-widest uppercase">今日运动额外消耗</h2>
            <div className="space-y-4">
              <input 
                type="text"
                placeholder="运动名称 (如：跑步 30min)"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-medium text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              />
              <div className="flex gap-3">
                <input 
                  type="number"
                  placeholder="热量消耗 (kcal)"
                  value={exerciseCals}
                  onChange={(e) => setExerciseCals(e.target.value)}
                  className="flex-grow p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[13px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
                />
                <button 
                  onClick={handleLogExercise}
                  className="px-6 bg-[#D9A78D] text-white rounded-2xl font-bold text-[13px] hover:bg-[#C98A6D] transition-all"
                >
                  记录
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-[#CEC3B8] px-1 tracking-widest uppercase">已记录运动</h3>
            {todayExercise.length === 0 ? (
              <div className="py-12 text-center bg-[#FDFBF7] border border-dashed border-[#E9E4DB] rounded-[2rem]">
                <p className="text-[11px] text-[#CEC3B8] font-bold">今天还没有运动，动起来吧！</p>
              </div>
            ) : (
              todayExercise.map(ex => (
                <div key={ex.id} className="bg-white px-6 py-4 rounded-[1.5rem] flex items-center justify-between border border-[#F4F1EA]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F4F1EA] rounded-full flex items-center justify-center text-lg">🏃</div>
                    <div>
                      <p className="text-[13px] font-bold text-[#5B544D]">{ex.name}</p>
                      <p className="text-[11px] font-bold text-[#84A59D] mt-0.5">{ex.caloriesBurned} kcal</p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteExercise(ex.id)} className="p-2 text-[#E9E4DB] hover:text-red-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-white rounded-[2rem] p-7 border border-[#F4F1EA] shadow-sm space-y-6">
          <h2 className="text-[13px] font-bold text-[#5B544D] mb-4 tracking-widest uppercase">热量与配比微调</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#CEC3B8] mb-2 uppercase tracking-widest">每日基础热量目标 (kcal)</label>
              <input 
                type="number"
                value={goals.calories}
                onChange={(e) => setGoals({ ...goals, calories: parseInt(e.target.value) || 0 })}
                className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4EFEA] text-[15px] font-bold text-[#5B544D] focus:ring-1 focus:ring-[#84A59D]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] text-[#A8BCC9] font-black mb-2 uppercase text-center">蛋白质 (g)</label>
                <input 
                  type="number"
                  value={goals.protein}
                  onChange={(e) => setGoals({ ...goals, protein: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-[#F4F7F9] rounded-xl border-none text-[13px] text-center font-bold text-[#5B544D] focus:ring-1 focus:ring-[#A8BCC9]"
                />
              </div>
              <div>
                <label className="block text-[9px] text-[#D9A78D] font-black mb-2 uppercase text-center">碳水 (g)</label>
                <input 
                  type="number"
                  value={goals.carbs}
                  onChange={(e) => setGoals({ ...goals, carbs: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-[#FAF4F2] rounded-xl border-none text-[13px] text-center font-bold text-[#5B544D] focus:ring-1 focus:ring-[#D9A78D]"
                />
              </div>
              <div>
                <label className="block text-[9px] text-[#E9C46A] font-black mb-2 uppercase text-center">脂肪 (g)</label>
                <input 
                  type="number"
                  value={goals.fat}
                  onChange={(e) => setGoals({ ...goals, fat: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-[#FAF8F1] rounded-xl border-none text-[13px] text-center font-bold text-[#5B544D] focus:ring-1 focus:ring-[#E9C46A]"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={onSave}
            className="w-full mt-6 py-4 bg-[#5B544D] text-white rounded-2xl font-bold text-[13px] hover:bg-[#3E3833] transition-all shadow-md active:scale-95"
          >
            保存并返回
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalSetter;
