'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { AppSidebar } from '../../components/layout/AppSidebar';
import {
  Wallet, BookOpen, Gamepad2, Briefcase, Trophy,
  TrendingUp, ArrowUpRight, ArrowDownLeft, Flame,
  ChevronRight, Star, Check, Clock, Target,
  Sparkles, Settings, Bell, BarChart2, Zap,
} from 'lucide-react';

/* ── MOCK DATA ── */
const TRANSACTIONS = [
  { type: 'earn',     label: 'Course completion bonus', amount: '₦4,500',  date: 'Today, 2:14pm' },
  { type: 'earn',     label: 'Game prize — Speed Round', amount: '₦2,000', date: 'Today, 10:30am' },
  { type: 'withdraw', label: 'Withdrawal to Access Bank', amount: '₦15,000', date: 'Yesterday' },
  { type: 'earn',     label: 'Referral bonus — @kofi',   amount: '₦1,000', date: 'Dec 3' },
  { type: 'earn',     label: 'Lesson 4 — Forex Basics',  amount: '₦750',   date: 'Dec 2' },
];

const COURSES = [
  { title: 'Forex Trading Fundamentals', progress: 60, lessons: '6/10', earned: '₦2,700', color: '#7B2FFF' },
  { title: 'Data Analysis with Excel',   progress: 30, lessons: '3/10', earned: '₦1,350', color: '#3B82F6' },
  { title: 'Copywriting Mastery',        progress: 10, lessons: '1/10', earned: '₦450',   color: '#10B981' },
];

const LEADERBOARD = [
  { rank: 1,  name: 'Kwame Asante',   country: '🇬🇭', earned: '₦284,500', badge: '🥇' },
  { rank: 2,  name: 'Amara Diallo',   country: '🇸🇳', earned: '₦241,000', badge: '🥈' },
  { rank: 3,  name: 'Chidera Obi',    country: '🇳🇬', earned: '₦198,750', badge: '🥉' },
  { rank: 4,  name: 'Fatima Al-Said', country: '🇿🇦', earned: '₦176,200', badge: '' },
  { rank: 5,  name: 'Emeka Nwosu',    country: '🇳🇬', earned: '₦154,000', badge: '' },
  { rank: 348, name: 'You (Temi A.)', country: '🇳🇬', earned: '₦47,250',  badge: '', isUser: true },
];

const JOB_MATCHES = [
  { title: 'UI/UX Designer',        company: 'Paystack',   match: 94, type: 'Remote', salary: '₦800k/mo' },
  { title: 'Data Analyst',          company: 'Flutterwave',match: 87, type: 'Hybrid', salary: '₦650k/mo' },
  { title: 'Content Strategist',    company: 'TechCabal',  match: 81, type: 'Remote', salary: '₦400k/mo' },
];

const GAME_STATS = [
  { label: 'Games Played', value: '47' },
  { label: 'Win Rate',     value: '63%' },
  { label: 'Best Streak',  value: '8' },
  { label: 'Prize Won',    value: '₦18,000' },
];

/* ── PROGRESS BAR ── */
function ProgressBar({ value, color }: { value: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { width: '0%', duration: 1, ease: 'power2.out', delay: 0.3 });
  }, []);
  return (
    <div style={{ height: '6px', borderRadius: '999px', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
      <div ref={ref} style={{ height: '100%', borderRadius: '999px', background: color, width: `${value}%` }} />
    </div>
  );
}

/* ── STREAK HEATMAP ── */
function StreakHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = [1, 1, 1, 1, 1, 0, 1]; // last 7 days
  return (
    <div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {days.map((day, i) => (
          <div key={day} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: '32px', borderRadius: '6px', marginBottom: '6px',
              background: activity[i] ? 'rgba(204,255,0,0.3)' : 'var(--bg-elevated)',
              border: activity[i] ? '1px solid rgba(204,255,0,0.4)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {activity[i] ? <Flame style={{ width: '12px', height: '12px', color: '#CCFF00' }} /> : null}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{day}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px', textAlign: 'center' }}>
        🔥 12-day streak · Last missed: <span style={{ color: '#F59E0B' }}>6 days ago</span>
      </p>
    </div>
  );
}

/* ── SECTION HEADER ── */
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{
          fontSize: '12px', color: 'var(--brand-light)', background: 'none',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          {action} <ChevronRight style={{ width: '12px', height: '12px' }} />
        </button>
      )}
    </div>
  );
}

/* ── PANEL ── */
function Panel({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px', padding: '22px', ...style,
    }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.from(pageRef.current.querySelectorAll('.dash-panel'), {
      y: 24, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.1,
    });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-base)' }}>
      <AppSidebar />

      <div ref={pageRef} className="main-content" style={{ flex: 1, marginLeft: '220px', padding: '32px 40px', overflowY: 'auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>Dashboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Your full performance overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell style={{ width: '18px', height: '18px', color: 'var(--text-secondary)' }} />
              <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '2px solid var(--bg-base)' }} />
            </button>
            <button onClick={() => router.push('/settings')} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Settings style={{ width: '18px', height: '18px', color: 'var(--text-secondary)' }} />
            </button>
            <div onClick={() => router.push('/profile')} style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', background: 'linear-gradient(135deg, var(--brand-violet), #9333EA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: 'white', border: '2px solid rgba(123,47,255,0.4)' }}>T</div>
          </div>
        </div>

        {/* ── ROW 1: Wallet + Streak ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Wallet balance */}
          <Panel className="dash-panel" style={{
            background: 'linear-gradient(135deg, rgba(123,47,255,0.18) 0%, rgba(192,132,252,0.08) 100%)',
            border: '1px solid rgba(123,47,255,0.25)', gridColumn: 'span 1',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Available Balance</p>
                <p style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>₦47,250</p>
                <p style={{ fontSize: '12px', color: 'var(--accent-lime)', marginTop: '4px', fontWeight: 600 }}>+₦6,500 this week</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(123,47,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet style={{ width: '18px', height: '18px', color: 'var(--brand-light)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'var(--brand-violet)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ArrowUpRight style={{ width: '12px', height: '12px' }} /> Withdraw
              </button>
              <button style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(123,47,255,0.15)', color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.3)', cursor: 'pointer' }}>
                History
              </button>
            </div>
          </Panel>

          {/* Earnings breakdown */}
          <Panel className="dash-panel">
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Earnings Breakdown</p>
            {[
              { label: 'Courses', value: '₦29,700', pct: 63, color: '#7B2FFF' },
              { label: 'Games',   value: '₦12,000', pct: 25, color: '#3B82F6' },
              { label: 'Referral',value: '₦5,550',  pct: 12, color: '#CCFF00' },
            ].map(({ label, value, pct, color }) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                </div>
                <ProgressBar value={pct} color={color} />
              </div>
            ))}
          </Panel>

          {/* Streak */}
          <Panel className="dash-panel">
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>This Week's Streak</p>
            <StreakHeatmap />
          </Panel>
        </div>

        {/* ── ROW 2: Courses + Games ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Courses */}
          <Panel className="dash-panel">
            <SectionHeader title="Learning Progress" action="View all" onAction={() => router.push('/courses')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {COURSES.map(({ title, progress, lessons, earned, color }) => (
                <div key={title} style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-elevated)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color, background: `${color}15`, padding: '2px 8px', borderRadius: '4px' }}>{progress}%</span>
                  </div>
                  <ProgressBar value={progress} color={color} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{lessons} lessons</span>
                    <span style={{ fontSize: '11px', color: 'var(--accent-lime)', fontWeight: 600 }}>{earned} earned</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Game Stats */}
          <Panel className="dash-panel">
            <SectionHeader title="Game Performance" action="Play now" onAction={() => router.push('/games')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {GAME_STATS.map(({ label, value }) => (
                <div key={label} style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-elevated)', textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '3px' }}>{value}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</p>
                </div>
              ))}
            </div>
            <div style={{
              padding: '14px', borderRadius: '12px',
              background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>Active tournament</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Prize pool: ₦250,000 · Ends in 6h</p>
              </div>
              <button style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer' }}>
                Join
              </button>
            </div>
          </Panel>
        </div>

        {/* ── ROW 3: Leaderboard + Jobs + Transactions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Leaderboard */}
          <Panel className="dash-panel">
            <SectionHeader title="Leaderboard" action="Full board" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {LEADERBOARD.map((entry, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  background: entry.isUser ? 'rgba(123,47,255,0.1)' : 'transparent',
                  border: entry.isUser ? '1px solid rgba(123,47,255,0.2)' : '1px solid transparent',
                  marginTop: entry.isUser ? '8px' : 0,
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: entry.badge ? '#F59E0B' : 'var(--text-disabled)', width: '28px' }}>
                    {entry.badge || `#${entry.rank}`}
                  </span>
                  <span style={{ fontSize: '14px' }}>{entry.country}</span>
                  <span style={{ flex: 1, fontSize: '13px', color: entry.isUser ? 'var(--brand-light)' : 'var(--text-primary)', fontWeight: entry.isUser ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-lime)', fontWeight: 600 }}>{entry.earned}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Job Matches */}
          <Panel className="dash-panel">
            <SectionHeader title="Job Matches" action="View all" onAction={() => router.push('/jobs')} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {JOB_MATCHES.map(({ title, company, match, type, salary }) => (
                <div key={title} style={{
                  padding: '12px', borderRadius: '10px', background: 'var(--bg-elevated)',
                  cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(16,185,129,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{title}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{company} · {type}</p>
                    </div>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                      background: match >= 90 ? 'rgba(204,255,0,0.15)' : 'rgba(16,185,129,0.15)',
                      color: match >= 90 ? '#CCFF00' : '#10B981',
                    }}>{match}% match</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--accent-lime)', fontWeight: 600 }}>{salary}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Recent Transactions */}
          <Panel className="dash-panel">
            <SectionHeader title="Transactions" action="All history" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {TRANSACTIONS.map((tx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 6px', borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                    background: tx.type === 'earn' ? 'rgba(204,255,0,0.1)' : 'rgba(239,68,68,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {tx.type === 'earn'
                      ? <ArrowDownLeft style={{ width: '13px', height: '13px', color: '#CCFF00' }} />
                      : <ArrowUpRight style={{ width: '13px', height: '13px', color: '#EF4444' }} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.label}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-disabled)' }}>{tx.date}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: tx.type === 'earn' ? '#CCFF00' : '#EF4444', flexShrink: 0 }}>
                    {tx.type === 'withdraw' ? '-' : '+'}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── ARIA Insights ── */}
        <Panel className="dash-panel" style={{ background: 'linear-gradient(135deg, rgba(192,132,252,0.08) 0%, rgba(123,47,255,0.06) 100%)', border: '1px solid rgba(192,132,252,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B2FFF, #C084FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(123,47,255,0.4)' }}>
              <Sparkles style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-light)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ARIA Insights</p>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                You're <strong style={{ color: '#CCFF00' }}>2 lessons</strong> from a certificate. Your game win rate is <strong style={{ color: '#3B82F6' }}>up 12%</strong> this week. 3 new jobs match your Excel skills — apply before they close.
              </p>
            </div>
            <button onClick={() => router.push('/aria')} style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: 'rgba(123,47,255,0.2)', color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.3)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Ask ARIA <ChevronRight style={{ width: '12px', height: '12px', display: 'inline' }} />
            </button>
          </div>
        </Panel>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 20px 16px 100px !important; }
        }
      `}</style>
    </div>
  );
}