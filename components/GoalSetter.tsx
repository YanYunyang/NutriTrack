
import React, { useState, useMemo } from 'react';
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

const PRESETS = [
  { name: '平衡饮食 (4:4:2)', p: 0.4, c: 0.4, f: 0.2 },
  { name: '高能运动 (3:5:2)', p: 0.3, c: 0.5, f: 0.2 },
  { name: '生酮减脂 (3:1:6)', p: 0.3, c: 0.1, f: 0.6 },
];

const GoalSetter: React.FC<Props> = ({ 
  profile, setProfile, goals, setGoals, 
  todayExercise, onAddExercise, onDeleteExercise, 
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'manual' | 'exercise' | 'about'>('profile');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCals, setExerciseCals] = useState('');

  const calcCals = (p: number, c: number, f: number) => Math.round(p * 4 + c * 4 + f * 9);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    const newTdee = calculateTDEE(newProfile);
    setGoals(calculateMacroGoalsFromCalories(newTdee));
  };

  const updateManualNutrient = (key: 'protein' | 'carbs' | 'fat', value: number) => {
    const newGoals = { ...goals, [key]: value };
    newGoals.calories = calcCals(newGoals.protein, newGoals.carbs, newGoals.fat);
    setGoals(newGoals);
  };

  const applyPreset = (pRatio: number, cRatio: number, fRatio: number) => {
    const currentCals = goals.calories;
    setGoals({
      calories: currentCals,
      protein: Math.round((currentCals * pRatio) / 4),
      carbs: Math.round((currentCals * cRatio) / 4),
      fat: Math.round((currentCals * fRatio) / 9),
    });
  };

  const macroRatios = useMemo(() => {
    const total = goals.protein * 4 + goals.carbs * 4 + goals.fat * 9 || 1;
    return {
      p: Math.round((goals.protein * 4 / total) * 100),
      c: Math.round((goals.carbs * 4 / total) * 100),
      f: Math.round((goals.fat * 9 / total) * 100),
    };
  }, [goals]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 pb-12">
      {/* Premium Tab Selector */}
      <div className="flex bg-[#F4F1EA] p-1.5 rounded-[1.75rem] border border-white shadow-sm mx-1">
        {[
          { id: 'profile', label: '基础', icon: '👤' },
          { id: 'exercise', label: '运动', icon: '🔥' },
          { id: 'manual', label: '目标', icon: '🎯' },
          { id: 'about', label: '关于', icon: '✨' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-[9px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-white shadow-md text-[#84A59D]' : 'text-[#CEC3B8]'}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F4F1EA] shadow-sm space-y-8">
            <h2 className="text-[11px] font-black text-[#A5998D] tracking-[0.3em] uppercase">基础生物信息</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateProfile({ gender: 'male' as any })}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${profile.gender === 'male' ? 'border-[#84A59D] bg-[#F6F8F7]' : 'border-[#F4F1EA] grayscale opacity-50'}`}
              >
                <span className="text-3xl">👨🏻‍💻</span>
                <span className="text-[11px] font-black text-[#5B544D] uppercase">先生</span>
              </button>
              <button 
                onClick={() => updateProfile({ gender: 'female' as any })}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${profile.gender === 'female' ? 'border-[#D9A78D] bg-[#FAF4F2]' : 'border-[#F4F1EA] grayscale opacity-50'}`}
              >
                <span className="text-3xl">👩🏼‍💼</span>
                <span className="text-[11px] font-black text-[#5B544D] uppercase">女士</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: '年龄', key: 'age', unit: '岁' },
                { label: '身高', key: 'height', unit: 'cm' },
                { label: '当前体重', key: 'weight', unit: 'kg' }
              ].map(item => (
                <div key={item.key} className="space-y-2">
                  <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">{item.label}</label>
                  <div className="relative">
                    <input 
                      type="number" value={(profile as any)[item.key]}
                      onChange={(e) => updateProfile({ [item.key]: parseFloat(e.target.value) || 0 })}
                      className="w-full p-4 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] font-black text-[#5B544D] text-lg focus:ring-2 focus:ring-[#84A59D]/20 transition-all outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#CEC3B8]">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-[#CEC3B8] uppercase tracking-widest ml-1">生活活跃程度</label>
              <div className="space-y-2">
                {[
                  { v: 1.2, l: '久坐办公', desc: '极少运动' },
                  { v: 1.375, l: '轻度活跃', desc: '每周 1-3 次运动' },
                  { v: 1.55, l: '中度活跃', desc: '每周 3-5 次运动' },
                  { v: 1.725, l: '高强度', desc: '专业训练/高强度工作' }
                ].map(level => (
                  <button 
                    key={level.v}
                    onClick={() => updateProfile({ activityLevel: level.v as any })}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${profile.activityLevel === level.v ? 'border-[#84A59D] bg-[#F6F8F7]' : 'border-[#F4F1EA] hover:border-[#84A59D]/30'}`}
                  >
                    <div className="text-left">
                      <p className="text-[13px] font-black text-[#5B544D]">{level.l}</p>
                      <p className="text-[10px] font-medium text-[#A5998D] uppercase mt-0.5">{level.desc}</p>
                    </div>
                    {profile.activityLevel === level.v && <div className="w-5 h-5 bg-[#84A59D] rounded-full flex items-center justify-center text-white"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#F4EFEA] flex justify-between items-center">
              <div>
                <p className="text-[10px] text-[#CEC3B8] font-black tracking-widest uppercase">日均预算</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#84A59D] tracking-tight">{Math.round(calculateTDEE(profile))}</span>
                  <span className="text-[10px] font-black text-[#A5998D]">kcal</span>
                </div>
              </div>
              <button onClick={onSave} className="px-6 py-4 bg-[#84A59D] text-white rounded-[1.25rem] font-black text-[12px] shadow-xl shadow-[#84A59D]/30 active:scale-95 transition-all">同步</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exercise' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F4F1EA] shadow-sm space-y-6">
            <h2 className="text-[11px] font-black text-[#A5998D] tracking-[0.3em] uppercase">今日消耗补给</h2>
            <div className="grid grid-cols-1 gap-4">
              <input 
                type="text" placeholder="运动名称 (如: 晚间慢跑 5km)" value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full p-5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-sm font-bold text-[#5B544D] outline-none"
              />
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="number" placeholder="消耗热量" value={exerciseCals}
                    onChange={(e) => setExerciseCals(e.target.value)}
                    className="w-full p-5 bg-[#FDFBF7] rounded-2xl border border-[#F4F1EA] text-lg font-black text-[#5B544D] outline-none"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#CEC3B8]">KCAL</span>
                </div>
                <button 
                  onClick={() => {
                    if (!exerciseCals) return;
                    onAddExercise(exerciseName || '运动补给', parseInt(exerciseCals));
                    setExerciseName(''); setExerciseCals('');
                  }}
                  className="px-8 bg-[#D9A78D] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#D9A78D]/20 active:scale-95"
                >
                  记录
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 px-2">
            <h3 className="text-[10px] font-black text-[#CEC3B8] tracking-widest uppercase">今日运动列表</h3>
            {todayExercise.length === 0 ? (
              <div className="py-16 text-center bg-white border border-dashed border-[#F4F1EA] rounded-[2.5rem]">
                <p className="text-[12px] text-[#CEC3B8] font-bold">暂无运动记录 🏃</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayExercise.map(ex => (
                  <div key={ex.id} className="bg-white p-5 rounded-3xl flex items-center justify-between border border-[#F4F1EA] shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FAF4F2] rounded-2xl flex items-center justify-center text-2xl shadow-inner">⚡</div>
                      <div>
                        <p className="text-[14px] font-black text-[#5B544D]">{ex.name}</p>
                        <p className="text-[11px] font-black text-[#D9A78D] mt-0.5">-{ex.caloriesBurned} kcal</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteExercise(ex.id)} className="p-3 text-[#CEC3B8] hover:text-[#D9A78D] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-white rounded-[2.5rem] p-8 border border-[#F4F1EA] shadow-sm space-y-8">
          <div>
            <h2 className="text-[11px] font-black text-[#A5998D] tracking-[0.3em] uppercase mb-6">目标宏量营养配比</h2>
            
            <div className="bg-[#FDFBF7] p-6 rounded-[2rem] border border-[#F4F1EA] mb-8">
               <div className="flex h-4 rounded-full overflow-hidden shadow-inner mb-4">
                 <div className="bg-[#A8BCC9] transition-all duration-700" style={{ width: `${macroRatios.p}%` }} />
                 <div className="bg-[#D9A78D] transition-all duration-700" style={{ width: `${macroRatios.c}%` }} />
                 <div className="bg-[#E9C46A] transition-all duration-700" style={{ width: `${macroRatios.f}%` }} />
               </div>
               <div className="grid grid-cols-3 gap-2 text-center">
                 <div><p className="text-[10px] font-black text-[#A8BCC9] uppercase">蛋白 {macroRatios.p}%</p></div>
                 <div><p className="text-[10px] font-black text-[#D9A78D] uppercase">碳水 {macroRatios.c}%</p></div>
                 <div><p className="text-[10px] font-black text-[#E9C46A] uppercase">脂肪 {macroRatios.f}%</p></div>
               </div>
               <div className="mt-4 pt-4 border-t border-[#F4F1EA] text-center">
                  <p className="text-[10px] font-black text-[#CEC3B8] uppercase">总热量目标</p>
                  <p className="text-3xl font-black text-[#5B544D] mt-1">{goals.calories} <span className="text-sm font-black text-[#84A59D]">KCAL</span></p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'protein', l: '蛋白 (g)', c: 'bg-[#F4F7F9]', tc: 'text-[#A8BCC9]' },
                  { k: 'carbs', l: '碳水 (g)', c: 'bg-[#FAF4F2]', tc: 'text-[#D9A78D]' },
                  { k: 'fat', l: '脂肪 (g)', c: 'bg-[#FAF8F1]', tc: 'text-[#E9C46A]' }
                ].map(field => (
                  <div key={field.k}>
                    <label className={`block text-[9px] font-black mb-2 uppercase text-center ${field.tc}`}>{field.l}</label>
                    <input 
                      type="number" value={goals[field.k as 'protein' | 'carbs' | 'fat']}
                      onChange={(e) => updateManualNutrient(field.k as any, parseInt(e.target.value) || 0)}
                      className={`w-full p-4 ${field.c} rounded-2xl border-none text-[15px] text-center font-black text-[#5B544D] outline-none ring-2 ring-transparent focus:ring-current transition-all`}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <p className="text-[10px] font-black text-[#CEC3B8] tracking-widest uppercase ml-1">专业推荐配比</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p.p, p.c, p.f)}
                      className="px-5 py-2.5 bg-[#FDFBF7] text-[#A5998D] text-[11px] font-black rounded-full hover:bg-[#84A59D] hover:text-white transition-all border border-[#F4F1EA] active:scale-95"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onSave}
            className="w-full py-5 bg-[#5B544D] text-white rounded-[1.75rem] font-black text-[14px] shadow-2xl shadow-[#5B544D]/20 active:scale-95 transition-all"
          >
            保存并应用
          </button>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="animate-in fade-in duration-700">
           <div className="bg-white rounded-[3rem] p-10 border border-[#F4F1EA] shadow-sm flex flex-col items-center text-center space-y-6">
              {/* Designed App Icon Preview */}
              <div className="w-32 h-32 bg-[#84A59D] rounded-[2.5rem] shadow-2xl shadow-[#84A59D]/40 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    <path d="m13 17 2 2 4-4" strokeWidth="2.5" />
                  </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#5B544D] tracking-tight">NutriTrack Pro</h3>
                <p className="text-[10px] font-black text-[#84A59D] tracking-[0.3em] uppercase">v2.0 智能营养专家</p>
              </div>

              <div className="w-full h-px bg-[#F4F1EA]" />

              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center text-[12px]">
                   <span className="font-bold text-[#A5998D]">打包状态</span>
                   <span className="font-black text-[#84A59D] bg-[#F6F8F7] px-3 py-1 rounded-full border border-[#84A59D]/10">Ready for APK</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                   <span className="font-bold text-[#A5998D]">核心公式</span>
                   <span className="font-black text-[#5B544D]">Mifflin-St Jeor</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                   <span className="font-bold text-[#A5998D]">离线模式</span>
                   <span className="font-black text-[#84A59D]">已激活</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <p className="text-[11px] text-[#CEC3B8] font-medium leading-relaxed px-4">
                  长按图标可进行截图保存作为应用启动图标。详细打包教程请参考源码根目录的 BUILD.md 文件。
                </p>
                <div className="flex gap-2 justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#84A59D] animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-[#D9A78D] animate-pulse [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#E9C46A] animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetter;
