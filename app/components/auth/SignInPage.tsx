'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTextScramble } from '../../hooks/useTextScramble';
import { useMagneticButton } from '../../hooks/useMagneticButton';
import { CursorGlow } from '../../components/ui/CursorGlow';
import { Mail, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
 const router = useRouter();
  const { displayText, scramble } = useTextScramble('Welcome back.');
  const subRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { onMouseMove, onMouseLeave } = useMagneticButton(btnRef);
  const formCardRef = useRef<HTMLDivElement>(null);

  // Forgot password scramble
  const forgotScramble = useTextScramble('Forgot password?');

  useEffect(() => {
    scramble();
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (subRef.current) {
      tl.from(subRef.current, { opacity: 0, y: 20, duration: 0.6, delay: 1.2 });
    }
    if (socialRef.current) {
      tl.from(socialRef.current, { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
    }
    if (formCardRef.current) {
      gsap.from(formCardRef.current, { opacity: 0, x: 40, duration: 0.8, delay: 0.3, ease: 'power3.out' });
    }
    return () => { tl.kill(); };
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex' }}>
      <CursorGlow />

      {/* Left column */}
      <div
        className="sign-in-left"
        style={{
          flex: '0 0 60%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 48,
          background: 'linear-gradient(135deg, #0A0A0F 0%, rgba(123,47,255,0.08) 100%)',
        }}
      >
        {/* Giant watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(150px, 25vw, 400px)',
            fontWeight: 900,
            color: 'rgba(123,47,255,0.03)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          SCRIBE
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 500 }}>
          <h1
            style={{
              fontSize: 'var(--text-display)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.05,
              minHeight: '1.2em',
              fontFamily: 'monospace',
            }}
          >
            {displayText}
          </h1>
          <p
            ref={subRef}
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-body-lg)',
              marginTop: 16,
            }}
          >
            Your earnings are waiting.
          </p>
        </div>

        <div
          ref={socialRef}
          style={{
            position: 'absolute',
            bottom: 32,
            left: 48,
            color: 'var(--text-secondary)',
            fontSize: 13,
          }}
        >
          <span style={{ color: 'var(--accent-lime)', fontWeight: 700 }}>₦47M+</span> earned by our community
        </div>
      </div>

      {/* Right column */}
      <div
        className="sign-in-right"
        style={{
          flex: '0 0 40%',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        <div ref={formCardRef} style={{ width: '100%', maxWidth: 380 }}>
          <span style={{ color: 'var(--brand-violet)', fontWeight: 700, fontSize: 18, display: 'block', marginBottom: 32 }}>
            Scribe Hub
          </span>

          <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
            Sign in.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            Don't have an account?{' '}
            <Link href="/sign-up" style={{ color: 'var(--brand-light)', textDecoration: 'none', fontWeight: 600 }}>
              Join free→
            </Link>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                Email
              </label>
              <input className="input-field" type="email" placeholder="you@email.com" />
            </div>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' }}>
                Password
              </label>
              <input className="input-field" type="password" placeholder="••••••••" />
            </div>
          </div>

          <button
  ref={btnRef}
  className="btn-primary"
  onMouseMove={onMouseMove}
  onMouseLeave={onMouseLeave}
  onClick={() => router.push('/home')}
  style={{ width: '100%', marginTop: 24 }}
>
  Sign In
</button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onMouseEnter={() => forgotScramble.scramble()}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontFamily: 'monospace',
                minWidth: 130,
              }}
            >
              {forgotScramble.displayText || 'Forgot password?'}
            </button>
          </div>

          {/* OAuth placeholders */}
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ color: 'var(--text-disabled)', fontSize: 12 }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Mail size={16} /> Google
              </button>
              <button
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Twitter size={16} /> Twitter
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-disabled)', fontSize: 11, textAlign: 'center', marginTop: 24 }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1023px) {
          .sign-in-left { display: none !important; }
          .sign-in-right {
            flex: 1 !important;
            background: linear-gradient(180deg, rgba(123,47,255,0.05) 0%, var(--bg-surface) 40%) !important;
          }
        }
      `}</style>
    </div>
  );
}
