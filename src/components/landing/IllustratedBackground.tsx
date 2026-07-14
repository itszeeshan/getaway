'use client';

/**
 * Full-screen animated illustrated scene — reads like a looping background
 * video without needing a video asset. To swap in a real video later, replace
 * this component's contents with a muted looping <video> element.
 */

const CLOUDS = [
  { top: '8%', scale: 1.1, duration: 90, delay: -20, opacity: 0.9 },
  { top: '18%', scale: 0.7, duration: 70, delay: -50, opacity: 0.7 },
  { top: '30%', scale: 0.9, duration: 110, delay: -80, opacity: 0.5 },
  { top: '5%', scale: 0.55, duration: 60, delay: -10, opacity: 0.6 },
];

const FLOATING_CARDS = [
  { left: '12%', top: '22%', rotate: -14, duration: 7, delay: 0, suit: '♠', color: '#2b3a4a' },
  { left: '78%', top: '16%', rotate: 10, duration: 8.5, delay: 1.2, suit: '♥', color: '#ff6b6b' },
  { left: '86%', top: '55%', rotate: -8, duration: 6.5, delay: 0.6, suit: '♦', color: '#ff6b6b' },
  { left: '6%', top: '62%', rotate: 16, duration: 9, delay: 2, suit: '♣', color: '#2b3a4a' },
];

const SPARKLES = [
  { left: '25%', top: '15%', delay: 0 },
  { left: '65%', top: '10%', delay: 1.1 },
  { left: '90%', top: '35%', delay: 0.5 },
  { left: '15%', top: '45%', delay: 1.8 },
  { left: '50%', top: '8%', delay: 2.4 },
];

function Cloud({ top, scale, duration, delay, opacity }: (typeof CLOUDS)[number]) {
  return (
    <div
      className="absolute w-full"
      style={{ top }}
    >
      <svg
        width={140 * scale}
        height={50 * scale}
        viewBox="0 0 140 50"
        style={{
          animation: `drift ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
          opacity,
        }}
      >
        <g fill="#ffffff">
          <ellipse cx="40" cy="34" rx="34" ry="15" />
          <ellipse cx="72" cy="26" rx="30" ry="18" />
          <ellipse cx="104" cy="34" rx="28" ry="13" />
        </g>
      </svg>
    </div>
  );
}

function FloatingCard({ left, top, rotate, duration, delay, suit, color }: (typeof FLOATING_CARDS)[number]) {
  return (
    <div
      className="absolute"
      style={
        {
          left,
          top,
          '--float-rotate': `${rotate}deg`,
          animation: `float-slow ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties
      }
    >
      <div
        className="w-16 h-24 md:w-20 md:h-28 rounded-xl bg-white/90 border-2 border-white shadow-xl flex items-center justify-center"
        style={{ boxShadow: '0 12px 30px rgba(43,58,74,0.15)' }}
      >
        <span className="text-4xl md:text-5xl" style={{ color }}>{suit}</span>
      </div>
    </div>
  );
}

export default function IllustratedBackground({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#bfe3f7] via-[#dff0fb] to-[#fdf6e9]" />

      {/* Sun */}
      <div className="absolute -top-16 -right-16 w-72 h-72">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,209,102,0.85) 0%, rgba(255,209,102,0.25) 45%, transparent 70%)',
          }}
        />
        <div className="absolute inset-[27%] rounded-full bg-[#ffd166] shadow-[0_0_60px_rgba(255,209,102,0.8)]" />
      </div>

      {/* Clouds drifting across */}
      {CLOUDS.map((c, i) => <Cloud key={i} {...c} />)}

      {/* Sparkles */}
      {!subtle && SPARKLES.map((s, i) => (
        <div
          key={i}
          className="absolute text-2xl text-white"
          style={{
            left: s.left,
            top: s.top,
            animation: 'twinkle 3.5s ease-in-out infinite',
            animationDelay: `${s.delay}s`,
          }}
        >
          ✦
        </div>
      ))}

      {/* Floating playing cards */}
      {!subtle && FLOATING_CARDS.map((f, i) => <FloatingCard key={i} {...f} />)}

      {/* Rolling hills */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
        style={{ height: '32vh' }}
      >
        <path
          d="M 0 140 Q 240 60 480 120 Q 720 180 960 110 Q 1200 50 1440 130 L 1440 260 L 0 260 Z"
          fill="#a8dba8"
        />
        <path
          d="M 0 190 Q 300 120 600 175 Q 900 225 1200 165 Q 1330 142 1440 175 L 1440 260 L 0 260 Z"
          fill="#7fcf92"
        />
        {/* little trees */}
        <g style={{ transformOrigin: '200px 175px', animation: 'sway 5s ease-in-out infinite' }}>
          <rect x="197" y="160" width="6" height="20" rx="2" fill="#8a6242" />
          <circle cx="200" cy="150" r="20" fill="#5cb87a" />
        </g>
        <g style={{ transformOrigin: '1240px 160px', animation: 'sway 6s ease-in-out infinite', animationDelay: '1s' }}>
          <rect x="1237" y="145" width="6" height="20" rx="2" fill="#8a6242" />
          <circle cx="1240" cy="135" r="22" fill="#5cb87a" />
        </g>
      </svg>
    </div>
  );
}
