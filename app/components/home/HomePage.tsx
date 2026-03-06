'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { AppSidebar } from '../../components/layout/AppSidebar';
import {
  BookOpen, Gamepad2, Briefcase, Wallet,
  Sparkles, Trophy, ArrowRight, Flame,
  TrendingUp, Zap, ChevronRight, Bell,
  Settings, Star, Clock, Target,
} from 'lucide-react';

/* ── MOCK DATA ── */
const QUICK_LINKS = [
  { icon: BookOpen,  label: 'Courses',    href: '/courses',   color: '#7B2FFF', bg: 'rgba(123,47,255,0.12)' },
  { icon: Gamepad2,  label: 'Games',      href: '/games',     color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  { icon: Briefcase, label: 'Jobs',       href: '/jobs',      color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { icon: Wallet,    label: 'Wallet',     href: '/wallet',    color: '#CCFF00', bg: 'rgba(204,255,0,0.1)'   },
  { icon: Trophy,    label: 'Leaderboard',href: '/leaderboard',color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { icon: Sparkles,  label: 'ARIA',       href: '/aria',      color: '#C084FC', bg: 'rgba(192,132,252,0.12)' },
];

const RECENT_ACTIVITY = [
  { icon: BookOpen,  text: 'Completed "Forex Basics" — Lesson 3', time: '2h ago',  earn: '+₦450',  color: '#7B2FFF' },
  { icon: Gamepad2,  text: 'Won Speed Round vs. Kofi Mensah',     time: '5h ago',  earn: '+₦2,000', color: '#3B82F6' },
  { icon: Briefcase, text: 'New job match: UI Designer at Andela', time: '1d ago',  earn: '94% match', color: '#10B981' },
  { icon: Wallet,    text: 'Withdrawal processed to Access Bank',  time: '2d ago',  earn: '₦15,000', color: '#CCFF00' },
  { icon: Star,      text: 'Earned "Fast Learner" badge',          time: '3d ago',  earn: 'Badge',  color: '#F59E0B' },
];

const MOTIVATIONAL = [
  '"The fastest way to earn is to learn." — Scribe Hub community',
  '"First in the leaderboard, first in the market." — @kofi_g',
  '"I paid my rent with Scribe Hub last month." — @temi_earns',
  '"ARIA gave me a path. I just walked it." — @ibk_learns',
];

/* ── ARIA GREETING ── */
function AriaGreeting() {
  const orbRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    // Orb pulse
    gsap.to(orbRef.current, {
      scale: 1.08, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    // Text entrance
    if (textRef.current) {
      gsap.from(textRef.current.children, {
        y: 24, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.3,
      });
    }
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(123,47,255,0.12) 0%, rgba(192,132,252,0.06) 100%)',
      border: '1px solid rgba(123,47,255,0.2)', borderRadius: '20px',
      padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
        {/* ARIA Orb */}
        <div ref={orbRef} style={{
          width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7B2FFF, #C084FC)',
          boxShadow: '0 0 30px rgba(123,47,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles style={{ width: '22px', height: '22px', color: 'white' }} />
        </div>

        <div ref={textRef} style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: 'var(--brand-light)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
            ARIA · Your AI Co-pilot
          </p>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>
            {greeting}, Temi. Ready to earn today? 🔥
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '480px' }}>
            You're <strong style={{ color: 'var(--accent-lime)' }}>3 lessons away</strong> from your first certificate. Complete them today and unlock ₦2,500 in bonus earnings.
          </p>
          <button style={{
            marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
            background: 'rgba(123,47,255,0.2)', color: 'var(--brand-light)',
            border: '1px solid rgba(123,47,255,0.35)', cursor: 'pointer',
          }}>
            <Sparkles style={{ width: '13px', height: '13px' }} /> Chat with ARIA <ChevronRight style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── STAT PILLS ── */
function StatPills() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current.children, {
      y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.5,
    });
  }, []);

  const stats = [
    { icon: Wallet,    label: 'Total Earned',  value: '₦47,250',  sub: '+₦2,450 today',  color: '#CCFF00' },
    { icon: Flame,     label: 'Day Streak',    value: '12 days',  sub: 'Keep it up!',    color: '#F59E0B' },
    { icon: Trophy,    label: 'Global Rank',   value: '#348',     sub: '↑ 22 this week', color: '#3B82F6' },
    { icon: Target,    label: 'Courses Done',  value: '4 / 15',   sub: '2 in progress',  color: '#7B2FFF' },
  ];

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
      {stats.map(({ icon: Icon, label, value, sub, color }) => (
        <div key={label} style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px', padding: '18px 16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
            borderRadius: '50%', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <Icon style={{ width: '18px', height: '18px', color, marginBottom: '10px' }} />
          <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{value}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{label}</p>
          <p style={{ fontSize: '11px', color, fontWeight: 600 }}>{sub}</p>
        </div>
      ))}
    </div>
  );
}

/* ── DAILY CHALLENGE ── */
function DailyChallenge() {
  return (
    <div style={{
      background: 'rgba(204,255,0,0.05)', border: '1px solid rgba(204,255,0,0.2)',
      borderRadius: '14px', padding: '20px 24px', marginBottom: '24px',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: 'rgba(204,255,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Zap style={{ width: '20px', height: '20px', color: '#CCFF00' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#CCFF00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
          ⚡ Daily Challenge
        </p>
        <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
          Complete 2 game rounds today
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Reward: +₦500 bonus + 2x XP · Resets in 14h 22m</p>
      </div>
      <button style={{
        padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
        background: '#CCFF00', color: '#0A0A0F', border: 'none', cursor: 'pointer',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Start →
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const [quoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL.length));
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.from(pageRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-base)' }}>
      <AppSidebar />

      {/* Main */}
      <div ref={pageRef} className="app-main" style={{ flex: 1, overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Home
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification bell */}
            <button style={{
              position: 'relative', width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Bell style={{ width: '18px', height: '18px', color: 'var(--text-secondary)' }} />
              <div style={{
                position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px',
                borderRadius: '50%', background: '#EF4444', border: '2px solid var(--bg-base)',
              }} />
            </button>
            {/* Settings */}
            <button onClick={() => router.push('/settings')} style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Settings style={{ width: '18px', height: '18px', color: 'var(--text-secondary)' }} />
            </button>
            {/* Avatar */}
            <div onClick={() => router.push('/profile')} style={{
              width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--brand-violet), #9333EA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 700, color: 'white',
              border: '2px solid rgba(123,47,255,0.4)',
            }}>T</div>
          </div>
        </div>

        {/* ARIA Greeting */}
        <AriaGreeting />

        {/* Stats */}
        <StatPills />

        {/* Daily Challenge */}
        <DailyChallenge />

        {/* Two-column section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>

          {/* Quick Links */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '22px',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Quick Access
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {QUICK_LINKS.map(({ icon: Icon, label, href, color, bg }) => (
                <button key={label} onClick={() => router.push(href)} style={{
                  padding: '16px 12px', borderRadius: '12px', cursor: 'pointer',
                  background: bg, border: `1px solid ${color}25`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${color}25`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  <Icon style={{ width: '22px', height: '22px', color }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '22px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Activity</h3>
              <button style={{ fontSize: '12px', color: 'var(--brand-light)', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 8px', borderRadius: '8px', cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: `${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon style={{ width: '14px', height: '14px', color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.text}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{item.time}</p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: item.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {item.earn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <div style={{
          padding: '20px 24px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <Star style={{ width: '18px', height: '18px', color: '#F59E0B', flexShrink: 0 }} />
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
            {MOTIVATIONAL[quoteIdx]}
          </p>
        </div>

      </div>

      <style>{`
        @media (max-width: 767px) {
          .app-main { margin-left: 0 !important; padding: 72px 16px 90px !important; }
        }
      `}</style>
    </div>
  );
}