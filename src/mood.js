// 树洞诗集 · 情绪识别
// 关键词 + 加权规则，识别 8 类情绪；未命中返回 "unknown"（由调用方随机兜底）。

export const EMOTIONS = [
  { id: "happy", label: "开心" },
  { id: "calm", label: "平静" },
  { id: "sad", label: "难过" },
  { id: "tired", label: "疲惫" },
  { id: "anxious", label: "焦虑" },
  { id: "missing", label: "思念" },
  { id: "lonely", label: "孤独" },
  { id: "angry", label: "愤怒" },
];

export const EMOTION_LABELS = Object.fromEntries(EMOTIONS.map((e) => [e.id, e.label]));

// 显式否定短语：先于关键词处理，避免“不开心”被算成开心
const NEGATIVE_PHRASES = [
  "不开心",
  "不高兴",
  "不快乐",
  "不幸福",
  "不爽",
  "不顺利",
  "没意思",
  "没劲",
];

// 每类情绪的关键词（出现即 +1 分）
const KEYWORDS = {
  happy: [
    "开心", "高兴", "快乐", "幸福", "好甜", "甜甜", "甜", "笑", "真棒", "太棒",
    "兴奋", "期待", "满足", "喜欢", "美好", "阳光", "顺利", "惊喜", "得意",
    "幸运", "愉快", "爽", "棒", "中了", "升职", "加薪", "中奖", "旅行", "出游",
    "拥抱", "礼物", "甜蜜", "春天来了", "发工资", "表白",
  ],
  calm: [
    "平静", "安宁", "安静", "淡然", "舒服", "放松", "惬意", "悠闲", "安稳",
    "踏实", "安心", "平和", "温柔", "悠哉", "岁月静好", "放空", "发呆", "喝茶",
    "听雨", "慢下来", "静下来", "清净", "怡然", "恬淡", "不急", "慢慢",
  ],
  sad: [
    "难过", "伤心", "悲伤", "哭", "眼泪", "哭了", "想哭", "心碎", "委屈",
    "失落", "沮丧", "心痛", "难受", "闷", "崩溃", "失败", "失恋", "分手",
    "离别", "再见", "失去", "遗憾", "伤感", "哀伤", "忧愁", "郁闷", "灰心",
    "低落",
  ],
  tired: [
    "累", "疲惫", "困", "倦", "乏力", "透支", "加班", "熬夜", "撑不住",
    "辛苦", "没力气", "想睡", "失眠", "忙", "身心俱疲", "疲惫不堪",
    "精疲力竭", "硬撑", "疲劳", "乏",
  ],
  anxious: [
    "焦虑", "担心", "害怕", "紧张", "慌", "不安", "压力", "迷茫", "烦躁",
    "内耗", "纠结", "心慌", "恐惧", "急", "忐忑", "不知所措", "压力山大",
    "忧虑", "睡不着",
  ],
  missing: [
    "想你", "想念", "思念", "牵挂", "怀念", "回忆", "以前", "过去", "曾经",
    "老家", "小时候", "异地", "分开", "距离", "梦见", "梦到", "好久不见",
    "故人", "故乡", "旧时光", "外婆", "奶奶", "爷爷", "妈妈", "爸爸", "家人", "回家", "老朋友",
  ],
  lonely: [
    "孤独", "孤单", "一个人", "寂寞", "没人", "没有人", "没人懂", "无人",
    "独自", "空荡荡", "冷清", "深夜", "夜里", "一个人吃饭", "沉默",
    "形单影只", "独处", "孤零零",
  ],
  angry: [
    "生气", "愤怒", "气死", "烦死", "讨厌", "恶心", "无语", "凭什么",
    "不公平", "恼火", "火大", "暴躁", "想骂", "坑", "被骗", "怒了",
    "气炸", "火冒三丈",
  ],
};

// 识别情绪：返回 { emotion, score, matched, label }
export function detectMood(text) {
  const t = (text || "").trim().toLowerCase();

  // 否定短语优先
  for (const phrase of NEGATIVE_PHRASES) {
    if (t.includes(phrase)) {
      return { emotion: "sad", score: 10, matched: [phrase], label: "难过" };
    }
  }

  let best = null;
  const hitsByEmotion = {};
  for (const emo of EMOTIONS) {
    let score = 0;
    const hits = [];
    for (const kw of KEYWORDS[emo.id]) {
      if (t.includes(kw)) {
        score += 1;
        hits.push(kw);
      }
    }
    if (score > 0) {
      hitsByEmotion[emo.id] = hits;
      if (!best || score > best.score) best = { emotion: emo.id, score, label: emo.label };
    }
  }

  if (!best) {
    return { emotion: "unknown", score: 0, matched: [], label: "未知" };
  }
  return { ...best, matched: hitsByEmotion[best.emotion] };
}
