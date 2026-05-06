'use client';

import { useRouter } from 'next/navigation';

export default function AriaPage() {
  const router = useRouter();

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#06060e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: '#fff', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 50% 60%, rgba(123,47,255,0.2) 0%, transparent 70%)`,
      }} />

      {/* Lock icon */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px',
        background: 'rgba(167,139,250,0.1)',
        border: '1px solid rgba(167,139,250,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px', marginBottom: '24px',
        boxShadow: '0 0 40px rgba(123,47,255,0.2)',
      }}>
        🔒
      </div>

      <p style={{ fontSize: '11px', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.12em', marginBottom: '12px' }}>
        COMING SOON
      </p>

      <h1 style={{
        fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800,
        letterSpacing: '-0.02em', marginBottom: '14px', textAlign: 'center',
        background: 'linear-gradient(135deg, #A78BFA, #7B2FFF)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        Aria is upgrading.
      </h1>

      <p style={{
        fontSize: '15px', color: 'rgba(255,255,255,0.4)',
        maxWidth: '380px', textAlign: 'center', lineHeight: 1.7,
        marginBottom: '36px',
      }}>
        Your AI companion is getting smarter, more expressive, and more powerful. She'll be ready soon — worth the wait.
      </p>

      {/* Pill badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        {['Voice interaction', 'Webcam support', 'Emotional responses', '50+ languages', 'Platform guidance'].map(f => (
          <div key={f} style={{
            padding: '5px 14px', borderRadius: '99px', fontSize: '12px', fontWeight: 500,
            background: 'rgba(167,139,250,0.08)',
            border: '1px solid rgba(167,139,250,0.18)',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {f}
          </div>
        ))}
      </div>

      <button onClick={() => router.push('/home')} style={{
        padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
        background: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
      }}>
        ← Back to home
      </button>
    </div>
  );
}