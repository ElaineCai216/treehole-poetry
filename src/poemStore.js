// 树洞诗集 · 诗库存储
// 默认使用内置诗库；若用户通过「诗库管理」修改过，则优先使用浏览器本地存储的诗库。
// 也提供「导出 poems.js」与「发布到 GitHub」所需的内容生成。

import POEMS from "./poems.js";

export const STORAGE_KEY = "treehole-poetry:poems:v1";
export const TOKEN_KEY = "treehole-poetry:ghtoken:v1";
export const EMOTION_IDS = Object.keys(POEMS);

export function loadPoems() {
  if (typeof localStorage === "undefined") return POEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && EMOTION_IDS.some((id) => Array.isArray(data[id]))) {
        // 允许只存部分情绪，缺失的用内置诗库补齐
        const merged = { ...POEMS };
        for (const id of EMOTION_IDS) {
          if (Array.isArray(data[id])) merged[id] = data[id];
        }
        return merged;
      }
    }
  } catch {
    /* 数据损坏时回退内置 */
  }
  return POEMS;
}

export function savePoems(poems) {
  if (typeof localStorage === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
    return true;
  } catch {
    return false;
  }
}

export function resetPoems() {
  if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
}

// 随机抽一首；emotion 未知/为空时从全库抽
export function pickPoem(emotion, previous) {
  const poems = loadPoems();
  const pool =
    emotion && poems[emotion] && poems[emotion].length
      ? poems[emotion]
      : EMOTION_IDS.flatMap((id) => poems[id] || []);
  if (!pool.length) return { style: "modern", text: "树洞今天没有存到诗\n明天再来看看" };
  for (let i = 0; i < 20; i++) {
    const p = pool[Math.floor(Math.random() * pool.length)];
    if (!previous || (p && p.text !== previous.text)) return p;
  }
  return pool[0];
}

// 把诗库数据生成完整的 src/poems.js 文件内容
export function generatePoemsJs(poems) {
  const L = [];
  L.push("// 树洞诗集 · 本地诗库（由「诗库管理」导出）");
  L.push("// 每首诗：style: \"modern\" | \"classical\"，text 用 \\n 分行。");
  L.push("");
  L.push("const POEMS = {");
  for (const id of EMOTION_IDS) {
    L.push(`  ${id}: [`);
    for (const p of poems[id] || []) {
      L.push(
        `    { style: ${JSON.stringify(p.style || "modern")}, text: ${JSON.stringify(p.text || "")} },`
      );
    }
    L.push("  ],");
  }
  L.push("};");
  L.push("");
  L.push("export const EMOTION_IDS = Object.keys(POEMS);");
  L.push("");
  L.push("export function allPoems() {");
  L.push("  return EMOTION_IDS.flatMap((id) => POEMS[id]);");
  L.push("}");
  L.push("");
  L.push("export function randomPoem(emotion) {");
  L.push("  const pool = emotion && POEMS[emotion] && POEMS[emotion].length ? POEMS[emotion] : allPoems();");
  L.push("  return pool[Math.floor(Math.random() * pool.length)];");
  L.push("}");
  L.push("");
  L.push("export function randomPoemExcept(emotion, previous) {");
  L.push("  if (!previous) return randomPoem(emotion);");
  L.push("  for (let i = 0; i < 12; i++) {");
  L.push("    const p = randomPoem(emotion);");
  L.push("    if (p.text !== previous.text) return p;");
  L.push("  }");
  L.push("  return randomPoem(emotion);");
  L.push("}");
  L.push("");
  L.push("export default POEMS;");
  return L.join("\n");
}

// GitHub 发布用的令牌存取（只存在当前浏览器，不上传别处）
export function loadToken() {
  if (typeof localStorage === "undefined") return "";
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function saveToken(token) {
  if (typeof localStorage === "undefined") return;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
