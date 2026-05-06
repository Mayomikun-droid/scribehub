'use client';

import { useState, useEffect } from 'react';
import { X, Lock, Rocket } from 'lucide-react';

// ─── Launch Countdown (inline) ────────────────────────────────────────────────
function CountdownInline() {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-03-16T00:00:00');
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      color: '#CCFF00',
      fontWeight: 700,
    }}>
      {t.d}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
    </span>
  );
}

// ─── Preview Banner ───────────────────────────────────────────────────────────
export function PreviewBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 900,
      background: 'linear-gradient(90deg, rgba(10,10,15,0.95), rgba(19,19,26,0.95))',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(123,47,255,0.2)',
      padding: '10px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <Rocket size={14} color="#CCFF00" />
        <span style={{
          color: 'var(--text-secondary, #8B7BA8)',
          fontSize: '13px',
        }}>
          You're in <span style={{ color: '#F5F0FF', fontWeight: 600 }}>Preview Mode</span>
          {' '}— Full launch in <CountdownInline />
        </span>
      </div>

      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', padding: '2px',
          color: 'var(--text-secondary, #8B7BA8)',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#F5F0FF')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary, #8B7BA8)')}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Launch Gate Modal ────────────────────────────────────────────────────────
// Wrap any button/CTA with this to show the gate instead of the real action
interface LaunchGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function LaunchGate({ children, featureName = 'this feature' }: LaunchGateProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} style={{ cursor: 'pointer', display: 'contents' }}>
        {children}
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,10,15,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface, #13131A)',
              border: '1px solid rgba(123,47,255,0.25)',
              borderRadius: '24px',
              padding: '40px 36px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 80px rgba(123,47,255,0.2)',
              animation: 'gateIn 0.25s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Lock icon */}
            <div style={{
              width: 64, height: 64,
              borderRadius: '50%',
              background: 'rgba(123,47,255,0.12)',
              border: '1px solid rgba(123,47,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Lock size={24} color="#A855F7" />
            </div>

            <h3 style={{
              color: 'var(--text-primary, #F5F0FF)',
              fontSize: '20px',
              fontWeight: 700,
              margin: '0 0 12px',
              lineHeight: 1.3,
            }}>
              Launching March 16
            </h3>

            <p style={{
              color: 'var(--text-secondary, #8B7BA8)',
              fontSize: '14px',
              lineHeight: 1.7,
              margin: '0 0 28px',
            }}>
              {featureName === 'this feature'
                ? "You're in the front row. Full access — every course, every game, ARIA fully unlocked — opens on launch day."
                : `${featureName} opens on launch day. You've got a front-row seat.`
              }
            </p>

            {/* Countdown */}
            <div style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '28px',
            }}>
              <CountdownBlock />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: '#CCFF00',
                  color: '#0A0A0F',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  boxShadow: '0 0 24px rgba(204,255,0,0.3)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(204,255,0,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(204,255,0,0.3)';
                }}
              >
                Got it — I'll be back March 16
              </button>

              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(123,47,255,0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-secondary, #8B7BA8)',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,47,255,0.4)';
                  (e.currentTarget as HTMLElement).style.color = '#F5F0FF';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,47,255,0.2)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary, #8B7BA8)';
                }}
              >
                Keep exploring
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gateIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── Countdown Block for modal ────────────────────────────────────────────────
function CountdownBlock() {
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date('2026-03-16T00:00:00');
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', val: t.days },
    { label: 'Hours', val: t.hours },
    { label: 'Mins', val: t.mins },
    { label: 'Secs', val: t.secs },
  ];

  return (
    <>
      {units.map(({ label, val }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(123,47,255,0.12)',
            border: '1px solid rgba(123,47,255,0.2)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: 'var(--text-primary, #F5F0FF)',
            fontSize: '22px',
            fontWeight: 800,
            fontVariantNumeric: 'tabular-nums',
            minWidth: '52px',
          }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{
            color: 'var(--text-secondary, #8B7BA8)',
            fontSize: '10px',
            marginTop: '5px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {label}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Locked Page Overlay ──────────────────────────────────────────────────────
// Use this on full pages that aren't ready (Games, Jobs, etc)
interface LockedPageProps {
  pageName: string;
  description: string;
  icon?: string;
}

export function LockedPageOverlay({ pageName, description, icon = '🔒' }: LockedPageProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(10,10,15,0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{
        background: 'var(--bg-surface, #13131A)',
        border: '1px solid rgba(123,47,255,0.2)',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(123,47,255,0.15)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>{icon}</div>

        <h2 style={{
          color: 'var(--text-primary, #F5F0FF)',
          fontSize: '22px',
          fontWeight: 700,
          margin: '0 0 12px',
        }}>
          {pageName}
        </h2>

        <p style={{
          color: 'var(--text-secondary, #8B7BA8)',
          fontSize: '14px',
          lineHeight: 1.7,
          margin: '0 0 8px',
        }}>
          {description}
        </p>

        <p style={{
          color: 'var(--text-secondary, #8B7BA8)',
          fontSize: '13px',
          marginBottom: '28px',
        }}>
          Opens <span style={{ color: '#CCFF00', fontWeight: 600 }}>March 16, 2026</span>
        </p>

        {/* Live countdown */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <CountdownBlock />
        </div>
      </div>
    </div>
  );
}