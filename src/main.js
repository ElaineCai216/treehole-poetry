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
      ctx.fillStyle = p.warm ? `rgba(252, 224, 160, ${alpha})` : `rgba(185, 163, 216, ${alpha})`;
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

/* ---------------- 星空 ---------------- */
function initStars(container) {
  if (!container) return;
  const frag = document.createDocumentFragment();
  const count = 46;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("i");
    s.className = "star";
    const size = Math.random() < 0.16 ? 2.4 + Math.random() * 1.8 : 1 + Math.random() * 1.5;
    s.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    s.style.top = `${(Math.random() * 60).toFixed(2)}%`;
    s.style.width = `${size.toFixed(1)}px`;
    s.style.height = `${size.toFixed(1)}px`;
    s.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
    s.style.animationDelay = `${(Math.random() * 6).toFixed(2)}s`;
    s.style.animationDuration = `${(3 + Math.random() * 5).toFixed(2)}s`;
    frag.appendChild(s);
  }
  for (let i = 0; i < 4; i++) {
    const sp = document.createElement("i");
    sp.className = "star sparkle";
    sp.style.left = `${(5 + Math.random() * 85).toFixed(1)}%`;
    sp.style.top = `${(4 + Math.random() * 42).toFixed(1)}%`;
    sp.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
    frag.appendChild(sp);
  }
  container.appendChild(frag);
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
if (!reducedMotion) {
  initDust(el.dust);
  initStars($("#stars"));
}
setSoundIcon(false);
