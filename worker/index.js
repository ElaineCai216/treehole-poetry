// 树洞诗集 · AI 写诗代理（Cloudflare Worker）
// 隐藏大模型 API Key；前端只调用本 Worker。
//
// 环境变量（在 Cloudflare 中配置）：
//   DEEPSEEK_API_KEY 或 OPENAI_API_KEY   大模型密钥
//   BASE_URL         （可选）OpenAI 兼容接口地址，默认 https://api.deepseek.com
//   MODEL            （可选）模型名，默认 deepseek-chat
//   ALLOWED_ORIGIN   （可选）允许的前端来源，逗号分隔；留空则允许所有来源

const EMOTION_LABELS = {
  happy: "开心",
  calm: "平静",
  sad: "难过",
  tired: "疲惫",
  anxious: "焦虑",
  missing: "思念",
  lonely: "孤独",
  angry: "愤怒",
};

const SYSTEM_PROMPT = `你是住在树洞里的一只温柔小精灵，也是一位中文诗人。根据用户描述的心情，写一首短诗。
要求：
1. 现代诗 4-8 行，或五言/七言古风 4 句，两种风格随机选择；
2. 贴合情绪，细腻、克制、有画面感，像悄悄话一样温柔；
3. 只输出诗本身，不要标题，不要解释，不要引导语，不要引号；
4. 避免说教、避免空洞的鼓励，让诗自己说话。`;

function corsHeaders(env, request) {
  const origin = request.headers.get("Origin");
  const allowed = (env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.length === 0 ? "*" : origin && allowed.includes(origin) ? origin : "";
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (allowOrigin) headers["Access-Control-Allow-Origin"] = allowOrigin;
  return headers;
}

function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

async function generatePoem(env, moodText, emotion) {
  const apiKey = env.DEEPSEEK_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "missing-api-key" };
  }
  const baseUrl = (env.BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = env.MODEL || "deepseek-chat";
  const label = EMOTION_LABELS[emotion] || "此刻的心情";

  const userPrompt = `用户的心情（${label}）：${moodText}\n请为这份心情写一首诗。`;

  let res;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 1.1,
        max_tokens: 220,
      }),
    });
  } catch {
    return { ok: false, error: "upstream-network" };
  }

  if (!res.ok) {
    return { ok: false, error: `upstream-${res.status}` };
  }

  try {
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "";
    let poem = content
      .replace(/^["'“”《》\s]+|["'“”《》\s]+$/g, "")
      .trim();
    // 去掉可能的标题行（如果模型多输出了一行非诗内容，保底只取非空行）
    const lines = poem.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return { ok: false, error: "empty" };
    return { ok: true, poem: lines.join("\n") };
  } catch {
    return { ok: false, error: "parse" };
  }
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(env, request);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname !== "/poem") {
      return json({ error: "not found" }, 404, cors);
    }
    if (request.method !== "POST") {
      return json({ error: "method not allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid json" }, 400, cors);
    }

    const moodText = String(body.mood_text || "").trim().slice(0, 200);
    const emotion = String(body.emotion || "").trim().slice(0, 24);
    if (!moodText) {
      return json({ error: "mood_text required" }, 400, cors);
    }

    const result = await generatePoem(env, moodText, emotion);
    if (!result.ok) {
      return json({ error: result.error }, 502, cors);
    }
    return json({ poem: result.poem, style: "ai" }, 200, cors);
  },
};
