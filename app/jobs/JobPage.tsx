'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ============================================
   TYPES & DATA
   ============================================ */
interface Job {
  id: number;
  title: string;
  location: string;
  pay: string;
  currency: string;
  tag: string;
  tagColor: string;
  emoji: string;
}

const JOBS: Job[] = [
  { id: 1, title: 'Househelp', location: 'Lagos, Nigeria', pay: '₦80,000/mo', currency: 'NGN', tag: 'Domestic', tagColor: '#F59E0B', emoji: '🏠' },
  { id: 2, title: 'Content Creator', location: 'Remote, US', pay: '$2,000/mo', currency: 'USD', tag: 'Creative', tagColor: '#A78BFA', emoji: '🎬' },
  { id: 3, title: 'Personal Chef', location: 'Abuja, Nigeria', pay: '₦150,000/mo', currency: 'NGN', tag: 'Culinary', tagColor: '#F87171', emoji: '👨‍🍳' },
  { id: 4, title: 'Data Analyst', location: 'Remote, Global', pay: '$1,500/mo', currency: 'USD', tag: 'Tech', tagColor: '#34D399', emoji: '📊' },
  { id: 5, title: 'Nanny', location: 'Port Harcourt', pay: '₦60,000/mo', currency: 'NGN', tag: 'Childcare', tagColor: '#60A5FA', emoji: '👶' },
  { id: 6, title: 'Social Media Mgr', location: 'Remote, UK', pay: '$900/mo', currency: 'GBP', tag: 'Marketing', tagColor: '#E879F9', emoji: '📱' },
  { id: 7, title: 'Security Guard', location: 'Ikeja, Lagos', pay: '₦55,000/mo', currency: 'NGN', tag: 'Security', tagColor: '#FCD34D', emoji: '🛡️' },
  { id: 8, title: 'Virtual Assistant', location: 'Remote, Canada', pay: '$1,200/mo', currency: 'CAD', tag: 'Admin', tagColor: '#FB923C', emoji: '💼' },
];

const TESTIMONIALS = [
  {
    quote: "Hired a chef in literally 1 day. The AI interviewed 34 applicants overnight — I just picked from 2 great candidates.",
    name: 'Adaeze O.', role: 'Restaurant Owner, Lagos',
    avatar: 'AO', color: '#A78BFA',
  },
  {
    quote: "I got feedback telling me exactly why I didn't get the job. Improved my answers and landed the next one within a week.",
    name: 'Emeka T.', role: 'Job Seeker, Enugu',
    avatar: 'ET', color: '#34D399',
  },
  {
    quote: "We scaled hiring from 2 roles/month to 40. No extra HR staff. The AI does the grunt work, we do the choosing.",
    name: 'Sola B.', role: 'HR Lead, TechStart Nairobi',
    avatar: 'SB', color: '#F87171',
  },
  {
    quote: "As someone without a formal CV, this platform gave me a real shot. Got hired as a content creator in Canada.",
    name: 'Fatima A.', role: 'Content Creator, Kano',
    avatar: 'FA', color: '#60A5FA',
  },
];

const STATS = [
  { value: '80%', label: 'Faster hires', sub: 'vs traditional hiring' },
  { value: '50+', label: 'Languages', sub: 'including Pidgin & Yoruba' },
  { value: '500+', label: 'Employers', sub: 'across 12 countries' },
  { value: '94%', label: 'Satisfaction', sub: 'from hired candidates' },
];

const HOW_IT_WORKS = [
  {
    step: '01', icon: '📋', title: 'Post Your Job',
    employer: 'Add role, pay, and 5 custom questions in under 3 minutes.',
    applicant: 'Browse listings. No CV needed — just click "Interview Now".',
    color: '#A78BFA',
  },
  {
    step: '02', icon: '🎙️', title: 'AI Interviews Everyone',
    employer: 'AI conducts voice/video interviews with every applicant simultaneously.',
    applicant: 'Answer 5–10 conversational questions in your language, on your phone.',
    color: '#34D399',
  },
  {
    step: '03', icon: '⚡', title: 'AI Ranks & Scores',
    employer: 'Bias-free scoring on answers, confidence, and role fit.',
    applicant: 'Get instant personalised feedback whether you make the cut or not.',
    color: '#FCD34D',
  },
  {
    step: '04', icon: '🏆', title: 'Top 2 Are Yours',
    employer: 'Receive profiles, recordings, and scores of only the top 2 candidates.',
    applicant: 'If selected, employer receives your full profile — no middleman.',
    color: '#F87171',
  },
];

const PRICING = [
  {
    tier: 'Free', price: '$0', period: '', color: 'rgba(255,255,255,0.06)',
    accent: 'rgba(255,255,255,0.5)',
    features: ['1 active job post', 'Up to 50 applicants', 'AI interviews included', 'Top 2 candidates delivered', 'Basic feedback reports'],
    cta: 'Post Job Free', popular: false,
  },
  {
    tier: 'Pro', price: '$49', period: '/mo', color: 'rgba(167,139,250,0.1)',
    accent: '#A78BFA',
    features: ['Unlimited job posts', 'Unlimited applicants', 'Priority AI processing', 'Advanced skill scoring', 'Blockchain skill badges', 'Voice + 50 languages', 'Dedicated support'],
    cta: 'Start Pro Trial', popular: true,
  },
  {
    tier: 'Enterprise', price: 'Custom', period: '', color: 'rgba(52,211,153,0.08)',
    accent: '#34D399',
    features: ['Everything in Pro', 'Custom AI question banks', 'GDPR / NDPA compliance kit', 'White-label option', 'SLA & dedicated servers', 'Human review add-on', 'API access'],
    cta: 'Book a Demo', popular: false,
  },
];

const FEATURES = [
  { icon: '🌍', title: '50+ Languages', desc: 'Interviews in Pidgin, Yoruba, Hausa, French, Spanish & more. Voice-only mode for low-bandwidth areas.' },
  { icon: '🛡️', title: 'Bias-Free Scoring', desc: 'Uniform questions, blind scoring. No favouritism by accent, gender, or appearance.' },
  { icon: '🔗', title: 'Skill Passport', desc: 'Blockchain-verified badges portable across every job. Your score follows you forever.' },
  { icon: '⚡', title: 'Real-Time Matching', desc: 'Gig economy ready. "Cook tonight in Ikeja ₦10k" — filled in under an hour.' },
  { icon: '📈', title: 'Feedback That Grows You', desc: 'Every applicant gets detailed AI feedback linked to free micro-courses.' },
  { icon: '🤝', title: 'Human Review Add-on', desc: 'Optional ₦2k for a live coach to review your top 2 picks. Best of both worlds.' },
];

/* ============================================
   LIVE TICKER
   ============================================ */
function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const items = [
    '🔴 Chef hired in Lagos — 48 applicants screened in 2 hours',
    '🟢 Content creator placed in Toronto — salary $2,400/mo',
    '🔴 Nanny role in Abuja — filled same day, zero CVs reviewed',
    '🟢 Data Analyst matched to Berlin startup — 91% AI fit score',
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '8px 0', overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#22C55E', letterSpacing: '0.1em', flexShrink: 0 }}>LIVE</span>
        <p style={{
          fontSize: '12px', color: 'rgba(255,255,255,0.5)',
          transition: 'opacity 0.4s',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {items[idx]}
        </p>
      </div>
    </div>
  );
}

/* ============================================
   JOB CAROUSEL CARD
   ============================================ */
function JobCard({ job }: { job: Job }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px',
      minWidth: '240px',
      maxWidth: '240px',
      flexShrink: 0,
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
      (e.currentTarget as HTMLDivElement).style.borderColor = job.tagColor + '66';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
    }}
    >
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>{job.emoji}</div>
      <div style={{
        display: 'inline-block', fontSize: '10px', fontWeight: 700,
        color: job.tagColor, background: job.tagColor + '18',
        padding: '2px 8px', borderRadius: '4px',
        marginBottom: '8px', letterSpacing: '0.06em',
      }}>{job.tag}</div>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{job.title}</p>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>{job.location}</p>
      <p style={{ fontSize: '18px', fontWeight: 800, color: job.tagColor }}>{job.pay}</p>
      <button style={{
        marginTop: '14px', width: '100%', padding: '8px 0',
        background: job.tagColor + '18', color: job.tagColor,
        border: `1px solid ${job.tagColor}44`, borderRadius: '8px',
        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        transition: 'background 0.15s',
      }}>
        Apply Now →
      </button>
    </div>
  );
}

/* ============================================
   SECTION WRAPPER
   ============================================ */
function Section({ children, id, style }: { children: React.ReactNode; id?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{
      padding: 'clamp(64px, 8vw, 100px) clamp(16px, 5vw, 48px)',
      maxWidth: '1200px', margin: '0 auto',
      ...style,
    }}>
      {children}
    </section>
  );
}

function SectionLabel({ children, color = '#A78BFA' }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
      color, textTransform: 'uppercase', marginBottom: '14px',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <span style={{ width: '20px', height: '1px', background: color, display: 'inline-block' }} />
      {children}
    </p>
  );
}

function SectionTitle({ children, gradient }: { children: React.ReactNode; gradient?: string }) {
  return (
    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 48px)',
      fontWeight: 800, lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#fff',
      marginBottom: '16px',
      ...(gradient ? {
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      } : {}),
    }}>
      {children}
    </h2>
  );
}

/* ============================================
   TOGGLE — Employer / Applicant
   ============================================ */
function ViewToggle({ active, setActive }: { active: 'employer' | 'applicant'; setActive: (v: 'employer' | 'applicant') => void }) {
  return (
    <div style={{
      display: 'inline-flex',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '99px', padding: '4px',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '40px',
    }}>
      {(['employer', 'applicant'] as const).map(view => (
        <button
          key={view}
          onClick={() => setActive(view)}
          style={{
            padding: '9px 24px', borderRadius: '99px',
            fontSize: '13px', fontWeight: 700,
            border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
            ...(active === view ? {
              background: '#7B2FFF',
              color: '#fff',
              boxShadow: '0 0 20px rgba(123,47,255,0.4)',
            } : {
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
            }),
          }}
        >
          {view === 'employer' ? '👔 I\'m Hiring' : '🙋 I\'m Applying'}
        </button>
      ))}
    </div>
  );
}

/* ============================================
   MAIN PAGE
   ============================================ */
export default function JobsLandingPage() {
  const router = useRouter();
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [view, setView] = useState<'employer' | 'applicant'>('employer');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [activePricing, setActivePricing] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll carousel
  useEffect(() => {
    const total = JOBS.length * 256;
    const interval = setInterval(() => {
      setCarouselOffset(prev => (prev + 1) % total);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Testimonial auto-rotate
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Hero entrance
  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll('.hero-animate');
    gsap.from(els, { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.1 });
  }, []);

  const handleEmailSubmit = () => {
    if (email.includes('@')) { setEmailSent(true); }
  };

  const carouselItems = [...JOBS, ...JOBS, ...JOBS];

  return (
    <div style={{
      background: '#07070f',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: "'Syne', 'DM Sans', 'Outfit', system-ui, sans-serif",
      overflowX: 'hidden',
    }}>

      {/* ── Google Fonts ── */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── Live Ticker ── */}
      <LiveTicker />

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,7,15,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 clamp(16px,4vw,48px)', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={() => router.push('/')}
          style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#A78BFA', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Scribe<span style={{ color: '#fff' }}>Hire</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 20px)' }}>
          {['How It Works', 'Jobs', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.55)',
              textDecoration: 'none', fontWeight: 500,
              display: 'none',
            }}
            className="nav-link"
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => router.push('/waitlist')}
            style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
              background: '#7B2FFF', color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(123,47,255,0.35)',
            }}
          >
            Post Job Free
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO
         ════════════════════════════════════════ */}
      <div ref={heroRef} style={{
        position: 'relative',
        padding: 'clamp(64px,10vw,120px) clamp(16px,5vw,48px) clamp(64px,8vw,100px)',
        maxWidth: '1200px', margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          <div className="hero-animate" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '99px', padding: '6px 14px', marginBottom: '20px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 8px #22C55E' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Now hiring across 12 countries</span>
          </div>

          <h1 className="hero-animate" style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', marginBottom: '20px',
          }}>
            Hire Top Talent<br />
            <span style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #7B2FFF 50%, #E879F9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>in 5 Minutes.</span><br />
            No Resumes Needed.
          </h1>

          <p className="hero-animate" style={{
            fontSize: 'clamp(14px,1.6vw,18px)', color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            AI interviews every applicant simultaneously. Delivers the top 2 candidates with scores, recordings, and personalised feedback — so you choose with confidence, not guesswork.
          </p>

          <div className="hero-animate" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button style={{
              padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
              background: 'linear-gradient(135deg, #A78BFA, #7B2FFF)',
              color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 30px rgba(123,47,255,0.4)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Post Job Free →
            </button>
            <button style={{
              padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
            >
              Apply Now
            </button>
          </div>

          {/* Trust row */}
          <div className="hero-animate" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { value: '80%', label: 'Faster hires' },
              { value: '500+', label: 'Employers' },
              { value: '50+', label: 'Languages' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#A78BFA', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Video demo placeholder */}
        <div className="hero-animate" style={{ position: 'relative' }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,47,255,0.3) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', overflow: 'hidden',
            aspectRatio: '16/10',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Mock video player */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(123,47,255,0.05))',
            }} />

            {/* Fake video UI */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(123,47,255,0.8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 40px rgba(123,47,255,0.5)',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Watch 30s demo</p>
            </div>

            {/* Mock interview UI overlays */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              borderRadius: '10px', padding: '10px 14px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <p style={{ fontSize: '10px', color: '#22C55E', fontWeight: 700, marginBottom: '2px' }}>● AI INTERVIEW LIVE</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>34 applicants screened</p>
            </div>

            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(167,139,250,0.15)', backdropFilter: 'blur(8px)',
              borderRadius: '10px', padding: '8px 12px',
              border: '1px solid rgba(167,139,250,0.3)',
            }}>
              <p style={{ fontSize: '10px', color: '#A78BFA', fontWeight: 700 }}>TOP 2 READY</p>
            </div>

            {/* Fake waveform */}
            <div style={{
              position: 'absolute', bottom: '16px', right: '16px',
              display: 'flex', alignItems: 'center', gap: '3px',
            }}>
              {[4, 8, 12, 6, 14, 10, 8, 5, 12, 7].map((h, i) => (
                <div key={i} style={{
                  width: '3px', height: `${h}px`, borderRadius: '2px',
                  background: '#A78BFA', opacity: 0.7,
                  animation: `wave-bar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                }} />
              ))}
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', top: '-16px', right: '-16px',
            background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
            borderRadius: '12px', padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(252,211,77,0.3)',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: '#0a0a0f' }}>NO CV NEEDED</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          STATS BAR
         ════════════════════════════════════════ */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(32px,4vw,48px) clamp(16px,5vw,48px)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '32px',
        }}>
          {STATS.map(({ value, label, sub }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800,
                background: 'linear-gradient(135deg, #A78BFA, #E879F9)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>{value}</p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginTop: '6px' }}>{label}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '3px' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          HOW IT WORKS
         ════════════════════════════════════════ */}
      <Section id="how-it-works">
        <SectionLabel>Process</SectionLabel>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <SectionTitle>
            Four steps.<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>Zero résumés.</span>
          </SectionTitle>
          <ViewToggle active={view} setActive={setView} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          position: 'relative',
        }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: '40px', left: '60px', right: '60px', height: '1px',
            background: 'linear-gradient(90deg, #A78BFA22, #A78BFA66, #A78BFA22)',
            zIndex: 0,
          }} />

          {HOW_IT_WORKS.map(({ step, icon, title, employer, applicant, color }) => (
            <div key={step} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${color}22`,
              borderRadius: '16px', padding: '24px',
              position: 'relative', zIndex: 1,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = color + '66';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = color + '22';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: color + '18', border: `1px solid ${color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '16px',
              }}>
                {icon}
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color, letterSpacing: '0.08em', marginBottom: '6px' }}>STEP {step}</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '10px', fontFamily: 'Syne, sans-serif' }}>{title}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
                {view === 'employer' ? employer : applicant}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════
          JOB CAROUSEL
         ════════════════════════════════════════ */}
      <div id="jobs" style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(48px,6vw,80px) 0',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px,5vw,48px)', marginBottom: '28px' }}>
          <SectionLabel color="#FCD34D">Live Opportunities</SectionLabel>
          <SectionTitle>From Lagos to London.<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>Every job. Every skill level.</span></SectionTitle>
        </div>

        {/* Scrolling carousel */}
        <div style={{ position: 'relative' }}>
          {/* Left fade */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(90deg, #07070f, transparent)',
          }} />
          {/* Right fade */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
            background: 'linear-gradient(270deg, #07070f, transparent)',
          }} />

          <div
            ref={carouselRef}
            style={{
              display: 'flex', gap: '16px',
              transform: `translateX(-${carouselOffset}px)`,
              paddingLeft: '80px', paddingRight: '80px',
            }}
          >
            {carouselItems.map((job, i) => (
              <JobCard key={`${job.id}-${i}`} job={job} />
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '28px auto 0', padding: '0 clamp(16px,5vw,48px)' }}>
          <button style={{
            padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
            background: 'rgba(252,211,77,0.1)', color: '#FCD34D',
            border: '1px solid rgba(252,211,77,0.25)', cursor: 'pointer',
            transition: 'background 0.15s',
          }}>
            Browse all jobs →
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          UNIQUE FEATURES
         ════════════════════════════════════════ */}
      <Section>
        <SectionLabel color="#34D399">Why ScribeHire</SectionLabel>
        <SectionTitle>
          Built for Africa.<br />
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Ready for the world.</span>
        </SectionTitle>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '48px', fontFamily: 'DM Sans, sans-serif' }}>
          We went deep on the problems that make hiring painful in Nigeria and across the Global South. Then we solved them.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div key={title} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '24px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
            }}
            >
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{icon}</div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>{title}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontFamily: 'DM Sans, sans-serif' }}>{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════
          SOCIAL PROOF
         ════════════════════════════════════════ */}
      <div style={{
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Section>
          <SectionLabel color="#F87171">Social Proof</SectionLabel>
          <SectionTitle gradient="linear-gradient(135deg, #F87171, #FCD34D)">
            Real hires. Real stories.
          </SectionTitle>

          {/* Used by logos */}
          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center',
            marginBottom: '48px',
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.06em' }}>USED BY 500+ EMPLOYERS</p>
            {['TechStart', 'Konga HR', 'Flutterwave', 'PiggyVest', 'MainOne'].map(name => (
              <div key={name} style={{
                padding: '6px 16px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              }}>
                {name}
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {TESTIMONIALS.map(({ quote, name, role, avatar, color }) => (
              <div key={name} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '24px',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = color + '44'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ fontSize: '13px', color: '#FCD34D' }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
                  marginBottom: '18px', fontFamily: 'DM Sans, sans-serif', fontStyle: 'italic',
                }}>
                  "{quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: color + '25', border: `1px solid ${color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color,
                  }}>
                    {avatar}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ════════════════════════════════════════
          PRICING
         ════════════════════════════════════════ */}
      <Section id="pricing">
        <SectionLabel color="#A78BFA">Pricing</SectionLabel>
        <SectionTitle>Simple.<br /><span style={{ color: 'rgba(255,255,255,0.35)' }}>No surprises.</span></SectionTitle>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '48px', maxWidth: '420px', fontFamily: 'DM Sans, sans-serif' }}>
          Start free. Scale when you're ready. Cancel anytime.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px', alignItems: 'start',
        }}>
          {PRICING.map(({ tier, price, period, color, accent, features, cta, popular }) => (
            <div key={tier} style={{
              background: color,
              border: `1px solid ${popular ? accent + '44' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '20px', padding: '28px',
              position: 'relative',
              transform: popular ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}>
              {popular && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${accent}, #7B2FFF)`,
                  color: '#fff', fontSize: '11px', fontWeight: 800,
                  padding: '4px 16px', borderRadius: '99px',
                  letterSpacing: '0.06em',
                }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ fontSize: '13px', fontWeight: 700, color: accent, letterSpacing: '0.06em', marginBottom: '8px' }}>{tier.toUpperCase()}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '20px' }}>
                <p style={{ fontSize: '42px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>{price}</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>{period}</p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: accent + '25', border: `1px solid ${accent}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{f}</p>
                  </div>
                ))}
              </div>

              <button style={{
  width: '100%', padding: '12px 0',
  borderRadius: '10px', fontSize: '14px', fontWeight: 700,
  cursor: 'pointer', transition: 'opacity 0.15s',
  background: popular ? `linear-gradient(135deg, ${accent}, #7B2FFF)` : `${accent}18`,
  color: popular ? '#fff' : accent,
  border: popular ? 'none' : `1px solid ${accent}33`,
  boxShadow: popular ? `0 4px 24px ${accent}33` : 'none',
} as React.CSSProperties}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════════════════════════════════════
          CTA BANNER
         ════════════════════════════════════════ */}
      <div style={{
        margin: '0 clamp(16px,4vw,48px)',
        borderRadius: '24px', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(123,47,255,0.25), rgba(232,121,249,0.1))',
        border: '1px solid rgba(167,139,250,0.2)',
        padding: 'clamp(48px,6vw,80px) clamp(24px,5vw,64px)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '-50%', left: '50%',
          transform: 'translateX(-50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <p style={{ fontSize: '12px', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.1em', marginBottom: '16px' }}>
          ✦ GET STARTED TODAY
        </p>
        <h2 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          color: '#fff', marginBottom: '16px',
        }}>
          Your next hire is<br />one post away.
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginBottom: '32px', fontFamily: 'DM Sans, sans-serif' }}>
          Free forever on your first job. No credit card. No résumés.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
            background: 'linear-gradient(135deg, #A78BFA, #7B2FFF)',
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 30px rgba(123,47,255,0.5)',
            transition: 'opacity 0.15s',
          }}>
            Post Job Free →
          </button>
          <button style={{
            padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 700,
            background: 'transparent', color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
          }}>
            Book a Demo
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(48px,6vw,64px) clamp(16px,5vw,48px) 32px',
        maxWidth: '1200px', margin: '60px auto 0',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#A78BFA', marginBottom: '10px' }}>
              Scribe<span style={{ color: '#fff' }}>Hire</span>
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif', maxWidth: '200px' }}>
              AI hiring for Africa and the world. No CVs. No bias. Just talent.
            </p>
          </div>

          {/* Links */}
          {[
            { heading: 'Product', links: ['How It Works', 'Jobs Board', 'Pricing', 'Changelog'] },
            { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'NDPA Compliance', 'GDPR'] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '14px', textTransform: 'uppercase' }}>
                {heading}
              </p>
              {links.map(link => (
                <p key={link} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '9px', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  {link}
                </p>
              ))}
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: '14px', textTransform: 'uppercase' }}>
              Stay Updated
            </p>
            {emailSent ? (
              <p style={{ fontSize: '13px', color: '#22C55E', fontWeight: 600 }}>✓ You're on the list!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="email" placeholder="your@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
                    outline: 'none',
                  }}
                />
                <button onClick={handleEmailSubmit} style={{
                  padding: '10px 0', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                  background: 'rgba(167,139,250,0.15)', color: '#A78BFA',
                  border: '1px solid rgba(167,139,250,0.3)', cursor: 'pointer',
                }}>
                  Subscribe →
                </button>
              </div>
            )}

            {/* Language toggle */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['EN', 'FR', 'YO', 'HA', 'IG'].map(lang => (
                <button key={lang} style={{
                  padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                  background: lang === 'EN' ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)',
                  color: lang === 'EN' ? '#A78BFA' : 'rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                }}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
            © 2025 ScribeHire. All rights reserved. Payments via Paystack & Stripe.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Twitter', 'LinkedIn', 'Instagram', 'WhatsApp'].map(s => (
              <p key={s} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                {s}
              </p>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 8px currentColor; }
          50% { box-shadow: 0 0 3px currentColor; }
        }
        @media (max-width: 768px) {
          .nav-link { display: none !important; }
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}