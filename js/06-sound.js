// 走行音（Web Audioで合成。録音は使わない）
// 合成のパラメータは、公開されている仕様を参考にした（E231系：IGBT-VVVFインバータ制御、
// 加速度 3.0 km/h/s 前後、減速度 4.0 km/h/s、回生ブレーキ＋空気ブレーキ）。
// 実際の車両の録音とは一致しない。
let audioCtx = null;

const E231 = {
  accelKmhPerSec: 3.0,   // 加速度（3.0 km/h/s を基準）
  decelKmhPerSec: 4.0,   // 減速度（4.0 km/h/s）
  maxKmh: 120,           // 最高速度
  stepHz: 9.0,           // インバータの周波数の段階（PWMの切り替わり）
};

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state !== 'running') audioCtx.resume();
  return audioCtx;
}

// iPad（Safari）は、画面をタップした後でないと音を出せない。最初のタップで音声を準備する。
function unlockAudioOnGesture() {
  const unlock = () => {
    const ctx = ensureAudio(); if (!ctx) return;
    const src = ctx.createBufferSource(); src.buffer = ctx.createBuffer(1, 1, 22050); src.connect(ctx.destination); src.start(0);
  };
  ['touchstart', 'touchend', 'pointerup', 'click', 'keydown'].forEach((ev) => document.addEventListener(ev, unlock, { passive: true }));
  // 画面を閉じたり、他のアプリに切り替えたあとに、音声が止まることがあるので戻す
  document.addEventListener('visibilitychange', () => { if (!document.hidden && audioCtx && audioCtx.state !== 'running') audioCtx.resume(); });
}
unlockAudioOnGesture();

// 速度（km/h）に対応する、インバータの周波数（Hz）。加速中は周波数が段階的に上がる。
function inverterHz(kmh) {
  return 180 + (kmh / E231.maxKmh) * 1100;
}

// 加速音：周波数を段階的に上げる（VVVFの「ウィーン」）。加速度から時間を決める。
function playVvvf(durationSec, fromKmh) {
  const ctx = ensureAudio(); if (!ctx) return;
  const t0 = ctx.currentTime;
  const toKmh = Math.min(E231.maxKmh, fromKmh + E231.accelKmhPerSec * durationSec);
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.linearRampToValueAtTime(0.14, t0 + 0.25);
  master.gain.linearRampToValueAtTime(0.0001, t0 + durationSec);
  master.connect(ctx.destination);
  // 基本の音（のこぎり波）と、やや高い倍音（三角波）を重ねる
  const osc = ctx.createOscillator(); osc.type = 'sawtooth';
  const osc2 = ctx.createOscillator(); osc2.type = 'triangle';
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400; lp.Q.value = 0.7;
  const g2 = ctx.createGain(); g2.gain.value = 0.35;
  osc.connect(lp); osc2.connect(g2); g2.connect(lp); lp.connect(master);
  // 周波数を段階的に変える（インバータの切り替わりを再現）
  const steps = Math.max(2, Math.floor(durationSec * E231.stepHz));
  for (let i = 0; i <= steps; i++) {
    const t = t0 + (durationSec * i) / steps;
    const kmh = fromKmh + (toKmh - fromKmh) * (i / steps);
    const hz = inverterHz(kmh);
    osc.frequency.setValueAtTime(hz, t);
    osc2.frequency.setValueAtTime(hz * 2.01, t);
  }
  osc.start(t0); osc2.start(t0);
  osc.stop(t0 + durationSec + 0.05); osc2.stop(t0 + durationSec + 0.05);
}

// 制動音：回生ブレーキの唸り（周波数が下がる）と、空気ブレーキの摩擦音（ノイズ）
function playBrake(durationSec, fromKmh) {
  const ctx = ensureAudio(); if (!ctx) return;
  const t0 = ctx.currentTime;
  const toKmh = Math.max(0, fromKmh - E231.decelKmhPerSec * durationSec);
  // 回生ブレーキの唸り
  const osc = ctx.createOscillator(); osc.type = 'sawtooth';
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(0.10, t0 + 0.3);
  g.gain.linearRampToValueAtTime(0.0001, t0 + durationSec);
  osc.connect(g); g.connect(ctx.destination);
  const steps = Math.max(2, Math.floor(durationSec * E231.stepHz));
  for (let i = 0; i <= steps; i++) {
    const t = t0 + (durationSec * i) / steps;
    const kmh = fromKmh + (toKmh - fromKmh) * (i / steps);
    osc.frequency.setValueAtTime(inverterHz(kmh) * 0.9, t);
  }
  osc.start(t0); osc.stop(t0 + durationSec + 0.05);
  // 空気ブレーキの摩擦音（低速になるほど強くなる）
  const len = Math.floor(ctx.sampleRate * durationSec);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.5;
  bp.frequency.setValueAtTime(2000, t0);
  bp.frequency.linearRampToValueAtTime(700, t0 + durationSec);
  const gn = ctx.createGain();
  gn.gain.setValueAtTime(0.0001, t0);
  gn.gain.linearRampToValueAtTime(0.10, t0 + durationSec * 0.6);
  gn.gain.linearRampToValueAtTime(0.0001, t0 + durationSec);
  src.connect(bp); bp.connect(gn); gn.connect(ctx.destination);
  src.start(t0); src.stop(t0 + durationSec);
}

// 停車時のドアチャイム（2音）
function playChime() {
  const ctx = ensureAudio(); if (!ctx) return;
  const t0 = ctx.currentTime;
  [[659, 0], [523, 0.45]].forEach(([freq, delay]) => {
    const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0 + delay);
    gain.gain.linearRampToValueAtTime(0.18, t0 + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + 0.6);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0 + delay); osc.stop(t0 + delay + 0.65);
  });
}

// 運転の状態に応じて音を鳴らす（自動運転の1コマごとに呼ばれる）
// 1コマの時間は、動作速度に合わせて短くなる。速度は実際の加速度から求める。
function playPhaseSound(phase) {
  if (!SIM.sound) return;
  if (audioCtx && audioCtx.state !== 'running') audioCtx.resume();
  const sec = 1.8 / SIM.speed;
  const kmh = 40; // 駅間の平均的な速度（表示用の代表値）
  if (phase === 'next') playVvvf(sec * 0.9, kmh * 0.4);
  else if (phase === 'arriving') playBrake(sec * 0.9, kmh);
  else if (phase === 'stopped') playChime();
}

function setSimSound(on) {
  SIM.sound = !!on;
  if (SIM.sound) {
    const ctx = ensureAudio();
    if (ctx) { // ONにしたことが分かる確認音
      const t0 = ctx.currentTime;
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 880;
      const gg = ctx.createGain(); gg.gain.setValueAtTime(0.0001, t0);
      gg.gain.linearRampToValueAtTime(0.15, t0 + 0.02); gg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
      o.connect(gg); gg.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.3);
    }
  }
  const btn = document.getElementById('simSoundBtn');
  if (btn) {
    btn.textContent = SIM.sound ? '音を鳴らす: ON' : '音を鳴らす: OFF';
    btn.className = SIM.sound ? 'm3-chip active' : 'm3-chip';
  }
}
