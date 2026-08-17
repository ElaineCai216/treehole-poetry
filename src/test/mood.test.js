import { describe, it, expect } from "vitest";
import { detectMood, EMOTIONS } from "../mood.js";

const CASES = [
  // [输入, 期望情绪]
  ["今天好开心，中奖了！", "happy"],
  ["见到喜欢的人，心里甜甜的", "happy"],
  ["周末去旅行，期待了好久的假期", "happy"],
  ["升职加薪，太棒了", "happy"],
  ["今天很平静，喝茶发呆，岁月静好", "calm"],
  ["一个人听雨，很放松", "calm"],
  ["午后很安静，不急不慢", "calm"],
  ["有点难过，想哭", "sad"],
  ["今天分手了，心碎", "sad"],
  ["感觉很委屈，难受", "sad"],
  ["最近加班太多，好累", "tired"],
  ["熬夜到凌晨，困得不行", "tired"],
  ["身心俱疲，撑不住了", "tired"],
  ["心里好焦虑，压力很大", "anxious"],
  ["明天面试，紧张得睡不着", "anxious"],
  ["有点迷茫，不知道怎么办", "anxious"],
  ["有点想妈妈了", "missing"],
  ["想念以前的老朋友", "missing"],
  ["好久不见，怀念过去的日子", "missing"],
  ["一个人在家，有点孤独", "lonely"],
  ["深夜一个人走在街上，冷清", "lonely"],
  ["没有人懂我，形单影只", "lonely"],
  ["气死了，凭什么这么不公平", "angry"],
  ["今天被坑了，火冒三丈", "angry"],
  ["讨厌这种无语的事", "angry"],
  // 否定短语
  ["今天很不开心", "sad"],
  ["一点都不高兴", "sad"],
  // 未命中 → unknown
  ["今天下雨了", "unknown"],
  ["随便说说", "unknown"],
];

describe("detectMood", () => {
  it("能正确识别 8 类情绪", () => {
    for (const [input, expected] of CASES) {
      const r = detectMood(input);
      expect(r.emotion, `输入「${input}」应识别为 ${expected}`).toBe(expected);
    }
  });

  it("返回结果带 label 与 matched", () => {
    const r = detectMood("好累啊");
    expect(r.label).toBe("疲惫");
    expect(r.matched.length).toBeGreaterThan(0);
  });

  it("空输入返回 unknown", () => {
    expect(detectMood("").emotion).toBe("unknown");
    expect(detectMood(undefined).emotion).toBe("unknown");
  });

  it("情绪 ID 与标签一一对应", () => {
    expect(EMOTIONS.length).toBe(8);
    for (const e of EMOTIONS) {
      expect(e.id).toBeTruthy();
      expect(e.label).toBeTruthy();
    }
  });
});
