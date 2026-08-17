// 树洞诗集 · 声音
// 1) 柔和环境音（风声 + 呼吸感，默认关闭）
// 2) 交互音效（点击 / 悬停 / 提交 / 散开 / 开关），全部 Web Audio 合成，无外部音频文件

let ctx = null;
let masterGain = null;
let nodes = [];
let enabled = false;

function getCtx() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/* ================= 交互音效 ================= */

function tone({ freq = 440, type = "sine", dur = 0.15, vol = 0.1, delay = 0, slide = 0 } = {}) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.06);
}

function noiseBurst({ dur = 0.4, vol = 0.08, delay = 0, filterFrom = 600, filterTo = 2600 } = {}) {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(filterFrom, t0);
  f.frequency.exponentialRampToValueAtTime(filterTo, t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.06);
}

// 悬停：极轻的一声“嗒”
export function sfxHover() {
  tone({ freq: 640 + Math.random() * 120, type: "triangle", dur: 0.05, vol: 0.03 });
}

// 点击：短促的“嗒”
export function sfxClick() {
  tone({ freq: 520, type: "triangle", dur: 0.09, vol: 0.09 });
  noiseBurst({ dur: 0.05, vol: 0.04, filterFrom: 1800, filterTo: 900 });
}

// 提交：轻盈的两音风铃
export function sfxSubmit() {
  tone({ freq: 523.25, type: "sine", dur: 0.2, vol: 0.13 });
  tone({ freq: 783.99, type: "sine", dur: 0.32, vol: 0.12, delay: 0.09 });
  tone({ freq: 1046.5, type: "sine", dur: 0.42, vol: 0.06, delay: 0.17 });
  noiseBurst({ dur: 0.35, vol: 0.045, filterFrom: 900, filterTo: 3200, delay: 0.05 });
}

// 换一首：向上的滑音
export function sfxAgain() {
  tone({ freq: 440, type: "triangle", dur: 0.12, vol: 0.09, slide: 140 });
  tone({ freq: 660, type: "sine", dur: 0.18, vol: 0.06, delay: 0.06, slide: 160 });
}

// 散开：一阵风 + 几颗高音星尘
export function sfxScatter() {
  noiseBurst({ dur: 0.75, vol: 0.1, filterFrom: 500, filterTo: 3200 });
  [1250, 1560, 1980].forEach((f, i) => tone({ freq: f, type: "sine", dur: 0.4, vol: 0.05, delay: i * 0.09 }));
}

// 开关：小木塞“啵”
export function sfxPop() {
  tone({ freq: 340, type: "square", dur: 0.08, vol: 0.05, slide: -140 });
}

/* ================= 柔和环境音 ================= */

function createNoiseBuffer(ac) {
  const seconds = 2;
  const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export function isEnabled() {
  return enabled;
}

export function toggle() {
  if (enabled) {
    stop();
  } else {
    start();
  }
  return enabled;
}

export function start() {
  if (enabled) return true;
  const ac = getCtx();
  if (!ac) return false;

  masterGain = ac.createGain();
  masterGain.gain.setValueAtTime(0, ac.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 2.5);
  masterGain.connect(ac.destination);

  const noise = ac.createBufferSource();
  noise.buffer = createNoiseBuffer(ac);
  noise.loop = true;

  const windFilter = ac.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 420;
  windFilter.Q.value = 0.6;

  const windGain = ac.createGain();
  windGain.gain.value = 0.1;

  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain);
  lfoGain.connect(windFilter.frequency);

  noise.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  noise.start();
  lfo.start();

  const breath = ac.createOscillator();
  breath.type = "sine";
  breath.frequency.value = 58;

  const breathGain = ac.createGain();
  breathGain.gain.value = 0;

  const breathLfo = ac.createOscillator();
  breathLfo.frequency.value = 0.12;
  const breathLfoGain = ac.createGain();
  breathLfoGain.gain.value = 0.02;
  breathLfo.connect(breathLfoGain);
  breathLfoGain.connect(breathGain.gain);

  breath.connect(breathGain);
  breathGain.connect(masterGain);
  breath.start();
  breathLfo.start();

  nodes = [noise, windFilter, windGain, lfo, lfoGain, breath, breathGain, breathLfo, breathLfoGain];
  enabled = true;
  return true;
}

export function stop() {
  if (!ctx || !enabled) return false;
  const ac = ctx;
  const now = ac.currentTime;
  if (masterGain) {
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 1.2);
  }
  for (const n of nodes) {
    try {
      if (typeof n.stop === "function") n.stop(now + 1.4);
    } catch {
      /* already stopped */
    }
  }
  nodes = [];
  enabled = false;
  setTimeout(() => {
    try {
      if (masterGain) masterGain.disconnect();
    } catch {
      /* noop */
    }
  }, 1600);
  return true;
}
