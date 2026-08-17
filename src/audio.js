// 树洞诗集 · 柔和环境音（Web Audio 合成，无外部音频文件）
// 默认关闭；开启后播放轻柔的“风声 + 呼吸感”氛围音。

let ctx = null;
let masterGain = null;
let nodes = [];
let enabled = false;

function createNoiseBuffer(ac) {
  const seconds = 2;
  const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    // 布朗噪声：柔和、低频为主的“风”
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
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = ctx || new AC();
  if (ctx.state === "suspended") ctx.resume();

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5); // 缓缓进入，不吓人
  masterGain.connect(ctx.destination);

  // 风声：布朗噪声 → 低通滤波（频率缓慢起伏）
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx);
  noise.loop = true;

  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 420;
  windFilter.Q.value = 0.6;

  const windGain = ctx.createGain();
  windGain.gain.value = 0.10;

  // 用 LFO 让风声频率缓慢起伏，像深夜的风
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain);
  lfoGain.connect(windFilter.frequency);

  noise.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  noise.start();
  lfo.start();

  // 呼吸感：极低频正弦，增益被慢 LFO 起伏
  const breath = ctx.createOscillator();
  breath.type = "sine";
  breath.frequency.value = 58;

  const breathGain = ctx.createGain();
  breathGain.gain.value = 0;

  const breathLfo = ctx.createOscillator();
  breathLfo.frequency.value = 0.12; // 每 ~8s 一次起伏
  const breathLfoGain = ctx.createGain();
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
    masterGain.gain.linearRampToValueAtTime(0, now + 1.2); // 缓缓淡出
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
  // 1.5s 后断开主增益
  setTimeout(() => {
    try {
      if (masterGain) masterGain.disconnect();
    } catch {
      /* noop */
    }
  }, 1600);
  return true;
}
