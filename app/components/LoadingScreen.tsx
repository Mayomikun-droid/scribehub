'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

// ── Animated particle/star field drawn on canvas ──
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let w = 0, h = 0;

    // Particles
    const particles: {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; hue: number; pulse: number; speed: number;
    }[] = [];

    // Floating orbs (larger, glowing)
    const orbs: {
      x: number; y: number; r: number; alpha: number;
      vx: number; vy: number; phase: number;
    }[] = [];

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles.length = 0;
      orbs.length = 0;

      // Create particles
      const count = Math.min(140, Math.floor(w * h / 8000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.3,
          alpha: Math.random() * 0.6 + 0.1,
          hue: Math.random() > 0.7 ? 270 : 265, // violet range
          pulse: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02,
        });
      }

      // Create floating orbs
      for (let i = 0; i < 5; i++) {
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 60 + Math.random() * 120,
          alpha: 0.03 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;

    function draw() {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Draw floating orbs (background glow)
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.phase += 0.008;

        if (orb.x < -orb.r) orb.x = w + orb.r;
        if (orb.x > w + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = h + orb.r;
        if (orb.y > h + orb.r) orb.y = -orb.r;

        const pulseAlpha = orb.alpha * (0.7 + 0.3 * Math.sin(orb.phase));
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grad.addColorStop(0, `rgba(123, 47, 255, ${pulseAlpha * 2})`);
        grad.addColorStop(0.4, `rgba(168, 85, 247, ${pulseAlpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(orb.x - orb.r, orb.y - orb.r, orb.r * 2, orb.r * 2);
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.speed;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const flicker = 0.5 + 0.5 * Math.sin(p.pulse);
        const a = p.alpha * flicker;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${a})`;
        ctx.fill();

        // Glow effect on brighter particles
        if (p.r > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(123, 47, 255, ${a * 0.15})`;
          ctx.fill();
        }
      });

      // Draw connections (subtle web)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(123, 47, 255, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Central glow — breathes
      const cx = w / 2, cy = h / 2;
      const breathe = 0.6 + 0.4 * Math.sin(time * 0.8);
      const centralGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300 * breathe);
      centralGrad.addColorStop(0, `rgba(123, 47, 255, ${0.06 * breathe})`);
      centralGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.03 * breathe})`);
      centralGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = centralGrad;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', init);

    // GSAP: animate the canvas opacity in
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0 }}
    />
  );
}

// ── Rotating rings around centre ──
function GlowRings() {
  const ring1 = useRef<HTMLDivElement>(null);
  const ring2 = useRef<HTMLDivElement>(null);
  const ring3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ring1.current || !ring2.current || !ring3.current) return;

    // Scale in rings
    const rings = [ring1.current, ring2.current, ring3.current];
    gsap.fromTo(rings, {
      scale: 0,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 1.8,
      ease: 'power3.out',
      stagger: 0.2,
      delay: 0.2,
    });

    // Continuous rotation
    gsap.to(ring1.current, { rotation: 360, duration: 30, ease: 'none', repeat: -1 });
    gsap.to(ring2.current, { rotation: -360, duration: 45, ease: 'none', repeat: -1 });
    gsap.to(ring3.current, { rotation: 360, duration: 60, ease: 'none', repeat: -1 });

    // Pulse
    rings.forEach((r, i) => {
      gsap.to(r, {
        scale: 1.04,
        duration: 2 + i * 0.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  }, []);

  const ringStyle = (size: number, border: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    border,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    opacity: 0,
    pointerEvents: 'none',
  });

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <div ref={ring1} style={ringStyle(320, '1px solid rgba(123, 47, 255, 0.2)')} />
      <div ref={ring2} style={ringStyle(460, '1px solid rgba(192, 132, 252, 0.12)')} />
      <div ref={ring3} style={ringStyle(600, '1px solid rgba(123, 47, 255, 0.06)')} />
    </div>
  );
}

// ── Main LoadingScreen ──
export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'intro' | 'ready' | 'exiting' | 'done'>('intro');

  const overlayRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const enterRef = useRef<HTMLSpanElement>(null);
  const centerGlowRef = useRef<HTMLDivElement>(null);

  const wordmark = 'SCRIBE HUB';

  // Phase: intro — stagger characters then show "enter" text
  useEffect(() => {
    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (chars.length === 0) return;

    const tl = gsap.timeline();

    // Centre glow burst when text starts
    if (centerGlowRef.current) {
      tl.fromTo(centerGlowRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' },
        0
      );
    }

    // Stagger characters
    tl.from(chars, {
      opacity: 0,
      y: 60,
      rotateX: -90,
      filter: 'blur(8px)',
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.05,
    }, 0.3);

    // After characters, show "Enter Scribe Hub"
    tl.to(enterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        setPhase('ready');
        if (enterRef.current) enterRef.current.style.pointerEvents = 'auto';
      },
    }, '+=0.4');
  }, []);

  // Exit — portal-like dissolution
  const handleEnter = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('exiting');

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        onComplete();
      },
    });

    const chars = charRefs.current.filter(Boolean) as HTMLSpanElement[];

    // Flash the centre glow
    if (centerGlowRef.current) {
      tl.to(centerGlowRef.current, {
        scale: 3,
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.in',
      }, 0);
    }

    // Characters blast outward
    chars.forEach((c) => {
      const dx = (Math.random() - 0.5) * 600;
      const dy = (Math.random() - 0.5) * 400;
      tl.to(c, {
        x: dx,
        y: dy,
        opacity: 0,
        scale: 0,
        filter: 'blur(12px)',
        duration: 0.6,
        ease: 'power3.in',
      }, 0);
    });

    // Fade enter text
    tl.to(enterRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in',
    }, 0);

    // Fade entire overlay
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0.4);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-base)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        overflow: 'hidden',
      }}
    >
      {/* Animated particle background */}
      <AnimatedBackground />

      {/* Rotating glow rings */}
      <GlowRings />

      {/* Centre glow burst behind text */}
      <div
        ref={centerGlowRef}
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.25) 0%, rgba(168,85,247,0.08) 40%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0,
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'blur(40px)',
        }}
      />

      {/* Wordmark */}
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(42px, 7vw, 80px)',
          color: 'var(--brand-violet)',
          letterSpacing: '0.08em',
          lineHeight: 1,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          perspective: '600px',
        }}
      >
        {wordmark.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { charRefs.current[i] = el; }}
            style={{
              display: 'inline-block',
              opacity: 0,
              willChange: 'transform, opacity, filter',
              textShadow: '0 0 40px rgba(123,47,255,0.5), 0 0 80px rgba(123,47,255,0.2)',
              ...(char === ' ' ? { width: '0.35em' } : {}),
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Enter text — standalone, no button styling */}
      <span
        ref={enterRef}
        onClick={handleEnter}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            color: '#C084FC',
            textShadow: '0 0 20px rgba(192,132,252,0.4)',
            letterSpacing: '0.16em',
            duration: 0.3,
            ease: 'power2.out',
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, {
            color: 'var(--text-secondary)',
            textShadow: 'none',
            letterSpacing: '0.12em',
            duration: 0.3,
            ease: 'power2.out',
          });
        }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          fontSize: 'clamp(13px, 1.4vw, 16px)',
          color: 'var(--text-secondary)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          opacity: 0,
          transform: 'translateY(16px)',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 2,
          transition: 'none',
          userSelect: 'none',
        }}
      >
        Enter Scribe Hub
      </span>
    </div>
  );
}
