// 树洞诗集 · 主入口
import "./style.css";
import { detectMood } from "./mood.js";
import { randomPoem, randomPoemExcept } from "./poems.js";
import { renderPoem, scatterPoem, estimateAppearDuration, TIMING } from "./scatter.js";
import * as audio from "./audio.js";
import { generatePoem, isAiConfigured } from "./api.js";
import { initInk } from "./ink.js";

const $ = (sel) => document.querySelector(sel);

const el = {
  ink: $("#ink"),
  dust: $("#dust"),
  pulse: $("#pulse"),
  soundToggle: $("#sound-toggle"),
  iconOff: $("#icon-sound-off"),
  iconOn: $("#icon-sound-on"),
  sketch: $("#sketch"),
  candle: $("#candle-btn"),
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
  const c = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let particles = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(initial) {
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.5 + Math.random() * 1.8,
      vy: 0.05 + Math.random() * 0.18,
      vx: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.012,
      warm: Math.random() > 0.22,
    };
  }

  function draw(t) {
    c.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.vy;
      p.x += p.vx + Math.sin(t * p.speed + p.phase) * 0.18;
      if (p.y < -12 || p.x < -12 || p.x > w + 12) {
        particles[i] = makeParticle(false);
        continue;
      }
      const twinkle = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * p.speed * 2 + p.phase * 3));
      const alpha = p.warm ? twinkle * 0.7 : twinkle * 0.45;
      c.beginPath();
      c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      c.fillStyle = p.warm ? `rgba(217, 154, 63, ${alpha})` : `rgba(255, 251, 238, ${alpha})`;
      c.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  particles = Array.from({ length: 40 }, () => makeParticle(true));
  requestAnimationFrame(draw);
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

function firePulse() {
  const p = el.pulse;
  p.classList.remove("go");
  void p.offsetWidth;
  p.classList.add("go");
}

function scatterAndReturn() {
  if (state.scattering) return;
  state.scattering = true;
  state.token += 1;

  el.hint.style.opacity = "0";
  audio.sfxScatter();
  firePulse();
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
    audio.sfxPop();
    toast("写点什么吧，树洞在听。");
    el.sketch.classList.remove("form-shake");
    void el.sketch.offsetWidth;
    el.sketch.classList.add("form-shake");
    el.input.focus();
    return;
  }

  audio.sfxSubmit();
  el.candle.classList.add("lit");
  el.sketch.classList.add("sending");
  el.sketch.classList.remove("lifted");

  state.moodText = text;
  const mood = detectMood(text);
  state.emotion = mood.emotion;
  const poem = randomPoem(state.emotion === "unknown" ? undefined : state.emotion);
  el.input.value = "";

  setTimeout(() => {
    el.candle.classList.remove("lit");
    el.sketch.classList.remove("sending");
    showPoem(poem, { source: "local" });
  }, 480);
});

// 点画面任意处提前散开（按钮通过 stopPropagation 交给自己）
document.addEventListener("click", (e) => {
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;
  if (e.target.closest(".actions")) return;
  scatterAndReturn();
});

el.againBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;
  audio.sfxAgain();
  const poem = randomPoemExcept(state.emotion === "unknown" ? undefined : state.emotion, state.currentPoem);
  showPoem(poem, { source: "local" });
});

el.aiBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (state.view !== "poem" || state.scattering || state.aiLoading) return;

  if (!isAiConfigured()) {
    toast("AI 写诗还没接好，先让本地的小诗陪你");
    audio.sfxAgain();
    el.againBtn.click();
    return;
  }

  state.aiLoading = true;
  el.aiBtn.disabled = true;
  el.aiBtn.innerHTML = "<span>正在写…</span>";

  try {
    const { poem } = await generatePoem({ moodText: state.moodText, emotion: state.emotion === "unknown" ? "" : state.emotion });
    if (state.view === "poem") {
      showPoem({ text: poem, style: "ai" }, { source: "ai" });
    }
  } catch {
    toast("树洞暂时连不上远方，先让本地的小诗陪你");
    audio.sfxAgain();
    if (state.view === "poem") el.againBtn.click();
  } finally {
    state.aiLoading = false;
    el.aiBtn.disabled = false;
    el.aiBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z" fill="currentColor"/></svg><span>让 AI 写</span>';
  }
});

// Esc 也可提前散开
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.view === "poem" && !state.scattering) {
    scatterAndReturn();
  }
});

// 输入获得焦点：虚线框轻轻抬起
el.input.addEventListener("focus", () => {
  el.sketch.classList.add("lifted");
  if (!reducedMotion) audio.sfxHover();
});

el.input.addEventListener("blur", () => {
  el.sketch.classList.remove("lifted");
});

/* ---------------- 音效接线 ---------------- */
function wireSfx() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, .candle, .text-btn");
    if (!t) return;
    if (t.id === "sound-toggle") return; // 由自己的处理函数播放“啵”
    if (t.id === "candle-btn") return; // 由表单提交播放风铃
    audio.sfxClick();
  });
  document.querySelectorAll("button, .candle").forEach((b) => {
    b.addEventListener("pointerenter", () => {
      if (!b.disabled && !reducedMotion) audio.sfxHover();
    });
  });
}

/* ---------------- 环境音 ---------------- */
function setSoundIcon(on) {
  el.iconOff.classList.toggle("hidden", on);
  el.iconOn.classList.toggle("hidden", !on);
  el.soundToggle.classList.toggle("on", on);
  el.soundToggle.setAttribute("aria-label", on ? "关闭环境音" : "开启环境音");
}

el.soundToggle.addEventListener("click", () => {
  audio.sfxPop();
  const on = audio.toggle();
  setSoundIcon(on);
});

/* ---------------- 启动 ---------------- */
initInk(el.ink, { reducedMotion });
if (!reducedMotion) initDust(el.dust);
wireSfx();
setSoundIcon(false);
