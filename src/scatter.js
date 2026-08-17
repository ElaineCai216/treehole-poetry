// 树洞诗集 · 诗的字浮现与散开消失动画
// 每个字一个 span：先逐字柔和浮现，散开时每个字像光尘一样各自漂移、旋转、淡出。

const CHAR_IN_MS = 700; // 单字浮现时长
const CHAR_STAGGER_MS = 42; // 相邻字浮现间隔
const SCATTER_HOLD_MS = 10000; // 默认停留时长，之后自动散开

export function splitToChars(text) {
  return Array.from(text);
}

// 把诗渲染成逐字 span；返回 container（已清空并填充）
export function renderPoem(container, poemText, { reducedMotion = false } = {}) {
  container.innerHTML = "";
  const lines = poemText.split("\n").filter((l) => l.length > 0);
  lines.forEach((line, li) => {
    const lineEl = document.createElement("div");
    lineEl.className = "poem-line";
    const chars = splitToChars(line);
    let index = 0;
    for (const ch of chars) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      if (reducedMotion) {
        span.style.opacity = "1";
      } else {
        span.style.setProperty("--d", `${li * 60 + index * CHAR_STAGGER_MS}ms`);
      }
      lineEl.appendChild(span);
      index += 1;
    }
    container.appendChild(lineEl);
  });

  if (reducedMotion) {
    container.classList.add("reduced");
  }
  return container;
}

// 返回预计浮现完成所需毫秒数（供调用方安排停留计时）
export function estimateAppearDuration(poemText) {
  const maxLine = Math.max(
    1,
    ...poemText
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => splitToChars(l).length)
  );
  return CHAR_IN_MS + maxLine * CHAR_STAGGER_MS + 400;
}

// 触发散开：每个字随机漂移+旋转+淡出。返回动画预计时长（毫秒）
export function scatterPoem(container, { reducedMotion = false } = {}) {
  const chars = container.querySelectorAll(".char");
  if (reducedMotion || chars.length === 0) {
    container.style.transition = "opacity .8s ease";
    container.style.opacity = "0";
    return 900;
  }

  let maxDur = 0;
  chars.forEach((ch, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 220; // 漂移距离（px）
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist * 0.85 + 30; // 略向下偏，像尘埃落下
    const rot = (Math.random() - 0.5) * 60;
    const dur = 2200 + Math.random() * 1400; // 2.2s - 3.6s
    const delay = Math.random() * 500; // 0 - 0.5s 波浪感
    ch.style.setProperty("--dx", `${dx.toFixed(1)}px`);
    ch.style.setProperty("--dy", `${dy.toFixed(1)}px`);
    ch.style.setProperty("--rot", `${rot.toFixed(1)}deg`);
    ch.style.setProperty("--dur", `${(dur / 1000).toFixed(2)}s`);
    ch.style.setProperty("--sd", `${(delay / 1000).toFixed(2)}s`);
    void ch.offsetWidth; // 强制重排，确保动画重新触发
    ch.classList.add("scattering");
    if (dur + delay > maxDur) maxDur = dur + delay;
  });
  return maxDur + 500;
}

export const TIMING = { CHAR_IN_MS, CHAR_STAGGER_MS, SCATTER_HOLD_MS };
