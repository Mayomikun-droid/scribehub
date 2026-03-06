'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Tag } from '../../components/ui/Tag';
import {
  BookOpen, Gamepad2, Sparkles, Copy, Check,
  Lock, Share2, ArrowLeft,
} from 'lucide-react';

const TEASER_CARDS = [
  {
    icon: BookOpen,
    tag: 'COURSE',
    title: 'Forex Trading Fundamentals',
    desc: 'Master currency pairs, technical analysis, and risk management.',
    earn: '₦4,500',
  },
  {
    icon: Gamepad2,
    tag: 'GAME',
    title: 'Speed Round Challenge',
    desc: 'Test your knowledge against players across Africa in real-time.',
    earn: '₦25,000 prize pool',
  },
  {
    icon: Sparkles,
    tag: 'AI CO-PILOT',
    title: 'Meet ARIA',
    desc: 'Your personalised AI guide that knows your goals and tracks progress.',
    earn: 'Always-on',
  },
];

function ReferralProgress({ position }: { position: number }) {
  const barRef = useRef<HTMLDivElement>(null);
  const percentage = Math.max(5, Math.min(95, ((2000 - position) / 2000) * 100));

  useEffect(() => {
    if (!barRef.current) return;
    gsap.from(barRef.current, { width: '0%', duration: 1.5, ease: 'power2.out', delay: 0.5 });
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Your position</span>
        <span style={{ color: 'var(--brand-light)', fontWeight: 700 }}>#{position.toLocaleString()}</span>
      </div>
      <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-elevated)' }}>
        <div
          ref={barRef}
          style={{
            width: `${percentage}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, var(--brand-violet), var(--accent-lime))',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', right: '-6px', top: '-4px',
            width: '16px', height: '16px', borderRadius: '50%',
            border: '2px solid var(--accent-lime)',
            background: 'var(--bg-base)',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Back of the line</span>
        <span style={{ color: 'var(--accent-lime)', fontWeight: 600 }}>Front of the line</span>
      </div>
    </div>
  );
}

export default function ConfirmedPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [referralLink] = useState(
    'https://scribehub.co/ref/SH-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  );
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const position = 1248;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out', delay: 0.2,
        });
      }
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 60, opacity: 0, scale: 0.95, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.5,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="font-jakarta" style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '64px',
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            fontSize: '20px', fontWeight: 700, color: 'var(--brand-violet)',
            fontFamily: 'var(--font-base)', background: 'none', border: 'none', cursor: 'pointer',
          }}
        >
          Scribe Hub
        </button>
        <Button variant="secondary" onClick={() => router.push('/')}>
          <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Home
        </Button>
      </nav>

      <div style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '64px', paddingRight: '64px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* Hero */}
        <div ref={heroRef} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h1)', marginBottom: '16px' }}>
            While you wait...
          </h1>
          <p className="text-text-secondary" style={{ fontSize: 'var(--text-body-lg)', maxWidth: '480px', margin: '0 auto' }}>
            Here's a sneak peek at what you'll unlock when you get in.
          </p>
        </div>

        {/* Teaser Cards */}
        <div
          ref={cardsRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '80px' }}
        >
          {TEASER_CARDS.map((card, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <Card style={{ background: 'var(--bg-surface)', position: 'relative', overflow: 'hidden' }}>
                {/* Blur overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(10,10,15,0.6)',
                }}>
                  <Lock className="w-6 h-6" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>Coming soon</span>
                </div>
                {/* Card content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Tag>{card.tag}</Tag>
                    <card.icon className="w-5 h-5 text-brand-light" style={{ opacity: 0.4 }} />
                  </div>
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{card.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>{card.desc}</p>
                  <span className="lime-pill" style={{ fontSize: '12px' }}>{card.earn}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Referral Section */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Card variant="glass" style={{ padding: '48px', textAlign: 'center' }}>
            <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h3)', marginBottom: '8px' }}>
              You're #{position.toLocaleString()} — refer friends to move up
            </h2>
            <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
              Every friend who joins using your link moves you closer to the front.
            </p>

            <ReferralProgress position={position} />

            {/* Referral link */}
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                className="input-field flex-1"
                style={{ fontSize: '13px', textAlign: 'left', minWidth: '200px' }}
                value={referralLink}
                readOnly
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={copyLink}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '0 20px', height: '48px', borderRadius: '999px',
                    fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: copied ? 'rgba(34,197,94,0.15)' : 'var(--brand-violet)',
                    color: copied ? 'var(--success)' : 'var(--text-primary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '0 20px', height: '48px', borderRadius: '999px',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(123,47,255,0.1)',
                    color: 'var(--brand-light)',
                    border: '1px solid var(--border-active)',
                  }}
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Button variant="secondary" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}