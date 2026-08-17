// 树洞诗集 · AI 写诗客户端
// 通过 Cloudflare Worker 代理调用大模型（隐藏密钥）。
// 部署后把 Worker 地址填到 WORKER_URL；未配置时点击“让 AI 写”会优雅降级到本地诗库。

// TODO: 部署后替换为你的 Worker 地址，例如 "https://treehole-poetry.yourname.workers.dev"
const WORKER_URL = "";

export function isAiConfigured() {
  return WORKER_URL.trim().length > 0;
}

// 调用代理生成诗。成功返回 { poem, style }；失败抛出带 code 的 Error：
//  - "not-configured" 未配置 Worker
//  - "network"        网络/代理错误
//  - "empty"          模型没返回诗
export async function generatePoem({ moodText, emotion }) {
  if (!isAiConfigured()) {
    throw Object.assign(new Error("AI 写诗尚未配置"), { code: "not-configured" });
  }

  let res;
  try {
    res = await fetch(`${WORKER_URL}/poem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood_text: moodText, emotion }),
    });
  } catch {
    throw Object.assign(new Error("网络连接失败"), { code: "network" });
  }

  if (!res.ok) {
    throw Object.assign(new Error(`代理返回 ${res.status}`), { code: "network" });
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw Object.assign(new Error("响应解析失败"), { code: "network" });
  }

  const poem = (data && data.poem ? String(data.poem) : "").trim();
  if (!poem) {
    throw Object.assign(new Error("没有收到诗"), { code: "empty" });
  }
  return { poem, style: data.style || "modern" };
}
