// 树洞诗集 · 会动的手绘泼墨涂鸦背景
// 统一暖黄纸色之上：泼墨团缓慢呼吸、随性线条“一笔一笔”画出又淡去、
// 星星/叶子/旋涡/小花等涂鸦缓缓漂浮旋转。中心区域刻意保持干净，保证文字清晰。

const INK = "#46335c"; // 墨色（深紫褐）
const GOLD = "#d99a3f"; // 金色
const OLIVE = "#7d8f6a"; // 一点灰绿点缀

const STROKE_COLORS = [INK, INK, INK, GOLD, OLIVE];

function hexToRgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

const DOODLES = {
  star(c, s) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s : s * 0.45;
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.closePath();
    c.stroke();
  },
  leaf(c, s) {
    c.beginPath();
    c.moveTo(-s, 0);
    c.quadraticCurveTo(0, -s * 1.05, s, 0);
    c.quadraticCurveTo(0, s * 1.05, -s, 0);
    c.stroke();
    c.beginPath();
    c.moveTo(-s * 0.85, 0);
    c.quadraticCurveTo(0, 0, s * 0.85, 0);
    c.stroke();
  },
  swirl(c, s) {
    c.beginPath();
    for (let i = 0; i <= 44; i++) {
      const t = i / 44;
      const r = s * 0.14 + s * 0.82 * t;
      const a = t * Math.PI * 3.4;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) c.moveTo(px, py);
      else c.lineTo(px, py);
    }
    c.stroke();
  },
  dots(c, s) {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.7;
      const r = s * 0.55;
      c.beginPath();
      c.arc(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65, s * 0.15, 0, Math.PI * 2);
      c.fill();
    }
    c.beginPath();
    c.arc(0, 0, s * 0.2, 0, Math.PI * 2);
    c.fill();
  },
  crescent(c, s) {
    c.beginPath();
    c.arc(0, 0, s, 0, Math.PI * 2);
    c.moveTo(s * 0.32, -s * 0.92);
    c.arc(0, 0, s * 0.7, 0.5, 2.9);
    c.stroke();
  },
  bloom(c, s) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      c.beginPath();
      c.ellipse(Math.cos(a) * s * 0.52, Math.sin(a) * s * 0.52, s * 0.32, s * 0.18, a, 0, Math.PI * 2);
      c.stroke();
    }
    c.beginPath();
    c.arc(0, 0, s * 0.13, 0, Math.PI * 2);
    c.fill();
  },
};

export function initInk(canvas, { reducedMotion = false } = {}) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let dpr = 1;
  let lines = [];
  let washes = [];
  let doodles = [];
  const rand = (a, b) => a + Math.random() * (b - a);

  function inCenter(x, y) {
    return x > w * 0.28 && x < w * 0.72 && y > h * 0.2 && y < h * 0.74;
  }

  function pickPos(margin = 30) {
    for (let i = 0; i < 8; i++) {
      const x = rand(margin, w - margin);
      const y = rand(margin, h - margin);
      if (!inCenter(x, y) || Math.random() < 0.22) return { x, y };
    }
    return { x: rand(0, w), y: rand(0, h) };
  }

  function spawnLine({ initial = false } = {}) {
    const { x, y } = pickPos();
    const angle = rand(0, Math.PI * 2);
    const len = rand(90, Math.min(w, h) * 0.52);
    const n = 26;
    const wob = rand(8, 26);
    const phase = rand(0, Math.PI * 2);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      pts.push({
        x: x + Math.cos(angle) * len * t + Math.sin(t * 5.5 + phase) * wob,
        y: y + Math.sin(angle) * len * t + Math.cos(t * 4.6 + phase) * wob * 0.8,
      });
    }
    lines.push({
      pts,
      progress: initial ? rand(0.45, 1) : 0,
      speed: rand(0.0025, 0.006),
      hold: 0,
      alpha: Math.random() < 0.28 ? rand(0.34, 0.5) : rand(0.2, 0.34),
      color: STROKE_COLORS[Math.floor(Math.random() * STROKE_COLORS.length)],
      width: Math.random() < 0.28 ? rand(3, 4.6) : rand(1.6, 3.0),
      phase: rand(0, Math.PI * 2),
    });
    if (lines.length > 13) lines.shift();
  }

  function spawnWash() {
    const side = Math.floor(Math.random() * 4);
    const x = side === 0 ? rand(-0.08, 0.24) * w : side === 1 ? rand(0.76, 1.08) * w : rand(0, w);
    const y = side === 2 ? rand(-0.08, 0.2) * h : side === 3 ? rand(0.8, 1.08) * h : rand(0, h);
    washes.push({
      x,
      y,
      r: rand(Math.min(w, h) * 0.16, Math.min(w, h) * 0.34),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.07, 0.14),
      color: Math.random() < 0.75 ? INK : GOLD,
    });
    if (washes.length > 5) washes.shift();
  }

  function spawnDoodle() {
    const { x, y } = pickPos(40);
    const types = Object.keys(DOODLES);
    doodles.push({
      type: types[Math.floor(Math.random() * types.length)],
      x,
      y,
      size: rand(10, 26),
      vy: rand(0.08, 0.28),
      rot: rand(0, Math.PI * 2),
      vr: (Math.random() - 0.5) * 0.004,
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.34, 0.62),
      color: Math.random() < 0.7 ? INK : GOLD,
    });
    if (doodles.length > 14) doodles.shift();
  }

  function drawDoodle(d, t) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.rot + Math.sin(t * 0.0004 + d.phase) * 0.2);
    ctx.globalAlpha = d.alpha;
    ctx.strokeStyle = d.color;
    ctx.fillStyle = d.color;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    DOODLES[d.type](ctx, d.size);
    ctx.restore();
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, w, h);

    // 泼墨团（缓慢呼吸）
    for (const ws of washes) {
      const pulse = 1 + Math.sin(t * 0.0003 + ws.phase) * 0.06;
      const g = ctx.createRadialGradient(ws.x, ws.y, 0, ws.x, ws.y, ws.r * pulse);
      g.addColorStop(0, hexToRgba(ws.color, ws.alpha * 1.4));
      g.addColorStop(0.6, hexToRgba(ws.color, ws.alpha * 0.6));
      g.addColorStop(1, hexToRgba(ws.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ws.x, ws.y, ws.r * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // 随性线条：一笔一笔画出来，稍作停留后淡去
    for (let i = lines.length - 1; i >= 0; i--) {
      const ln = lines[i];
      if (!reducedMotion) ln.progress += ln.speed;
      let drawAlpha = ln.alpha;
      if (ln.progress >= 1) {
        ln.hold += 1;
        if (ln.hold > 70) {
          drawAlpha = ln.alpha * Math.max(0, 1 - (ln.hold - 70) / 60);
        }
        if (ln.hold > 130) {
          lines.splice(i, 1);
          spawnLine();
          continue;
        }
      }
      const count = Math.max(2, Math.floor(ln.pts.length * Math.min(1, ln.progress)));
      ctx.globalAlpha = drawAlpha;
      ctx.strokeStyle = ln.color;
      ctx.lineWidth = ln.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let j = 0; j < count; j++) {
        const p = ln.pts[j];
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      // 手绘感：同一根线再描一遍，略偏移、淡一点
      ctx.globalAlpha = drawAlpha * 0.45;
      ctx.beginPath();
      for (let j = 0; j < count; j++) {
        const p = ln.pts[j];
        const off = Math.sin(j * 2.3 + ln.phase) * 1.2;
        if (j === 0) ctx.moveTo(p.x + off, p.y - off * 0.6);
        else ctx.lineTo(p.x + off, p.y - off * 0.6);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 漂浮涂鸦
    for (let i = doodles.length - 1; i >= 0; i--) {
      const d = doodles[i];
      if (!reducedMotion) {
        d.y -= d.vy;
        d.x += Math.sin(t * 0.0002 + d.phase) * 0.12;
        d.rot += d.vr;
        if (d.y < -40 || d.x < -40 || d.x > w + 40) {
          doodles.splice(i, 1);
          spawnDoodle();
          continue;
        }
      }
      drawDoodle(d, t);
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
    lines = [];
    washes = [];
    doodles = [];
    for (let i = 0; i < 4; i++) spawnWash();
    for (let i = 0; i < 11; i++) spawnLine({ initial: reducedMotion });
    for (let i = 0; i < 16; i++) spawnDoodle();
  }

  function loop(now) {
    drawFrame(now);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();
  if (reducedMotion) {
    drawFrame(0);
  } else {
    requestAnimationFrame(loop);
  }
}
