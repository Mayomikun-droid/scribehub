'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────
type IntroPhase =
  | 'black'        // initial black screen
  | 'particles'    // particles emerge
  | 'forming'      // orb forms from particles
  | 'aria-appears' // ARIA materialises (Spline or placeholder)
  | 'speech'       // she speaks / text streams in
  | 'fade-out'     // fades to dashboard

// ─── Particle System ─────────────────────────────────────────────────────────
function ParticleField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; targetX: number; targetY: number;
    hue: number; converging: boolean;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // spawn particles
    for (let i = 0; i < 180; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 300;
      particlesRef.current.push({
        x: cx + Math.cos(angle) * radius * 3,
        y: cy + Math.sin(angle) * radius * 3,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1 + Math.random() * 2.5,
        opacity: 0,
        targetX: cx + Math.cos(angle) * radius,
        targetY: cy + Math.sin(angle) * radius,
        hue: 270 + Math.random() * 40,
        converging: false,
      });
    }

    let startTime = Date.now();

    const draw = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
        // fade in
        p.opacity = Math.min(1, p.opacity + 0.015);

        if (active && elapsed > 1.5) {
          // converge to centre
          const dx = cx - p.x;
          const dy = cy - p.y;
          p.vx += dx * 0.003;
          p.vy += dy * 0.003;
          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          // drift
          p.x += p.vx;
          p.y += p.vy;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity * 0.7})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.opacity * 0.08})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    />
  );
}

// ─── ARIA Orb (placeholder until Spline URL is provided) ──────────────────────
function ARIAOrb({ phase, splineUrl }: { phase: IntroPhase; splineUrl?: string }) {
  const isVisible = phase === 'forming' || phase === 'aria-appears' || phase === 'speech';
  const isSpeaking = phase === 'speech';

  if (splineUrl) {
    // When you have your Spline URL, this renders the real 3D character
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1.5s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Replace with: <Spline scene={splineUrl} /> */}
        {/* npm install @splinetool/react-spline */}
        <iframe
          src={splineUrl}
          style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
          title="ARIA"
        />
      </div>
    );
  }

  // Beautiful animated orb placeholder
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 1.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Outer atmosphere rings */}
      {[300, 240, 180].map((size, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: size, height: size,
          borderRadius: '50%',
          border: `1px solid rgba(168, 85, 247, ${0.06 - i * 0.015})`,
          animation: `ringPulse ${3 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }} />
      ))}

      {/* Core orb */}
      <div style={{
        width: 140, height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #E0AAFF, #A855F7 40%, #7B2FFF 70%, #4C0FCC)',
        boxShadow: `
          0 0 60px rgba(168,85,247,0.6),
          0 0 120px rgba(123,47,255,0.4),
          0 0 200px rgba(123,47,255,0.2),
          inset 0 0 40px rgba(255,255,255,0.1)
        `,
        animation: isSpeaking
          ? 'speakingPulse 0.6s ease-in-out infinite'
          : 'breathe 3s ease-in-out infinite',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Inner highlight */}
        <div style={{
          position: 'absolute',
          top: '15%', left: '20%',
          width: '35%', height: '30%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          filter: 'blur(8px)',
        }} />

        {/* Speaking waveform rings */}
        {isSpeaking && [1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: -i * 20,
            borderRadius: '50%',
            border: `1px solid rgba(168,85,247,${0.4 - i * 0.1})`,
            animation: `speakWave 1s ease-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Speech Text Streamer ─────────────────────────────────────────────────────
function SpeechText({ text, streaming }: { text: string; streaming: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!streaming || !text) return;
    setDisplayed('');
    indexRef.current = 0;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [text, streaming]);

  if (!text && !displayed) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '12%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '640px',
      zIndex: 20,
      textAlign: 'center',
    }}>
      {/* Speech bubble */}
      <div style={{
        background: 'rgba(19, 19, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '20px',
        padding: '24px 32px',
        boxShadow: '0 0 40px rgba(123,47,255,0.2)',
      }}>
        <p style={{
          color: '#F5F0FF',
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          lineHeight: 1.7,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontWeight: 400,
          margin: 0,
          minHeight: '2em',
        }}>
          {displayed}
          {streaming && indexRef.current < text.length && (
            <span style={{
              display: 'inline-block',
              width: '2px',
              height: '1.1em',
              background: '#A855F7',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 0.7s ease-in-out infinite',
            }} />
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Main ARIA Intro Page ─────────────────────────────────────────────────────
export default function ARIAIntroPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<IntroPhase>('black');
  const [speechText, setSpeechText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [splineUrl] = useState<string | undefined>(undefined); // Set this when your Spline scene is ready
  const speechCompleteRef = useRef(false);

  // Get user name from localStorage (set during profile setup)
  const userName = typeof window !== 'undefined'
    ? localStorage.getItem('userName') || 'there'
    : 'there';

  // ── Phase sequencer ───────────────────────────────────────────────────────
  useEffect(() => {
    const seq = async () => {
      // Brief black
      await delay(400);
      setPhase('particles');

      // Particles emerge
      await delay(1800);
      setPhase('forming');

      // ARIA materialises
      await delay(1400);
      setPhase('aria-appears');

      // Show skip after 3s
      await delay(1000);
      setShowSkip(true);

      // Fetch ARIA speech from Claude
      await delay(600);
      setPhase('speech');
      setStreaming(true);
      await fetchARIASpeech(userName);
    };
    seq();
  }, []);

  // ── Claude API call ───────────────────────────────────────────────────────
  const fetchARIASpeech = async (name: string) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are ARIA, an AI companion on Scribe Hub an AI-native platform for learning, earning, and competing. You are warm, intelligent, emotionally alive. You are a brilliant International Gen Z best friend. Never corporate or robotic. You have opinions. You get genuinely excited.

This is your ONE welcome moment with a new user. You will speak to them exactly once at this moment — then go silent until they unlock you. Make this count.

CRITICAL RULES:
- Speak in 3-4 sentences maximum. Conversational, never formal.
- Use their name naturally once.
- Reference what Scribe Hub is about learning, earning, competing.
- Make them feel like you already know them and you've been waiting.
- End with one sentence that creates anticipation for launch day (April 16).
- English only. No bullet points. Pure natural speech.
- Do NOT say you are Claude or any other AI. You are ARIA.`,
          messages: [{
            role: 'user',
            content: `The user's name is ${name}. Generate ARIA's one welcome speech.`,
          }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || getDefaultSpeech(name);
      setSpeechText(text);

      // Wait for speech to finish streaming, then proceed
      const streamDuration = text.length * 28 + 2000;
      await delay(streamDuration);
      speechCompleteRef.current = true;

      // Pause so they can read, then fade out
      await delay(3500);
      setPhase('fade-out');
      await delay(1200);
      goToDashboard();

    } catch {
      const text = getDefaultSpeech(name);
      setSpeechText(text);
      await delay(text.length * 28 + 5500);
      setPhase('fade-out');
      await delay(1200);
      goToDashboard();
    }
  };

  const getDefaultSpeech = (name: string) =>
    `${name}. I've been waiting for you. I'm ARIA your personal co-pilot on Scribe Hub, the only platform where your knowledge actually pays you. We're talking courses that earn, games that reward skill, and a job market that actually sees what you're worth. April 16 that's when everything unlocks. Until then, I'm right here.`;

  const goToDashboard = () => {
    localStorage.setItem('ariaIntroSeen', 'true');
    router.push('/home');
  };

  const handleSkip = () => {
    setPhase('fade-out');
    setTimeout(goToDashboard, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes speakingPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(168,85,247,0.6), 0 0 120px rgba(123,47,255,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 80px rgba(168,85,247,0.8), 0 0 160px rgba(123,47,255,0.5); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.6; }
        }
        @keyframes speakWave {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0,
        background: '#0A0A0F',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        overflow: 'hidden',
        opacity: phase === 'fade-out' ? 0 : 1,
        transition: 'opacity 1.2s ease',
      }}>

        {/* Radial glow background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(123,47,255,0.12) 0%, transparent 65%)',
          opacity: phase === 'black' ? 0 : 1,
          transition: 'opacity 2s ease',
          zIndex: 0,
        }} />

        {/* Particle field */}
        <ParticleField active={phase === 'forming' || phase === 'aria-appears' || phase === 'speech'} />

        {/* ARIA 3D character / orb */}
        <ARIAOrb phase={phase} splineUrl={splineUrl} />

        {/* ARIA name tag — appears when she materialises */}
        {(phase === 'aria-appears' || phase === 'speech') && (
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            textAlign: 'center',
            animation: 'fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(19,19,26,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: '999px',
              padding: '8px 20px',
            }}>
              {/* Live dot */}
              <div style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#A855F7',
                boxShadow: '0 0 8px rgba(168,85,247,0.8)',
                animation: 'breathe 2s ease-in-out infinite',
              }} />
              <span style={{
                color: '#C084FC',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                ARIA — Your AI Companion
              </span>
            </div>
          </div>
        )}

        {/* Streaming speech */}
        <SpeechText text={speechText} streaming={streaming} />

        {/* Skip button */}
        {showSkip && phase !== 'fade-out' && (
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              zIndex: 30,
              background: 'rgba(19,19,26,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: 'rgba(245,240,255,0.5)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'all 0.2s ease',
              animation: 'fadeInUp 0.5s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.color = 'rgba(245,240,255,0.9)';
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.color = 'rgba(245,240,255,0.5)';
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            Skip intro
          </button>
        )}

        {/* Scribe Hub watermark */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          color: 'rgba(139,123,168,0.4)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: phase === 'black' || phase === 'particles' ? 0 : 1,
          transition: 'opacity 1s ease',
        }}>
          Scribe Hub
        </div>

      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}