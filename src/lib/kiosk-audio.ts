let audioCtx: AudioContext | null = null;

function getAudio(): AudioContext {
  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return audioCtx;
}

function beep(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.3) {
  try {
    const ctx = getAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {}
}

export const scanBeep = () => { beep(1800, 0.08, 'square', 0.2); setTimeout(() => beep(2200, 0.08, 'square', 0.15), 80); };
export const errorTone = () => { beep(220, 0.4, 'sawtooth', 0.15); setTimeout(() => beep(180, 0.5, 'sawtooth', 0.12), 300); };
export const successChime = () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.25, 'sine', 0.2), i * 80)); };
export const clickBeep = () => { beep(900, 0.06, 'square', 0.1); };
export const initAudio = () => { try { getAudio(); beep(1200, 0.1, 'sine', 0.2); } catch {} };
