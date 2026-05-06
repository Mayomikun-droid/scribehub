'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

/* ============================================
   TYPES
   ============================================ */
type GameStatus = 'open' | 'launching' | 'soon';
type GameCategory = 'all' | 'trivia' | 'word' | 'puzzle' | 'typing' | 'card' | 'arcade';

interface Game {
  id: number;
  name: string;
  category: Exclude<GameCategory, 'all'>;
  emoji: string;
  tagline: string;
  desc: string;
  slots: number;
  filled: number;
  entry: number;
  duration: string;
  status: GameStatus;
  accent: string;
  accent2: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

/* ============================================
   DATA
   ============================================ */
const GAMES: Game[] = [
  {
    id: 1, name: 'TRIVIA BLITZ', category: 'trivia', emoji: '🧠',
    tagline: 'Knowledge is currency.',
    desc: '20 rapid-fire questions. Top 2 highest scores claim the entire pool. No second chances.',
    slots: 20, filled: 17, entry: 1500, duration: '12 MIN', status: 'open',
    accent: '#9333EA', accent2: '#C084FC', difficulty: 'Medium',
  },
  {
    id: 2, name: 'WORD DUEL', category: 'word', emoji: '📝',
    tagline: 'Letters. Power. Domination.',
    desc: 'Build the highest-scoring words from shared letters. Outwit every mind in the room.',
    slots: 10, filled: 10, entry: 2000, duration: '8 MIN', status: 'launching',
    accent: '#059669', accent2: '#34D399', difficulty: 'Hard',
  },
  {
    id: 3, name: 'SPEED TYPER', category: 'typing', emoji: '⌨️',
    tagline: 'Your fingers. Their fate.',
    desc: 'Pure WPM warfare. The 2 fastest fingers take every naira on the table.',
    slots: 15, filled: 6, entry: 2000, duration: '5 MIN', status: 'open',
    accent: '#B45309', accent2: '#FCD34D', difficulty: 'Easy',
  },
  {
    id: 4, name: 'PUZZLE RUSH', category: 'puzzle', emoji: '🧩',
    tagline: 'Think fast or die slow.',
    desc: 'Logic grids under extreme pressure. Every second you waste, someone else gains.',
    slots: 12, filled: 12, entry: 1500, duration: '15 MIN', status: 'launching',
    accent: '#DC2626', accent2: '#F87171', difficulty: 'Extreme',
  },
  {
    id: 5, name: 'FLASH CARDS', category: 'card', emoji: '🃏',
    tagline: 'Memory is a weapon.',
    desc: 'Match cards faster than anyone. Precision, speed, ruthless focus.',
    slots: 8, filled: 3, entry: 2500, duration: '10 MIN', status: 'open',
    accent: '#1D4ED8', accent2: '#60A5FA', difficulty: 'Medium',
  },
  {
    id: 6, name: 'REACTION ARENA', category: 'arcade', emoji: '⚡',
    tagline: '0.001 seconds decides everything.',
    desc: 'Tap at the exact millisecond. Your reflex is your only weapon. No skill trees.',
    slots: 25, filled: 25, entry: 1500, duration: '6 MIN', status: 'launching',
    accent: '#7C3AED', accent2: '#E879F9', difficulty: 'Hard',
  },
  {
    id: 7, name: 'GEO MASTER', category: 'trivia', emoji: '🌍',
    tagline: 'Africa is the arena.',
    desc: 'Pin the city. Name the capital. Prove your geography is unmatched.',
    slots: 16, filled: 0, entry: 400, duration: '10 MIN', status: 'soon',
    accent: '#047857', accent2: '#6EE7B7', difficulty: 'Medium',
  },
  {
    id: 8, name: 'ANAGRAM KING', category: 'word', emoji: '🔤',
    tagline: 'Unscramble or be unscrambled.',
    desc: 'Rearrange letters faster than the room. Every second you hesitate bleeds points.',
    slots: 20, filled: 11, entry: 2500, duration: '8 MIN', status: 'open',
    accent: '#0891B2', accent2: '#67E8F9', difficulty: 'Hard',
  },
];

const CATEGORIES: { key: GameCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'ALL GAMES', icon: '⚡' },
  { key: 'trivia', label: 'TRIVIA', icon: '🧠' },
  { key: 'word', label: 'WORD', icon: '📝' },
  { key: 'puzzle', label: 'PUZZLE', icon: '🧩' },
  { key: 'typing', label: 'TYPING', icon: '⌨️' },
  { key: 'card', label: 'CARD', icon: '🃏' },
  { key: 'arcade', label: 'ARCADE', icon: '🎮' },
];

const LEADERBOARD = [
  { rank: 1, name: '@kofi_g', won: '₦342,500', games: 47, avatar: 'KG', color: '#FCD34D' },
  { rank: 2, name: '@temi_earns', won: '₦218,000', games: 31, avatar: 'TE', color: '#C084FC' },
  { rank: 3, name: '@amara_w', won: '₦189,750', games: 28, avatar: 'AW', color: '#34D399' },
  { rank: 4, name: '@lagos_ace', won: '₦142,200', games: 19, avatar: 'LA', color: '#60A5FA' },
  { rank: 5, name: '@zara_plays', won: '₦98,500', games: 15, avatar: 'ZP', color: '#F87171' },
];

const TICKER = [
  '🏆 @temi_earns just won ₦42,500 in TRIVIA BLITZ',
  '⚡ @kofi_g destroyed REACTION ARENA — 0.18s reaction',
  '🔥 WORD DUEL jackpot hits ₦85,000 — SLOTS FULL',
  '🎯 @amara_w claimed ANAGRAM KING crown',
  '💰 SPEED TYPER pool crossed ₦25,000 — 9 slots left',
  '👑 @zara_plays back-to-back wins in PUZZLE RUSH',
];

function prizePool(game: Game): string {
  return Math.floor(game.slots * game.entry * 0.85).toLocaleString('en-NG');
}
function slotPct(game: Game): number {
  return Math.round((game.filled / game.slots) * 100);
}

/* ============================================
   PARTICLE CANVAS
   ============================================ */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; o: number; vo: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.1 - Math.random() * 0.3,
        o: 0.1 + Math.random() * 0.5,
        vo: (Math.random() - 0.5) * 0.003,
      });
    }

    let raf: number;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.o += p.vo;
        if (p.o <= 0.05) p.vo = Math.abs(p.vo);
        if (p.o >= 0.6) p.vo = -Math.abs(p.vo);
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ============================================
   LIVE TICKER
   ============================================ */
function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(p => (p + 1) % TICKER.length); setFade(true); }, 350);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: 'rgba(147,51,234,0.08)',
      borderBottom: '1px solid rgba(147,51,234,0.2)',
      padding: '10px 0', overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto',
        padding: '0 clamp(16px,4vw,48px)',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg,#7C3AED,#9333EA)',
          color: '#fff', fontSize: '9px', fontWeight: 900,
          padding: '3px 10px', borderRadius: '3px',
          letterSpacing: '0.15em', flexShrink: 0,
        }}>● LIVE</div>
        <p style={{
          fontSize: '12px', fontWeight: 600,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.04em',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.3s',
        }}>
          {TICKER[idx]}
        </p>
      </div>
    </div>
  );
}

/* ============================================
   HERO — Featured game spotlight
   ============================================ */
function HeroSpotlight({ game, onEnter }: { game: Game; onEnter: () => void }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.from(heroRef.current.querySelectorAll('.hero-el'), {
      y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.2,
    });
  }, []);

  const pct = slotPct(game);

  return (
    <div ref={heroRef} style={{
      position: 'relative',
      minHeight: 'clamp(420px, 55vh, 580px)',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Background layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 100% at 70% 50%, ${game.accent}30 0%, transparent 60%),
          radial-gradient(ellipse 50% 80% at 20% 80%, rgba(123,47,255,0.15) 0%, transparent 60%),
          linear-gradient(135deg, #06060e 0%, #0d0816 50%, #06060e 100%)
        `,
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(147,51,234,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147,51,234,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Diagonal accent bar */}
      <div style={{
        position: 'absolute', right: '-80px', top: '-40px',
        width: '500px', height: '700px',
        background: `linear-gradient(135deg, ${game.accent}18, transparent)`,
        transform: 'skewX(-12deg)',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1400px', margin: '0 auto', width: '100%',
        padding: 'clamp(48px,6vw,80px) clamp(16px,4vw,48px)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '40px', alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          {/* Category + status */}
          <div className="hero-el" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em',
              color: game.accent2, border: `1px solid ${game.accent}66`,
              padding: '4px 12px', borderRadius: '2px',
              background: `${game.accent}15`,
            }}>
              ✦ FEATURED GAME
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 700, color: '#22C55E',
              display: 'flex', alignItems: 'center', gap: '5px',
              letterSpacing: '0.1em',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'hpulse 1.2s infinite' }} />
              LIVE NOW
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-el" style={{
            fontFamily: "'Bebas Neue', 'Barlow Condensed', 'Anton', sans-serif",
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 900, lineHeight: 0.9,
            letterSpacing: '0.04em',
            marginBottom: '10px',
            color: '#fff',
            textShadow: `0 0 80px ${game.accent}66`,
          }}>
            {game.name}
          </h1>

          {/* Tagline */}
          <p className="hero-el" style={{
            fontSize: 'clamp(14px,1.8vw,20px)',
            fontStyle: 'italic', fontWeight: 300,
            color: game.accent2, letterSpacing: '0.06em',
            marginBottom: '20px',
          }}>
            "{game.tagline}"
          </p>

          <p className="hero-el" style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px',
          }}>
            {game.desc}
          </p>

          {/* Slot bar */}
          <div className="hero-el" style={{ marginBottom: '32px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                SLOTS FILLING
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: game.accent2 }}>
                {game.filled}/{game.slots} — {game.slots - game.filled} LEFT
              </span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px' }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: '99px',
                background: `linear-gradient(90deg, ${game.accent}, ${game.accent2})`,
                boxShadow: `0 0 12px ${game.accent}`,
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-el" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={onEnter} style={{
              padding: '14px 36px', fontSize: '13px', fontWeight: 900,
              letterSpacing: '0.12em', borderRadius: '3px', border: 'none',
              background: `linear-gradient(135deg, ${game.accent}, ${game.accent2})`,
              color: '#fff', cursor: 'pointer',
              boxShadow: `0 0 40px ${game.accent}66, 0 4px 20px rgba(0,0,0,0.4)`,
              transition: 'all 0.2s',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              ENTER — ₦{game.entry.toLocaleString()}
            </button>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
              🏆 Prize pool: <span style={{ color: game.accent2, fontWeight: 700 }}>₦{prizePool(game)}</span>
            </div>
          </div>
        </div>

        {/* Right — big emoji + stats */}
        <div className="hero-el" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          minWidth: '200px',
        }}>
          {/* Glowing emoji display */}
          <div style={{
            width: '160px', height: '160px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${game.accent}33, ${game.accent2}22)`,
            border: `1px solid ${game.accent}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '72px',
            boxShadow: `0 0 60px ${game.accent}44, inset 0 0 40px ${game.accent}15`,
            animation: 'float-hero 3s ease-in-out infinite',
          }}>
            {game.emoji}
          </div>

          {/* Mini stats */}
          {[
            { label: 'PRIZE POOL', val: `₦${prizePool(game)}`, col: game.accent2 },
            { label: 'DURATION', val: game.duration, col: '#fff' },
            { label: 'DIFFICULTY', val: game.difficulty, col: game.difficulty === 'Extreme' ? '#F87171' : game.difficulty === 'Hard' ? '#FCD34D' : '#34D399' },
          ].map(({ label, val, col }) => (
            <div key={label} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px', padding: '10px 24px',
              width: '100%',
            }}>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '16px', fontWeight: 800, color: col, letterSpacing: '0.04em' }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, transparent, #06060e)',
        pointerEvents: 'none', zIndex: 3,
      }} />
    </div>
  );
}

/* ============================================
   GAME CARD
   ============================================ */
function GameCard({ game, featured, onEnter }: { game: Game; featured?: boolean; onEnter: (g: Game) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLive = game.status === 'launching';
  const isSoon = game.status === 'soon';
  const pct = slotPct(game);
  const barColor = pct >= 100 ? '#22C55E' : pct >= 70 ? '#F59E0B' : game.accent2;

  const diffColor =
    game.difficulty === 'Extreme' ? '#F87171' :
    game.difficulty === 'Hard' ? '#FCD34D' :
    game.difficulty === 'Medium' ? '#A78BFA' : '#34D399';

  return (
    <div
      ref={cardRef}
      onClick={() => !isSoon && onEnter(game)}
      style={{
        background: '#0d0d18',
        border: `1px solid ${isLive ? game.accent + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: isSoon ? 'default' : 'pointer',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        position: 'relative',
        display: 'flex', flexDirection: 'column',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
      onMouseEnter={e => {
        if (isSoon) return;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 60px ${game.accent}33, 0 0 0 1px ${game.accent}44`;
        (e.currentTarget as HTMLDivElement).style.borderColor = game.accent + '77';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLDivElement).style.borderColor = isLive ? game.accent + '55' : 'rgba(255,255,255,0.07)';
      }}
    >
      {/* Top color bar */}
      <div style={{
        height: '2px',
        background: isSoon
          ? 'rgba(255,255,255,0.08)'
          : `linear-gradient(90deg, ${game.accent}, ${game.accent2})`,
        boxShadow: isSoon ? 'none' : `0 0 16px ${game.accent}`,
      }} />

      {/* Card header */}
      <div style={{
        padding: '20px 20px 16px',
        background: `linear-gradient(135deg, ${game.accent}12, ${game.accent2}06)`,
        position: 'relative',
      }}>
        {/* Diagonal corner decoration */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '60px', height: '60px',
          background: `linear-gradient(225deg, ${game.accent}20, transparent)`,
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Emoji box */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '6px',
              background: `${game.accent}20`,
              border: `1px solid ${game.accent}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', flexShrink: 0,
              boxShadow: `0 0 20px ${game.accent}22`,
            }}>
              {game.emoji}
            </div>
            <div>
              <p style={{
                fontFamily: "'Bebas Neue', 'Anton', sans-serif",
                fontSize: '20px', fontWeight: 900,
                color: '#fff', letterSpacing: '0.06em',
                lineHeight: 1, marginBottom: '4px',
                textShadow: `0 0 20px ${game.accent}66`,
              }}>
                {game.name}
              </p>
              <p style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                color: game.accent2, textTransform: 'uppercase',
              }}>
                {game.category}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {isLive ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '2px', padding: '4px 10px',
            }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E', animation: 'hpulse 1s infinite' }} />
              <span style={{ fontSize: '9px', color: '#22C55E', fontWeight: 900, letterSpacing: '0.15em' }}>LIVE</span>
            </div>
          ) : isSoon ? (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '2px', padding: '4px 10px',
              fontSize: '9px', color: 'rgba(255,255,255,0.3)',
              fontWeight: 900, letterSpacing: '0.15em',
            }}>SOON</div>
          ) : (
            <div style={{
              background: `${game.accent}15`,
              border: `1px solid ${game.accent}33`,
              borderRadius: '2px', padding: '4px 10px',
              fontSize: '9px', color: game.accent2,
              fontWeight: 900, letterSpacing: '0.15em',
            }}>OPEN</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{
          fontSize: '12px', fontStyle: 'italic', color: game.accent2,
          letterSpacing: '0.04em', marginBottom: '8px', fontWeight: 500,
        }}>
          "{game.tagline}"
        </p>
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.4)',
          lineHeight: 1.6, marginBottom: '16px',
        }}>
          {game.desc}
        </p>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
          {[
            { label: 'PRIZE', value: `₦${prizePool(game)}`, accent: true },
            { label: 'ENTRY', value: `₦${game.entry.toLocaleString()}`, accent: false },
            { label: 'TIME', value: game.duration, accent: false },
            { label: 'PLAYERS', value: `${game.filled}/${game.slots}`, accent: false },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '3px', padding: '8px 10px',
            }}>
              <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', marginBottom: '3px' }}>{label}</p>
              <p style={{ fontSize: '13px', fontWeight: 800, color: accent ? game.accent2 : '#fff', letterSpacing: '0.02em' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Difficulty + slot bar */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
              color: diffColor, display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              ◆ {game.difficulty.toUpperCase()}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: barColor, letterSpacing: '0.08em' }}>
              {isSoon ? '—' : `${game.slots - game.filled} SLOTS LEFT`}
            </span>
          </div>
          <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px' }}>
            <div style={{
              width: isSoon ? '0%' : `${pct}%`,
              height: '100%', borderRadius: '99px',
              background: `linear-gradient(90deg, ${game.accent}, ${barColor})`,
              boxShadow: `0 0 6px ${barColor}`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); if (!isSoon && game.status === 'open') onEnter(game); }}
          style={{
            width: '100%', padding: '11px 0',
            fontSize: '11px', fontWeight: 900, letterSpacing: '0.16em',
            border: 'none', cursor: game.status === 'open' ? 'pointer' : 'default',
            transition: 'all 0.2s',
            borderRadius: '2px',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            ...(game.status === 'open' ? {
              background: `linear-gradient(135deg, ${game.accent}dd, ${game.accent2})`,
              color: '#fff',
              boxShadow: `0 4px 20px ${game.accent}44`,
            } : game.status === 'launching' ? {
              background: 'rgba(34,197,94,0.1)',
              color: '#22C55E',
              border: '1px solid rgba(34,197,94,0.2)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.08)',
            }),
          }}
        >
          {game.status === 'open'
            ? `ENTER — ₦${game.entry.toLocaleString()}`
            : game.status === 'launching'
            ? '⚡ LAUNCHING NOW'
            : 'COMING SOON'}
        </button>

        <p style={{
          textAlign: 'center', fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          marginTop: '8px', letterSpacing: '0.08em',
        }}>
          🏆 TOP 2 SPLIT THE POOL
        </p>
      </div>
    </div>
  );
}

/* ============================================
   LEADERBOARD PANEL
   ============================================ */
function LeaderboardPanel() {
  return (
    <div style={{
      background: '#0d0d18',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '4px', overflow: 'hidden',
      clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(124,58,237,0.08))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: '2px' }}>THIS WEEK</p>
          <p style={{ fontFamily: "'Bebas Neue','Anton',sans-serif", fontSize: '18px', color: '#fff', letterSpacing: '0.1em' }}>LEADERBOARD</p>
        </div>
        <span style={{ fontSize: '20px' }}>👑</span>
      </div>

      {/* Rows */}
      <div>
        {LEADERBOARD.map(({ rank, name, won, games, avatar, color }) => (
          <div key={rank} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: rank === 1 ? 'rgba(252,211,77,0.04)' : 'transparent',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = rank === 1 ? 'rgba(252,211,77,0.04)' : 'transparent'}
          >
            <span style={{
              fontSize: rank === 1 ? '16px' : '11px',
              fontWeight: 900, color: rank === 1 ? '#FCD34D' : 'rgba(255,255,255,0.2)',
              width: '20px', textAlign: 'center',
              fontFamily: "'Bebas Neue','Anton',sans-serif",
            }}>
              {rank === 1 ? '👑' : rank}
            </span>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: `${color}25`, border: `1px solid ${color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 800, color,
            }}>
              {avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{name}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{games} games played</p>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 800, color, letterSpacing: '0.02em' }}>{won}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================
   ENTRY MODAL
   ============================================ */
function EntryModal({ game, onClose, onConfirm }: { game: Game; onClose: () => void; onConfirm: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !boxRef.current) return;
    gsap.from(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.from(boxRef.current, { y: 40, opacity: 0, duration: 0.35, ease: 'power3.out' });
  }, []);

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div ref={boxRef} style={{
        background: '#0d0d18',
        border: `1px solid ${game.accent}55`,
        borderRadius: '4px', padding: '36px',
        width: '100%', maxWidth: '440px',
        boxShadow: `0 60px 100px rgba(0,0,0,0.7), 0 0 80px ${game.accent}20`,
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        position: 'relative',
      }}>
        {/* Corner accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '80px', height: '80px',
          background: `linear-gradient(225deg, ${game.accent}22, transparent)`,
        }} />

        {/* Top bar */}
        <div style={{
          height: '2px', position: 'absolute', top: 0, left: 0, right: 0,
          background: `linear-gradient(90deg, ${game.accent}, ${game.accent2})`,
          boxShadow: `0 0 20px ${game.accent}`,
        }} />

        {/* Game ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '8px', flexShrink: 0,
            background: `${game.accent}20`, border: `1px solid ${game.accent}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            boxShadow: `0 0 30px ${game.accent}33`,
          }}>
            {game.emoji}
          </div>
          <div>
            <p style={{
              fontFamily: "'Bebas Neue','Anton',sans-serif",
              fontSize: '24px', color: '#fff', letterSpacing: '0.08em',
            }}>{game.name}</p>
            <p style={{ fontSize: '11px', color: game.accent2, fontWeight: 700, letterSpacing: '0.1em' }}>
              {game.category.toUpperCase()} · {game.difficulty.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Prize pool */}
        <div style={{
          background: `linear-gradient(135deg, ${game.accent}15, rgba(255,255,255,0.02))`,
          border: `1px solid ${game.accent}33`,
          borderRadius: '4px', padding: '20px',
          textAlign: 'center', marginBottom: '20px',
        }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>TOTAL PRIZE POOL</p>
          <p style={{ fontFamily: "'Bebas Neue','Anton',sans-serif", fontSize: '44px', color: game.accent2, lineHeight: 1, letterSpacing: '0.04em' }}>
            ₦{prizePool(game)}
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', letterSpacing: '0.06em' }}>
            SPLIT BETWEEN TOP 2 PLAYERS ONLY
          </p>
        </div>

        {/* Rules */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '4px', padding: '14px 16px', marginBottom: '20px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>How it works: </span>
            {game.slots - game.filled} more players needed. Once all {game.slots} slots fill, the game auto-launches simultaneously for everyone. {game.duration} timer starts for all. Top 2 scores split the pool.
          </p>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { label: 'YOU PAY', val: `₦${game.entry.toLocaleString()}` },
            { label: 'DURATION', val: game.duration },
            { label: 'SLOTS LEFT', val: `${game.slots - game.filled}` },
          ].map(({ label, val }) => (
            <div key={label} style={{
              flex: 1, textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '3px', padding: '10px 8px',
            }}>
              <p style={{ fontSize: '8px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px 0', borderRadius: '3px', fontSize: '12px', fontWeight: 700,
            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
            letterSpacing: '0.1em',
          }}>
            CANCEL
          </button>
          <button onClick={onConfirm} style={{
            flex: 2, padding: '13px 0', borderRadius: '3px', fontSize: '12px', fontWeight: 900,
            background: `linear-gradient(135deg, ${game.accent}, ${game.accent2})`,
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: `0 4px 24px ${game.accent}55`,
            letterSpacing: '0.1em',
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
          }}>
            CONFIRM — ₦{game.entry.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   TOAST
   ============================================ */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '32px', left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '80px'})`,
      background: '#0d0d18', border: '1px solid rgba(147,51,234,0.4)',
      color: '#fff', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
      padding: '14px 28px', borderRadius: '3px',
      transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      zIndex: 300,
      boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(147,51,234,0.2)',
      whiteSpace: 'nowrap',
      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
    }}>
      {message}
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */
export default function GamesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<GameCategory>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const featuredGame = GAMES.find(g => g.status === 'open') || GAMES[0];

  const filtered = activeFilter === 'all'
    ? GAMES
    : GAMES.filter(g => g.category === activeFilter);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.card-item');
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
    );
  }, [activeFilter]);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: msg }), 3200);
  };

  const handleConfirm = () => {
    if (!selectedGame) return;
    const msg = `⚡ LOCKED IN — Waiting for ${Math.max(0, selectedGame.slots - selectedGame.filled - 1)} more players`;
    setSelectedGame(null);
    showToast(msg);
  };

  const liveCount = GAMES.filter(g => g.status === 'launching').length;
  const totalPool = GAMES.reduce((a, g) => a + g.slots * g.entry * 0.85, 0);

  return (
    <div style={{
      background: '#06060e', minHeight: '100vh',
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      color: '#fff',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Global styles */}
      <style>{`
        @keyframes hpulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.8); }
        }
        @keyframes float-hero {
          0%,100% { transform:translateY(0px) rotate(0deg); }
          33% { transform:translateY(-12px) rotate(2deg); }
          66% { transform:translateY(-6px) rotate(-1deg); }
        }
        @keyframes scan {
          0% { transform:translateY(-100%); }
          100% { transform:translateY(100vh); }
        }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#06060e; }
        ::-webkit-scrollbar-thumb { background:rgba(147,51,234,0.4); border-radius:2px; }
      `}</style>

      {/* Scan line */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{
          position:'absolute', left:0, right:0, height:'1px',
          background:'linear-gradient(90deg,transparent,rgba(147,51,234,0.08),transparent)',
          animation:'scan 12s linear infinite',
        }} />
      </div>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Nav */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(6,6,14,0.95)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
        padding:'0 clamp(16px,4vw,48px)', height:'60px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button onClick={() => router.push('/home')} style={{
          fontFamily:"'Bebas Neue',sans-serif",
          fontSize:'22px', letterSpacing:'0.08em',
          color:'#9333EA', background:'none', border:'none', cursor:'pointer',
        }}>
          SCRIBE HUB
        </button>

        {/* Center stats */}
        <div style={{ display:'flex', alignItems:'center', gap:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 8px #22C55E', animation:'hpulse 1.2s infinite' }} />
            <span style={{ fontSize:'11px', fontWeight:700, color:'#22C55E', letterSpacing:'0.1em' }}>{liveCount} LIVE</span>
          </div>
          <div style={{ width:'1px', height:'16px', background:'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em' }}>
            POOL: <strong style={{ color:'#C084FC' }}>₦{Math.floor(totalPool).toLocaleString()}</strong>
          </span>
        </div>

        <div style={{
          fontSize:'12px', fontWeight:700,
          background:'rgba(147,51,234,0.1)',
          border:'1px solid rgba(147,51,234,0.25)',
          padding:'6px 16px', borderRadius:'3px',
          color:'#C084FC', letterSpacing:'0.08em',
        }}>
          BAL: <span style={{ color:'#fff' }}>₦4,200</span>
        </div>
      </nav>

      {/* HERO */}
      <HeroSpotlight
        game={featuredGame}
        onEnter={() => setSelectedGame(featuredGame)}
      />

      {/* MAIN CONTENT */}
      <div style={{
        maxWidth:'1400px', margin:'0 auto',
        padding:'48px clamp(16px,4vw,48px) 80px',
        display:'grid',
        gridTemplateColumns:'1fr 280px',
        gap:'32px',
      }}>

        {/* LEFT — games */}
        <div>
          {/* Section header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <p style={{ fontSize:'9px', letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', marginBottom:'4px' }}>CHOOSE YOUR BATTLEFIELD</p>
              <h2 style={{
                fontFamily:"'Bebas Neue','Anton',sans-serif",
                fontSize:'clamp(28px,4vw,40px)', color:'#fff',
                letterSpacing:'0.06em', lineHeight:1,
              }}>
                ALL GAMES <span style={{ color:'#9333EA' }}>({GAMES.length})</span>
              </h2>
            </div>
          </div>

          {/* Filter bar */}
          <div ref={filterRef} style={{
            display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'28px',
          }}>
            {CATEGORIES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  padding:'7px 14px', borderRadius:'2px',
                  fontSize:'10px', fontWeight:900, letterSpacing:'0.12em',
                  cursor:'pointer', transition:'all 0.15s',
                  display:'flex', alignItems:'center', gap:'6px',
                  ...(activeFilter === key ? {
                    background:'linear-gradient(135deg,#7C3AED,#9333EA)',
                    color:'#fff', border:'none',
                    boxShadow:'0 0 20px rgba(147,51,234,0.4)',
                    clipPath:'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
                  } : {
                    background:'rgba(255,255,255,0.04)',
                    color:'rgba(255,255,255,0.4)',
                    border:'1px solid rgba(255,255,255,0.08)',
                  }),
                }}
              >
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div
            ref={gridRef}
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(290px,1fr))',
              gap:'14px',
            }}
          >
            {filtered.map(game => (
              <div key={game.id} className="card-item">
                <GameCard
                  game={game}
                  featured={game.id === featuredGame.id}
                  onEnter={setSelectedGame}
                />
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{
            marginTop:'48px',
            background:'#0d0d18',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:'4px', padding:'32px',
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
            gap:'24px',
            clipPath:'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
          }}>
            {[
              { n:'01', icon:'🎯', title:'PICK YOUR GAME', desc:'Choose from trivia, word, typing, puzzle, card, or arcade battles.' },
              { n:'02', icon:'💸', title:'PAY TO ENTER', desc:'Entry fee builds the prize pool. 85% returned to the top 2.' },
              { n:'03', icon:'⏳', title:'WAIT FOR FULL SLOTS', desc:'Game launches the second all slots fill. Simultaneous for everyone.' },
              { n:'04', icon:'🏆', title:'ONLY 2 WIN', desc:'Top 2 performers split everything. No consolation. No mercy.' },
            ].map(({ n, icon, title, desc }) => (
              <div key={n} style={{ position:'relative' }}>
                <p style={{
                  fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:'48px', color:'rgba(147,51,234,0.12)',
                  lineHeight:1, position:'absolute', top:'-8px', right:0,
                  letterSpacing:'0.04em',
                }}>{n}</p>
                <div style={{ fontSize:'24px', marginBottom:'10px' }}>{icon}</div>
                <p style={{
                  fontFamily:"'Bebas Neue','Anton',sans-serif",
                  fontSize:'14px', fontWeight:900, color:'#fff',
                  letterSpacing:'0.12em', marginBottom:'6px',
                }}>{title}</p>
                <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — leaderboard + live games */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <LeaderboardPanel />

          {/* Live games summary */}
          <div style={{
            background:'#0d0d18',
            border:'1px solid rgba(34,197,94,0.2)',
            borderRadius:'4px', overflow:'hidden',
            clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)',
          }}>
            <div style={{
              padding:'14px 20px',
              background:'rgba(34,197,94,0.06)',
              borderBottom:'1px solid rgba(34,197,94,0.12)',
              display:'flex', alignItems:'center', gap:'8px',
            }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22C55E', animation:'hpulse 1s infinite' }} />
              <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'14px', color:'#22C55E', letterSpacing:'0.12em' }}>
                GAMES LAUNCHING NOW
              </p>
            </div>
            {GAMES.filter(g => g.status === 'launching').map(g => (
              <div key={g.id} style={{
                padding:'12px 20px',
                borderBottom:'1px solid rgba(255,255,255,0.04)',
                display:'flex', alignItems:'center', gap:'10px',
              }}>
                <span style={{ fontSize:'18px' }}>{g.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'#fff', letterSpacing:'0.06em' }}>{g.name}</p>
                  <p style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>₦{prizePool(g)} pool</p>
                </div>
                <div style={{ fontSize:'10px', color:'#22C55E', fontWeight:700 }}>LIVE</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{
            background:'#0d0d18',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:'4px', padding:'20px',
            clipPath:'polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))',
          }}>
            <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'14px', letterSpacing:'0.12em', color:'rgba(255,255,255,0.4)', marginBottom:'16px' }}>
              PLATFORM STATS
            </p>
            {[
              { label:'Total paid out', val:'₦12.4M', col:'#C084FC' },
              { label:'Games played', val:'8,421', col:'#60A5FA' },
              { label:'Active players', val:'2,847', col:'#34D399' },
              { label:'Avg session win', val:'₦38,200', col:'#FCD34D' },
            ].map(({ label, val, col }) => (
              <div key={label} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                marginBottom:'10px',
              }}>
                <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>{label}</span>
                <span style={{ fontSize:'13px', fontWeight:800, color:col }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedGame && (
        <EntryModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}