
import { MacroGoals, TrendDay } from "../types";

/**
 * 离线本地营养建议引擎
 */
export const getGeminiAdvice = async (
  consumed: { calories: number; protein: number; fat: number; carbs: number },
  goals: MacroGoals,
  recentLogs: string[]
) => {
  // 模拟异步延迟以保持 UI 体验一致
  await new Promise(resolve => setTimeout(resolve, 500));

  const calRatio = consumed.calories / goals.calories;
  const proRatio = consumed.protein / goals.protein;
  const fatRatio = consumed.fat / goals.fat;
  const carbRatio = consumed.carbs / goals.carbs;

  if (consumed.calories === 0) return "今天还没有记录饮食呢，开启健康的每一天吧！";

  if (calRatio > 1.1) return "今日热量已超标，建议晚些时候进行 30 分钟有氧运动，接下来选择清淡的叶菜类。";

  // 识别缺口最大的营养素
  const ratios = [
    { name: '蛋白质', val: proRatio, tip: '建议补充些鸡胸肉或蛋奶，帮助维持肌肉。' },
    { name: '碳水', val: carbRatio, tip: '可以适量摄入粗粮，如燕麦或糙米，提供持久能量。' },
    { name: '脂肪', val: fatRatio, tip: '适量摄入坚果或牛油果等优质脂肪，有益心脏健康。' }
  ];

  const minRatio = ratios.reduce((prev, curr) => prev.val < curr.val ? prev : curr);

  if (minRatio.val < 0.7) {
    return `当前${minRatio.name}摄入明显不足（仅${Math.round(minRatio.val * 100)}%）。${minRatio.tip}`;
  }

  if (calRatio > 0.9) {
    return "热量快达到目标了，建议通过大量饮水或食用低卡高纤维蔬菜（如西兰花）来增加饱腹感。";
  }

  return "今日营养分配非常出色！请继续保持这种平衡的饮食节奏，记得多喝水。";
};

/**
 * 离线本地趋势深度分析
 */
export const getTrendAnalysis = async (trendData: TrendDay[]) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  if (trendData.every(d => d.calories === 0)) return "暂无历史数据，请坚持记录一周以获取深度饮食分析报告。";

  const validDays = trendData.filter(d => d.calories > 0);
  const avgCals = validDays.reduce((acc, d) => acc + d.calories, 0) / (validDays.length || 1);
  const avgGoal = validDays.reduce((acc, d) => acc + d.goal, 0) / (validDays.length || 1);
  
  const avgPro = validDays.reduce((acc, d) => acc + d.protein, 0) / (validDays.length || 1);
  const proGoal = validDays[0]?.proteinGoal || 0;

  // 分析稳定性
  const overDays = validDays.filter(d => d.calories > d.goal * 1.1).length;
  const underDays = validDays.filter(d => d.calories < d.goal * 0.8).length;

  let report = `【离线分析报告】\n`;
  
  // 1. 稳定性
  if (overDays + underDays >= 3) {
    report += `波动分析：近期饮食波动较大（${overDays}天超标，${underDays}天不足）。建议设定固定的进餐时间。`;
  } else {
    report += `稳定性：您的饮食控制非常自律，日均热量与目标偏差仅 ${Math.abs(Math.round(avgCals - avgGoal))} kcal。`;
  }

  // 2. 营养均衡性
  const proShortfall = proGoal - avgPro;
  if (proShortfall > 15) {
    report += `\n营养失衡：周平均蛋白质缺口达 ${Math.round(proShortfall)}g，这会影响代谢。`;
  } else {
    report += `\n营养平衡：三大营养素比例相对稳定，维持了良好的身体状态。`;
  }

  // 3. 改进建议
  report += `\n核心目标：建议下周重点关注“${proShortfall > 10 ? '提高蛋白质占比' : '减少隐形油脂摄入'}”，并增加 2 次力量练习。`;

  return report;
};
