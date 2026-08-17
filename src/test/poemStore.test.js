import { describe, it, expect, beforeEach } from "vitest";
import { loadPoems, savePoems, resetPoems, generatePoemsJs, pickPoem, EMOTION_IDS } from "../poemStore.js";

// 极简 localStorage 桩（Node 测试环境没有 localStorage）
const fakeStore = {};
beforeEach(() => {
  for (const k of Object.keys(fakeStore)) delete fakeStore[k];
  globalThis.localStorage = {
    getItem: (k) => (k in fakeStore ? fakeStore[k] : null),
    setItem: (k, v) => {
      fakeStore[k] = String(v);
    },
    removeItem: (k) => {
      delete fakeStore[k];
    },
  };
});

describe("poemStore", () => {
  it("无本地存储时回退到内置诗库", () => {
    const poems = loadPoems();
    expect(EMOTION_IDS.length).toBe(8);
    expect(poems.happy.length).toBeGreaterThanOrEqual(15);
  });

  it("保存后能读回，重置后恢复内置", () => {
    const custom = { happy: [{ style: "modern", text: "自定义诗" }] };
    savePoems(custom);
    const loaded = loadPoems();
    expect(loaded.happy[0].text).toBe("自定义诗");
    resetPoems();
    expect(loadPoems().happy.length).toBeGreaterThanOrEqual(15);
  });

  it("pickPoem 支持自定义诗库与换一首不重复", () => {
    const custom = { happy: [{ style: "modern", text: "唯一诗" }] };
    savePoems(custom);
    const p = pickPoem("happy");
    expect(p.text).toBe("唯一诗");
    const p2 = pickPoem("happy", p);
    expect(p2.text).toBe("唯一诗"); // 只有一首时允许重复
  });

  it("generatePoemsJs 生成结构完整的 poems.js", () => {
    const code = generatePoemsJs(loadPoems());
    expect(code).toContain("const POEMS = {");
    expect(code).toContain("happy: [");
    expect(code).toContain("export default POEMS;");
    expect(code).toContain('text: "');
    // 多行诗应被转义为 \n（而不是真实换行）
    expect(code).toContain("\\n");
    expect(code).toContain("export function allPoems()");
    expect(code).toContain("export function randomPoem(emotion)");
    expect(code).toContain("export function randomPoemExcept(emotion, previous)");
  });
});
