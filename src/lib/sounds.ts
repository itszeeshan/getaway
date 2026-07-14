'use client';

/**
 * Tiny Web Audio synth for game sounds — no audio assets needed.
 * The AudioContext is created lazily on first use (autoplay policy requires
 * a user gesture before audio can start).
 */

const MUTE_KEY = 'getaway-muted';

let ctx: AudioContext | null = null;
let muted = false;

if (typeof window !== 'undefined') {
  muted = localStorage.getItem(MUTE_KEY) === '1';
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  localStorage.setItem(MUTE_KEY, value ? '1' : '0');
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  { duration = 0.15, delay = 0, gain = 0.12, type = 'sine' as OscillatorType } = {}
) {
  const ac = getCtx();
  if (!ac || muted) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

// Filtered noise burst — the "swish/flick" of a card.
function swish({ duration = 0.09, delay = 0, gain = 0.25, freq = 2400 } = {}) {
  const ac = getCtx();
  if (!ac || muted) return;
  const t = ac.currentTime + delay;
  const length = Math.ceil(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, t);
  filter.Q.value = 0.9;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t);
}

export const sounds = {
  /** UI button press */
  click() {
    tone(520, { duration: 0.06, gain: 0.08, type: 'triangle' });
  },

  /** A card thrown onto the table (any player) */
  cardPlay() {
    swish({ duration: 0.08, freq: 2600 });
    tone(180, { duration: 0.07, delay: 0.05, gain: 0.07, type: 'triangle' });
  },

  /** Shuffle + deal at round start */
  shuffle() {
    for (let i = 0; i < 7; i++) {
      swish({ duration: 0.05, delay: i * 0.07, gain: 0.14, freq: 2000 + (i % 3) * 500 });
    }
  },

  /** It's your turn */
  yourTurn() {
    tone(660, { duration: 0.12, gain: 0.1 });
    tone(880, { duration: 0.18, delay: 0.11, gain: 0.1 });
  },

  /** Trick resolved */
  trickResult() {
    swish({ duration: 0.12, freq: 1200, gain: 0.16 });
    tone(392, { duration: 0.14, delay: 0.03, gain: 0.08, type: 'triangle' });
  },

  /** You got away */
  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, { duration: 0.22, delay: i * 0.11, gain: 0.11 }));
  },

  /** You're the loser */
  lose() {
    tone(330, { duration: 0.28, gain: 0.11, type: 'triangle' });
    tone(262, { duration: 0.34, delay: 0.22, gain: 0.11, type: 'triangle' });
    tone(196, { duration: 0.5, delay: 0.46, gain: 0.11, type: 'triangle' });
  },
};
