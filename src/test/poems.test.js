import { describe, it, expect } from "vitest";
import POEMS, { EMOTION_IDS, allPoems, randomPoem, randomPoemExcept } from "../poems.js";

describe("本地诗库", () => {
  it("包含 8 类情绪，每类至少 15 首", () => {
    expect(EMOTION_IDS.length).toBe(8);
    for (const id of EMOTION_IDS) {
      expect(POEMS[id].length, `${id} 诗库数量`).toBeGreaterThanOrEqual(15);
    }
  });

  it("全库无重复诗", () => {
    const texts = allPoems().map((p) => p.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("现代诗 4-8 行、古风 4 句且每句 5-7 字", () => {
    for (const id of EMOTION_IDS) {
      for (const p of POEMS[id]) {
        expect(["modern", "classical"], `${id} 风格合法`).toContain(p.style);
        const lines = p.text.split("\n");
        expect(lines.length, `${id} 行数`).toBeGreaterThan(0);
        if (p.style === "modern") {
          expect(lines.length, `现代诗行数`).toBeGreaterThanOrEqual(4);
          expect(lines.length, `现代诗行数`).toBeLessThanOrEqual(8);
        } else {
          expect(lines.length, `古风应 4 句`).toBe(4);
          for (const line of lines) {
            expect(line.length, `古风每句 5-7 字: ${line}`).toBeGreaterThanOrEqual(5);
            expect(line.length, `古风每句 5-7 字: ${line}`).toBeLessThanOrEqual(7);
          }
        }
      }
    }
  });

  it("randomPoem 对已知情绪从对应诗库抽取", () => {
    for (let i = 0; i < 50; i++) {
      const p = randomPoem("sad");
      expect(POEMS.sad.map((x) => x.text)).toContain(p.text);
    }
  });

  it("randomPoem 对 unknown/空 从全库抽取", () => {
    const texts = new Set(allPoems().map((x) => x.text));
    for (let i = 0; i < 50; i++) {
      expect(texts).toContain(randomPoem("unknown").text);
      expect(texts).toContain(randomPoem(undefined).text);
    }
  });

  it("randomPoemExcept 尽量不与上一首重复", () => {
    const prev = randomPoem("happy");
    let different = 0;
    for (let i = 0; i < 30; i++) {
      const p = randomPoemExcept("happy", prev);
      if (p.text !== prev.text) different += 1;
    }
    expect(different).toBe(30);
  });
});
