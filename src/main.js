// 树洞诗集 · 主入口
import "./style.css";
import { detectMood } from "./mood.js";
import { randomPoem, randomPoemExcept } from "./poems.js";
import { renderPoem, scatterPoem, estimateAppearDuration, TIMING } from "./scatter.js";
import * as audio from "./audio.js";
import { generatePoem, isAiConfigured } from "./api.js";

const $ = (sel) => document.querySelector(sel);

const el = {
  dust: $("#dust"),
  brush: $("#brush"),
  soundToggle: $("#sound-toggle"),
  iconOff: $("#icon-sound-off"),
  iconOn: $("#icon-sound-on"),
  home: $("#home"),
  poemView: $("#poem-view"),
  form: $("#poem-form"),
  input: $("#mood-input"),
  example: $("#example-hint"),
  guidance: $("#guidance"),
  poem: $("#poem"),
  againBtn: $("#again-btn"),
  aiBtn: $("#ai-btn"),
  hint: $(".poem-hint"),
  toast: $("#toast"),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const state = {
  view: "home", // "home" | "poem"
  currentPoem: null,
  emotion: "unknown",
  moodText: "",
  token: 0,
  scattering: false,
  aiLoading: false,
};

/* ---------------- 光尘粒子 ---------------- */
function initDust(canvas) {
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];
  let raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.5 + Math.random() * 1.7,
      vy: 0.04 + Math.random() * 0.16,
      vx: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.012,
      warm: Math.random() > 0.22,
    };
  }

  function spawn() {
    if (particles.length < 42) particles.push(makeParticle(false));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.vy;
      p.x += p.vx + Math.sin(t * p.speed + p.phase) * 0.18;
      if (p.y < -12 || p.x < -12 || p.x > w + 12) {
        particles[i] = makeParticle(false);
        continue;
      }
      const twinkle = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * p.speed * 2 + p.phase * 3));
      const alpha = p.warm ? twinkle * 0.75 : twinkle * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.warm ? `rgba(214, 150, 66, ${alpha})` : `rgba(255, 250, 232, ${alpha})`;
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  function tick(ts) {
    spawn();
    draw(ts);
  }

  window.addEventListener("resize", resize);
  resize();
  particles = Array.from({ length: 36 }, () => makeParticle(true));
  raf = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(raf);
}

/* ---------------- 手绘笔触背景 ---------------- */
// 用一串串粗细不均、带抖动的小圆点模拟“一笔一笔”涂上去的笔触
function initBrush(canvas) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;

  const rand = (a, b) => a + Math.random() * (b - a);
  const COLORS = ["#eecb7e", "#f3d284", "#e6b95f", "#f6dfa4", "#dca54c", "#edc470", "#e7bd6b", "#f0cf8f", "#e0ae55", "#f4d995"];

  function stroke(x, y, len, angle, width, alpha) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    const steps = 26;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const wob = Math.sin(t * 9 + angle * 7) * width * 0.5;
      const px = x + Math.cos(angle) * len * t;
      const py = y + Math.sin(angle) * len * t + wob;
      const r = width * (0.35 + 0.65 * Math.abs(Math.sin(t * 5.1 + angle))) + 3;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function paint() {
    ctx.clearRect(0, 0, w, h);

    // 几条很淡的大笔触，像先铺的底色
    for (let i = 0; i < 5; i++) {
      stroke(
        rand(-w * 0.1, w * 1.1),
        rand(-h * 0.1, h * 1.1),
        rand(420, 820),
        rand(-0.5, 0.5),
        rand(110, 190),
        rand(0.025, 0.05)
      );
    }

    // 主体笔触：中心稍稀、边缘密一些
    const count = Math.round((w * h) / 18000);
    for (let i = 0; i < count; i++) {
      let x = rand(0, w);
      let y = rand(0, h);
      // 中央区域（内容所在）少画一些，保证文字清晰
      const inCenter =
        x > w * 0.24 && x < w * 0.76 && y > h * 0.22 && y < h * 0.78;
      if (inCenter && Math.random() < 0.72) {
        x = Math.random() < 0.5 ? rand(-30, w * 0.16) : rand(w * 0.84, w + 30);
        y = rand(0, h);
      }
      stroke(
        x,
        y,
        rand(130, 420),
        rand(-Math.PI, Math.PI),
        rand(24, 80),
        rand(0.16, 0.28)
      );
    }

    // 角落里几笔更明显的深金黄，增加手绘感
    for (let i = 0; i < 10; i++) {
      const corner = i % 4;
      const x = corner % 2 === 0 ? rand(-20, w * 0.22) : rand(w * 0.78, w + 20);
      const y = corner < 2 ? rand(-20, h * 0.24) : rand(h * 0.76, h + 20);
      stroke(x, y, rand(160, 340), rand(-1.2, 1.2), rand(30, 62), rand(0.22, 0.34));
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  }

  window.addEventListener("resize", resize);
  resize();
}

/* ---------------- Toast ---------------- */
let toastTimer = 0;
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 3000);
}

/* ---------------- 视图切换 ---------------- */
function showPoem(poem, { source = "local" } = {}) {
  state.token += 1;
  const token = state.token;
  state.currentPoem = poem;
  state.scattering = false;

  el.hint.style.opacity = "1";
  renderPoem(el.poem, poem.text, { reducedMotion });

  el.home.classList.add("hidden");
  el.guidance.classList.add("hidden");
  el.example.classList.add("hidden");
  el.poemView.classList.remove("hidden");
  el.poemView.setAttribute("aria-hidden", "false");
  state.view = "poem";

  const appearMs = reducedMotion ? 0 : estimateAppearDuration(poem.text);
  const total = appearMs + TIMING.SCATTER_HOLD_MS;
  setTimeout(() => {
    if (token === state.token && state.view === "poem" && !state.scattering && !state.aiLoading) {
      scatterAndReturn();
    }
  }, total);
}

function scatterAndReturn() {
  if (state.scattering) return;
  state.scattering = true;
  state.token += 1;

  el.hint.style.opacity = "0";
  const dur = scatterPoem(el.poem, { reducedMotion });

  setTimeout(() => {
    el.poemView.classList.add("hidden");
    el.poemView.setAttribute("aria-hidden", "true");
    el.home.classList.remove("hidden");
    el.guidance.classList.remove("hidden");
    state.view = "home";
    state.currentPoem = null;
    state.scattering = false;
    el.input.focus({ preventScroll: true });
  }, dur + 250);
}

/* ---------------- 事件 ---------------- */
el.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = el.input.value.trim();
  if (!text) {
    toast("说点什么吧，树洞在听。");
    el.form.classList.remove("form-shake");
    void el.form.offsetWidth;
    el.form.classList.add("form-shake");
    el.input.focus();
    return;
  }

  el.form.classList.remove("form-shake");
  state.moodText = text;
  const mood = detectMood(text);
  state.emotion = mood.emotion;
  const poem = randomPoem(state.emotion === "unknown" ? undefined : state.emotion);
  el.input.value = "";
  showPoem(poem, { source: "local" });
});

// 点击屏幕任意处提前散开（按钮通过 stopPropagation 交给自己处理）
document.addEventListener("click", (e) => {
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;
  if (e.target.closest(".actions") || e.target.closest(".topbar")) return;
  scatterAndReturn();
});

el.againBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;
  const poem = randomPoemExcept(state.emotion === "unknown" ? undefined : state.emotion, state.currentPoem);
  showPoem(poem, { source: "local" });
});

el.aiBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;

  if (!isAiConfigured()) {
    toast("AI 写诗还没接好，先让本地的小诗陪你");
    el.againBtn.click();
    return;
  }

  state.aiLoading = true;
  el.aiBtn.disabled = true;
  el.aiBtn.textContent = "正在写…";

  try {
    const { poem } = await generatePoem({ moodText: state.moodText, emotion: state.emotion === "unknown" ? "" : state.emotion });
    if (state.view === "poem") {
      showPoem({ text: poem, style: "ai" }, { source: "ai" });
    }
  } catch {
    toast("树洞暂时连不上远方，先让本地的小诗陪你");
    if (state.view === "poem") el.againBtn.click();
  } finally {
    state.aiLoading = false;
    el.aiBtn.disabled = false;
    el.aiBtn.textContent = "让 AI 写";
  }
});

// Esc 也可提前散开
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.view === "poem" && !state.scattering) {
    scatterAndReturn();
  }
});

/* ---------------- 环境音 ---------------- */
function setSoundIcon(on) {
  el.iconOff.classList.toggle("hidden", on);
  el.iconOn.classList.toggle("hidden", !on);
  el.soundToggle.classList.toggle("on", on);
  el.soundToggle.setAttribute("aria-label", on ? "关闭环境音" : "开启环境音");
}

el.soundToggle.addEventListener("click", () => {
  const on = audio.toggle();
  setSoundIcon(on);
});

/* ---------------- 启动 ---------------- */
initBrush(el.brush);
if (!reducedMotion) initDust(el.dust);
setSoundIcon(false);
