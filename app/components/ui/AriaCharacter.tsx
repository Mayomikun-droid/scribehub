'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';

/* =========================================
   ARIA CHARACTER — Holographic AI Silhouette
   ========================================= */

interface AriaCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const SIZES = {
  sm: { w: 160, h: 240 },
  md: { w: 280, h: 380 },
  lg: { w: 400, h: 520 },
} as const;

const DATA_FRAGMENTS = [
  'skill_match: 98%',
  'earnings: ₦24,500',
  'level: advanced',
  'focus: active',
  'streak: 12 days',
  'rank: #47',
  'courses: 8/15',
  'accuracy: 94.2%',
  'games_won: 23',
  'reputation: elite',
];

/* Silhouette SVG path — abstract geometric humanoid head+shoulders */
const SILHOUETTE_PATH = `
  M 50 8
  L 58 6
  L 65 10
  L 70 18
  L 72 28
  L 73 38
  L 72 46
  L 74 50
  L 78 54
  L 84 58
  L 92 62
  L 98 66
  L 100 72
  L 100 100
  L 0 100
  L 0 72
  L 2 66
  L 8 62
  L 16 58
  L 22 54
  L 26 50
  L 28 46
  L 27 38
  L 28 28
  L 30 18
  L 35 10
  L 42 6
  Z
`;

export function AriaCharacter({ size = 'md', interactive = false }: AriaCharacterProps) {
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const fragmentsRef = useRef<HTMLDivElement>(null);
  const geoRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  const { w, h } = SIZES[size];
  const silH = h * 0.65;

  /* Mount guard — prevents SSR/client hydration mismatch */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---- GSAP ANIMATIONS ---- */
  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const figure = figureRef.current;
      const geo = geoRef.current;
      const waveform = waveformRef.current;
      const scan = scanRef.current;
      const dataEl = dataRef.current;
      if (!container || !figure || !geo || !waveform || !scan || !dataEl) return;

      /* -- 1. Assembly entrance -- */
      const pieces = figure.querySelectorAll('.aria-fragment');
      gsap.set(pieces, { opacity: 0 });
      gsap.from(pieces, {
        x: () => gsap.utils.random(-80, 80),
        y: () => gsap.utils.random(-80, 80),
        rotation: () => gsap.utils.random(-45, 45),
        scale: 0,
        opacity: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: 'back.out(1.4)',
        onStart: () => { gsap.set(pieces, { opacity: 1 }); },
      });

      /* -- 2. Continuous breathing -- */
      gsap.to(figure, {
        scale: 1.03,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      /* -- 3. Scanlines scroll -- */
      gsap.to(scan, {
        backgroundPositionY: '-200px',
        duration: 4,
        ease: 'none',
        repeat: -1,
      });

      /* -- 4. Geometric orbit -- */
      const geos = geo.querySelectorAll('.aria-geo');
      geos.forEach((el, i) => {
        gsap.to(el, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: 8 + i * 2,
          ease: 'none',
          repeat: -1,
          transformOrigin: `${-30 - i * 12}px ${-20 - i * 10}px`,
        });
        gsap.to(el, {
          opacity: gsap.utils.random(0.3, 0.8),
          duration: 2 + i * 0.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      });

      /* -- 5. Waveform bars pulse -- */
      const bars = waveform.querySelectorAll('.aria-bar');
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: gsap.utils.random(0.3, 1.8),
          duration: 0.6 + i * 0.08,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: i * 0.04,
        });
      });

      /* -- 6. Data fragments cycle -- */
      const dataItems = dataEl.querySelectorAll('.aria-data');
      const cycleData = () => {
        dataItems.forEach((item) => {
          const delay = gsap.utils.random(0, 4);
          const dur = gsap.utils.random(2, 3.5);
          gsap.fromTo(item,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(item, {
                  opacity: 0,
                  y: -8,
                  duration: 0.5,
                  delay: dur,
                  ease: 'power2.in',
                });
              },
            }
          );
        });
      };
      cycleData();
      const dataInterval = setInterval(cycleData, 7000);

      /* -- 7. Glow outline pulse -- */
      const outline = figure.querySelector('.aria-outline');
      if (outline) {
        gsap.to(outline, {
          boxShadow: '0 0 40px rgba(123,47,255,0.6), 0 0 80px rgba(123,47,255,0.3), inset 0 0 20px rgba(123,47,255,0.15)',
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      return () => {
        clearInterval(dataInterval);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [mounted, size]);

  /* ---- MOUSE TRACKING ---- */
  const handleMouseEnter = useCallback(() => {
    if (!interactive || !figureRef.current) return;
    gsap.to(figureRef.current, {
      filter: 'brightness(1.3)',
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [interactive]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!interactive || !figureRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    gsap.to(figureRef.current, {
      rotateY: dx * 8,
      rotateX: -dy * 5,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive || !figureRef.current) return;
    gsap.to(figureRef.current, {
      rotateY: 0,
      rotateX: 0,
      filter: 'brightness(1)',
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [interactive]);

  /* ---- RENDER ---- */
  const geoCount = size === 'sm' ? 5 : size === 'lg' ? 10 : 7;
  const barCount = size === 'sm' ? 20 : size === 'lg' ? 40 : 30;
  const dataCount = size === 'sm' ? 3 : size === 'lg' ? 6 : 4;

  /* Don't render on server — only render after client mount */
  if (!mounted) {
    return (
      <div style={{ width: w, height: h }} />
    );
  }

  const eyeSize = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;

  return (
    <div
      ref={containerRef}
      className="relative select-none"
      style={{ width: w, height: h, perspective: '600px' }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main figure wrapper */}
      <div
        ref={figureRef}
        className="absolute inset-0 flex flex-col items-center justify-start"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Silhouette with scanlines */}
        <div
          className="aria-fragment relative overflow-hidden"
          style={{ width: w * 0.7, height: silH, margin: '0 auto' }}
        >
          {/* SVG clip mask */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id={`aria-clip-${size}`} clipPathUnits="objectBoundingBox">
                <path d={SILHOUETTE_PATH.replace(/(\d+)/g, (_, n) => (parseInt(n) / 100).toFixed(3))} />
              </clipPath>
            </defs>
          </svg>

          {/* Silhouette body */}
          <div
            className="absolute inset-0 aria-outline"
            style={{
              clipPath: `url(#aria-clip-${size})`,
              background: 'rgba(123,47,255,0.08)',
              boxShadow: '0 0 30px rgba(123,47,255,0.4), 0 0 60px rgba(123,47,255,0.2), inset 0 0 15px rgba(123,47,255,0.1)',
            }}
          >
            {/* Scanline overlay */}
            <div
              ref={scanRef}
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(123,47,255,0.12) 2px,
                  rgba(123,47,255,0.12) 3px
                )`,
                backgroundSize: '100% 5px',
              }}
            />
            {/* Inner glow gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 30%, rgba(192,132,252,0.15) 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* Outline glow border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `url(#aria-clip-${size})`,
              border: '1.5px solid rgba(123,47,255,0.6)',
              boxShadow: '0 0 20px rgba(123,47,255,0.5), 0 0 50px rgba(123,47,255,0.25)',
            }}
          />

          {/* Eyes */}
          <div className="absolute aria-fragment" style={{ top: '22%', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="flex gap-3 items-center">
              <div style={{
                width: eyeSize, height: eyeSize,
                background: '#C084FC', transform: 'rotate(45deg)',
                boxShadow: '0 0 12px rgba(192,132,252,0.8), 0 0 24px rgba(192,132,252,0.4)',
              }} />
              <div style={{
                width: eyeSize, height: eyeSize,
                background: '#C084FC', transform: 'rotate(45deg)',
                boxShadow: '0 0 12px rgba(192,132,252,0.8), 0 0 24px rgba(192,132,252,0.4)',
              }} />
            </div>
          </div>

          {/* Visor line */}
          <div
            className="absolute aria-fragment"
            style={{
              top: '25%', left: '20%', right: '20%', height: 1.5,
              background: 'linear-gradient(90deg, transparent, #7B2FFF, #C084FC, #7B2FFF, transparent)',
              boxShadow: '0 0 8px rgba(123,47,255,0.6)',
            }}
          />
        </div>

        {/* Geometric fragments orbiting */}
        <div
          ref={geoRef}
          className="absolute"
          style={{ top: silH * 0.3, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0 }}
        >
          {Array.from({ length: geoCount }).map((_, i) => {
            const isHex = i % 3 === 0;
            const sz = (size === 'sm' ? 8 : size === 'lg' ? 16 : 12) + (i % 3) * 4;
            const angle = (i * 137.5) * (Math.PI / 180);
            const radius = 50 + i * 14;
            return (
              <div
                key={i}
                className="aria-geo absolute aria-fragment"
                style={{
                  width: sz,
                  height: sz,
                  left: Math.cos(angle) * radius,
                  top: Math.sin(angle) * radius,
                  opacity: 0.5,
                }}
              >
                {isHex ? (
                  <svg viewBox="0 0 24 24" width={sz} height={sz}>
                    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="#C084FC" strokeWidth="1.5" opacity="0.6" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width={sz} height={sz}>
                    <polygon points="12,3 22,21 2,21" fill="none" stroke={i % 2 === 0 ? '#7B2FFF' : '#C084FC'} strokeWidth="1.5" opacity="0.6" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Waveform */}
        <div
          ref={waveformRef}
          className="absolute flex items-end justify-center gap-0.5"
          style={{
            bottom: size === 'sm' ? 36 : size === 'lg' ? 56 : 46,
            left: '50%',
            transform: 'translateX(-50%)',
            height: size === 'sm' ? 16 : size === 'lg' ? 28 : 22,
            width: w * 0.7,
          }}
        >
          {Array.from({ length: barCount }).map((_, i) => {
            const center = barCount / 2;
            const dist = Math.abs(i - center) / center;
            const maxH = (1 - dist * 0.6) * 100;
            return (
              <div
                key={i}
                className="aria-bar aria-fragment"
                style={{
                  width: size === 'sm' ? 1.5 : 2,
                  height: `${maxH}%`,
                  background: `linear-gradient(to top, #7B2FFF, #C084FC)`,
                  borderRadius: 2,
                  transformOrigin: 'bottom',
                  opacity: 0.7,
                }}
              />
            );
          })}
        </div>

        {/* Name tag */}
        <div
          className="absolute aria-fragment flex items-center gap-2"
          style={{
            bottom: size === 'sm' ? 8 : size === 'lg' ? 18 : 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1A2200',
            padding: size === 'sm' ? '3px 10px' : '5px 14px',
            borderRadius: 999,
            border: '1px solid rgba(204,255,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="rounded-full animate-pulse"
            style={{
              width: size === 'sm' ? 5 : 7,
              height: size === 'sm' ? 5 : 7,
              background: '#CCFF00',
              boxShadow: '0 0 8px rgba(204,255,0,0.6)',
            }}
          />
          <span style={{
            color: '#CCFF00',
            fontSize: size === 'sm' ? 9 : size === 'lg' ? 13 : 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            fontFamily: 'var(--font-base)',
          }}>
            ARIA
          </span>
        </div>
      </div>

      {/* Floating data fragments */}
      <div ref={dataRef} className="absolute inset-0 pointer-events-none">
        {DATA_FRAGMENTS.slice(0, dataCount).map((text, i) => {
          const positions = [
            { top: '10%', right: '-10%' },
            { top: '30%', left: '-12%' },
            { bottom: '30%', right: '-8%' },
            { top: '50%', left: '-14%' },
            { bottom: '45%', right: '-12%' },
            { top: '18%', left: '-6%' },
          ];
          const pos = positions[i % positions.length];
          return (
            <div
              key={i}
              className="aria-data absolute"
              style={{
                ...pos,
                opacity: 0,
                fontSize: size === 'sm' ? 8 : size === 'lg' ? 12 : 10,
                color: '#8B7BA8',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                textShadow: '0 0 8px rgba(192,132,252,0.4)',
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '15%', right: '15%', bottom: '20%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(123,47,255,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}