'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRevealAll } from '../../hooks/useReveal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CountUp } from '../../components/ui/CountUp';
import { Tag } from '../../components/ui/Tag';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { AriaOrb } from '../../components/ui/AriaOrb';
import {
  BookOpen, Gamepad2, Briefcase, Eye, Target, Zap,
  ChevronRight, Shield, Star,
  Mail, Twitter, Instagram, Linkedin, Diamond
} from 'lucide-react';

/* ============================================
   SECTION 5: LANDING PAGE
   ============================================ */

// -- 5.2 Hero 3D Scene (Three.js particle field) --
function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const count = 80;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 47, 255, ${p.alpha})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(123, 47, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// -- 5.2 ARIA 3D Avatar --
function HeroAria() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const rotX = dy * 15;
      const rotY = dx * 15;
      orbRef.current.style.transform = `perspective(600px) rotateX(${-rotX}deg) rotateY(${rotY}deg)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div
      ref={orbRef}
      className="relative mx-auto transition-transform"
      style={{ width: 280, height: 280, transitionDuration: '50ms' }}
    >
      <div className="absolute inset-0 rounded-full animate-aria-pulse"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(123,47,255,0.3) 0%, transparent 60%)',
          animation: 'ariaPulse 3s ease-in-out infinite 0.5s',
        }}
      />
      <div className="absolute inset-10 rounded-full shadow-glow"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #C084FC, #7B2FFF 50%, #5B1FCC 100%)',
          boxShadow: '0 0 120px rgba(123,47,255,0.6), inset 0 0 40px rgba(255,255,255,0.1)',
        }}
      />
      <div className="absolute rounded-full bg-white/30"
        style={{ width: 12, height: 12, top: '38%', left: '40%', filter: 'blur(2px)' }}
      />
      <div className="absolute rounded-full bg-white/20"
        style={{ width: 8, height: 8, top: '36%', left: '56%', filter: 'blur(1px)' }}
      />
      <div className="absolute inset-0 rounded-full animate-aria-pulse opacity-40"
        style={{ border: '1px solid rgba(192,132,252,0.3)' }}
      />
    </div>
  );
}

// -- 5.1 Landing Navbar --
function LandingNav() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-surface border-b border-border-subtle backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <span className="text-lg md:text-xl font-bold text-brand-violet font-jakarta tracking-tight">
        Scribe Hub
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          className="py-2! px-3! md:px-5! text-xs md:text-sm"
          onClick={() => router.push('/sign-in')}
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          className="py-2! px-3! md:px-5! text-xs md:text-sm"
          onClick={() => router.push('/waitlist')}
        >
          Join Waitlist
        </Button>
      </div>
    </nav>
  );
}

// -- 5.2 Hero Section --
function HeroSection() {
  const router = useRouter();
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSub(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <HeroParticles />
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4 md:px-6 max-w-7xl mx-auto w-full pt-20 pb-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="font-extrabold leading-none tracking-tight" style={{ fontSize: 'clamp(40px, 10vw, 96px)' }}>
            <span className="block text-text-primary opacity-0 animate-[fadeSlideUp_0.8s_ease-out_forwards]">LEARN.</span>
            <span className="block text-text-primary opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.12s_forwards]">COMPETE.</span>
            <span className="block text-accent-lime opacity-0 animate-[fadeSlideUp_0.8s_ease-out_0.24s_forwards]">EARN.</span>
          </h1>
          <p
            className={`mt-6 text-text-secondary max-w-lg mx-auto lg:mx-0 transition-all duration-700 ${
              showSub ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontSize: 'var(--text-body-lg)' }}
          >
            Africa's AI-native platform where knowledge becomes income. Learn real skills, compete in merit-based games, and get paid.
          </p>
          <div
            className={`flex flex-wrap gap-3 mt-8 justify-center lg:justify-start transition-all duration-700 delay-200 ${
              showSub ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button variant="primary" onClick={() => router.push('/sign-up')}>Join Free</Button>
            <Button variant="secondary" onClick={() => router.push('/waitlist')}>Join Waitlist</Button>
          </div>
        </div>

        <div className="shrink-0 relative">
          <HeroAria />
          <div className="hidden lg:block">
            <Card variant="glass" className="absolute -right-20 top-4 p-4! min-w-50">
              <p className="text-text-secondary text-xs mb-1">avg. daily earnings</p>
              <p className="text-accent-lime font-extrabold text-xl tabular-nums">
                <CountUp target={2400} />
              </p>
            </Card>
            <Card variant="glass" className="absolute -left-16 bottom-8 p-4! min-w-50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <p className="text-text-secondary text-xs">learners online now</p>
              </div>
              <p className="text-text-primary font-extrabold text-xl tabular-nums">
                <CountUp target={1200} isCurrency={false} prefix="" />
                <span className="text-text-secondary font-normal text-sm">+</span>
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="lg:hidden absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 z-10">
        <Card variant="glass" className="p-3! flex-1 max-w-40">
          <p className="text-text-secondary text-[10px] mb-0.5">avg. daily earnings</p>
          <p className="text-accent-lime font-extrabold text-base tabular-nums">
            <CountUp target={2400} />
          </p>
        </Card>
        <Card variant="glass" className="p-3! flex-1 max-w-40">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <p className="text-text-secondary text-[10px]">online now</p>
          </div>
          <p className="text-text-primary font-extrabold text-base tabular-nums">1,200+</p>
        </Card>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-bg-base to-transparent z-10" />
    </section>
  );
}

// -- 5.3 Social Proof Ticker --
function SocialProofTicker() {
  const items = [
    'Adaeze just earned ₦4,500 on Forex Trading Level 2',
    'Chidi won ₦12,000 in the Speed Round',
    '847 jobs matched today',
    'Ngozi completed Crypto Basics and earned ₦2,100',
    'Emeka withdrew ₦15,000 to his bank account',
    'Fatima scored 98% in the Marketing Quiz',
    '₦3.2M total earnings this month on Scribe Hub',
    'Tunde landed a freelance gig paying ₦8,000/hr',
  ];

  const renderItem = (text: string, key: string) => {
    const parts = text.split(/(₦[\d,]+(?:\/\w+)?(?:\.\d+)?[MKk]?)/g);
    return (
      <span key={key} className="flex items-center gap-4 whitespace-nowrap">
        {parts.map((part, i) =>
          part.startsWith('₦') ? (
            <span key={i} className="text-accent-lime font-bold">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        <Diamond className="w-3 h-3 text-brand-violet fill-brand-violet opacity-60" />
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden py-4 border-y border-border-subtle"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="flex gap-8 animate-ticker" style={{ width: 'max-content' }}>
        {items.map((item, i) => renderItem(item, `a-${i}`))}
        {items.map((item, i) => renderItem(item, `b-${i}`))}
      </div>
    </div>
  );
}

// -- 5.4 Engine Section --
function EngineSection({
  headline,
  copy,
  cta,
  icon: Icon,
  visual,
  reversed = false,
}: {
  headline: string;
  copy: string;
  cta: string;
  icon: React.ElementType;
  visual: React.ReactNode;
  reversed?: boolean;
}) {
  return (
    <section style={{ padding: '80px 120px', width: '100%' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16`}>
          <div className="reveal" style={{ flex: '0 0 45%', minWidth: '400px' }}>
            <div className="inline-flex items-center gap-2 mb-6">
              <Icon className="w-5 h-5 text-brand-light" />
            </div>
            <h2 className="font-extrabold text-text-primary mb-6" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: '1.1' }}>
              {headline}
            </h2>
            <p className="text-text-secondary mb-12 max-w-md" style={{ fontSize: 'var(--text-body-lg)', marginTop: '16px' }}>
              {copy}
            </p>
            <div style={{ marginTop: '40px' }}>
              <Button variant="secondary" className="inline-flex items-center gap-2">
                {cta} <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 reveal">
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

// -- Engine Visuals --
function LearnVisual() {
  return (
    <Card className="max-w-sm mx-auto relative overflow-hidden">
      <div className="h-40 rounded-lg-token mb-4 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--bg-elevated), var(--bg-surface))' }}
      >
        <BookOpen className="w-12 h-12 text-brand-light opacity-60" />
      </div>
      <div className="flex items-center justify-between mb-3">
        <Tag>FOREX</Tag>
        <ProgressRing progress={68} size={48} />
      </div>
      <h3 className="text-text-primary font-bold text-lg mb-1">Forex Trading Fundamentals</h3>
      <p className="text-text-secondary text-sm mb-3">Module 3 of 8</p>
      <div className="flex items-center justify-between">
        <span className="lime-pill text-sm">Earn up to ₦4,500</span>
        <span className="text-accent-lime font-bold text-sm tabular-nums">+₦120/segment</span>
      </div>
    </Card>
  );
}

function CompeteVisual() {
  return (
    <Card className="mx-auto card-earn" style={{ maxWidth: '320px' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-text-primary font-extrabold text-lg">Speed Round</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-text-secondary text-xs">42 playing</span>
        </div>
      </div>
      <div className="text-center py-8">
        <p className="text-text-secondary text-label uppercase tracking-wider mb-3">PRIZE POOL</p>
        <p className="text-accent-lime font-extrabold tabular-nums" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
          <CountUp target={25000} />
        </p>
      </div>
      <div className="flex gap-2 mb-5">
        <Tag variant="warning">MEDIUM</Tag>
        <Tag variant="success">FREE ENTRY</Tag>
      </div>
      <div className="flex items-center mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-surface"
            style={{ background: `hsl(${260 + i * 20}, 60%, ${50 + i * 5}%)`, zIndex: 5 - i, marginLeft: i === 0 ? 0 : '-10px' }}
          />
        ))}
        <span className="text-text-secondary text-xs ml-3">+37 more</span>
      </div>
      <Button variant="earn" className="w-full">Play Now</Button>
    </Card>
  );
}

function WorkVisual() {
  return (
    <Card className="max-w-sm mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-text-primary font-bold text-lg mb-1">UX Writer for Fintech App</h3>
          <p className="text-text-secondary text-sm">Remote • Short-term</p>
        </div>
        <ProgressRing progress={93} size={56} />
      </div>
      <p className="text-text-secondary text-xs mb-1">AI Match</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag>UX WRITING</Tag>
        <Tag>FINTECH</Tag>
        <Tag>ENGLISH</Tag>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-accent-lime font-extrabold text-xl tabular-nums">₦8,000<span className="text-sm font-normal text-text-secondary"> / hr</span></span>
        <Button variant="primary" className="py-2! px-5! text-sm">Apply Now</Button>
      </div>
    </Card>
  );
}

// -- 5.5 ARIA Feature Section --
function AriaFeatureSection() {
  return (
    <section className="relative overflow-hidden"
      style={{ background: 'var(--bg-base)', padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 80px)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(123,47,255,0.15) 0%, transparent 60%)' }}
      />
      <div className="text-center relative z-10" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="reveal flex justify-center" style={{ marginBottom: '48px' }}>
          <div className="rounded-full relative"
            style={{
              width: '160px', height: '160px',
              background: 'radial-gradient(circle at 35% 35%, #C084FC, #7B2FFF 50%, #5B1FCC)',
              boxShadow: '0 0 160px rgba(123,47,255,0.5), 0 0 60px rgba(123,47,255,0.3)',
            }}
          >
            <div className="absolute inset-0 rounded-full animate-aria-pulse"
              style={{ border: '1px solid rgba(192,132,252,0.2)' }}
            />
          </div>
        </div>

        <h2 className="reveal font-extrabold text-text-primary" style={{ fontSize: 'clamp(24px, 5vw, 48px)', marginBottom: '16px' }}>
          Meet ARIA. Your AI co-pilot, built for you.
        </h2>
        <p className="reveal text-text-secondary" style={{ fontSize: 'var(--text-body-lg)', margin: '16px auto 48px', maxWidth: '600px' }}>
          Customise her. Name her. Make her yours.
        </p>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
          {[
            { icon: Eye, title: 'Knows your goals', desc: 'Understands what you want to achieve and builds a path to get there.' },
            { icon: Target, title: 'Tracks your progress', desc: 'Monitors every lesson, game, and job — so you never lose momentum.' },
            { icon: Zap, title: 'Surfaces opportunities', desc: 'Finds the best earning chances before you even know to look.' },
          ].map((f, i) => (
            <div key={i} className="card text-center" style={{ background: 'var(--bg-elevated)', padding: 'clamp(20px, 3vw, 40px) clamp(12px, 2vw, 24px)' }}>
              <div className="rounded-lg-token mx-auto flex items-center justify-center"
                style={{ width: '48px', height: '48px', background: 'rgba(123,47,255,0.15)', marginBottom: '16px', borderRadius: '12px' }}
              >
                <f.icon className="w-5 h-5 text-brand-light" />
              </div>
              <h3 className="text-text-primary font-bold" style={{ fontSize: 'clamp(13px, 2vw, 18px)', marginBottom: '8px' }}>{f.title}</h3>
              <p className="text-text-secondary" style={{ fontSize: 'clamp(11px, 1.5vw, 14px)' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: '40px' }}>
          <Button variant="earn" className="text-lg" style={{ padding: '16px 48px' }}>
            Unlock ARIA
          </Button>
        </div>
      </div>
    </section>
  );
}

// -- 5.6 Pricing Section --
function PricingSection() {
  const router = useRouter();

  return (
    <section style={{ background: 'var(--bg-surface)', padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 80px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="text-center reveal" style={{ marginBottom: '48px' }}>
          <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'clamp(24px, 5vw, 48px)', marginBottom: '16px' }}>
            Get Early Access
          </h2>
          <p className="text-text-secondary" style={{ fontSize: 'var(--text-body-lg)' }}>
            Join as a Founding Member and unlock everything from day one.
          </p>
        </div>

        <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Waitlist Card */}
          <div className="card" style={{ border: '1px solid var(--brand-violet)', padding: 'clamp(20px, 3vw, 32px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <Tag variant="lime">LIMITED</Tag>
            </div>
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
              <p className="text-text-secondary text-sm" style={{ marginBottom: '8px' }}>Founding Member</p>
              <p className="text-text-primary font-extrabold tabular-nums" style={{ fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: '4px' }}>
                ₦2,500<span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/mo</span>
              </p>
              <p className="text-text-secondary text-sm">Billed monthly</p>
            </div>
            <ul style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'All 15 courses + earn per segment',
                'All 10 skill-based games',
                'Full job marketplace access',
                'ARIA — fully unlocked',
                'Priority support & founding badge',
              ].map((f, i) => (
                <li key={i} className="text-text-primary" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'clamp(11px, 1.8vw, 14px)' }}>
                  <Star className="w-4 h-4 text-accent-lime" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="primary" className="w-full" onClick={() => router.push('/waitlist')}>
              Join Waitlist
            </Button>
          </div>

          {/* Free Card */}
          <div className="card" style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
              <p className="text-text-secondary text-sm" style={{ marginBottom: '8px' }}>Free Account</p>
              <p className="text-text-primary font-extrabold tabular-nums" style={{ fontSize: 'clamp(28px, 5vw, 40px)', marginBottom: '4px' }}>
                Free<span style={{ fontSize: '16px', fontWeight: 'normal', color: 'var(--text-secondary)' }}> forever</span>
              </p>
              <p className="text-text-secondary text-sm">No credit card needed</p>
            </div>
            <ul style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                '3 starter courses',
                'Limited game access',
                'Basic job matching',
                'ARIA — limited interactions',
                'Upgrade anytime',
              ].map((f, i) => (
                <li key={i} className="text-text-secondary" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'clamp(11px, 1.8vw, 14px)' }}>
                  <ChevronRight className="w-4 h-4" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="w-full" onClick={() => router.push('/sign-up')}>
              Join Free
            </Button>
          </div>
        </div>

        <p className="text-center text-text-secondary text-sm reveal" style={{ marginTop: '24px' }}>
          <span className="text-accent-lime font-bold">47 spots remaining</span> — Founding Member pricing won't last forever.
        </p>
      </div>
    </section>
  );
}
// -- 5.7 Footer --
function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface)', padding: 'clamp(48px, 8vw, 80px) clamp(16px, 5vw, 80px) clamp(24px, 4vw, 40px)', borderTop: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top grid — stacks to 2-col on mobile, 4-col on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(32px, 5vw, 48px)', marginBottom: 'clamp(40px, 6vw, 64px)' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ display: 'block', marginBottom: '12px', fontSize: '20px', fontWeight: 700, color: 'var(--brand-violet)' }}>
              Scribe Hub
            </span>
            <p className="text-text-secondary text-sm" style={{ maxWidth: '220px', lineHeight: 1.6 }}>
              Africa's first AI-native platform for learning, earning, and competing.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.background = 'rgba(123,47,255,0.15)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Product</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Courses', 'Games', 'Jobs', 'ARIA', 'Pricing'].map(l => (
                <li key={l}><a href="#" className="text-text-secondary text-sm hover:text-text-primary transition-colors" style={{ lineHeight: 1 }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map(l => (
                <li key={l}><a href="#" className="text-text-secondary text-sm hover:text-text-primary transition-colors" style={{ lineHeight: 1 }}>{l}</a></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p className="text-text-secondary" style={{ fontSize: '12px' }}>
            © 2026 Scribe Hub. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors" style={{ fontSize: '12px' }}>Privacy Policy</a>
            <a href="#" className="text-text-secondary hover:text-text-primary transition-colors" style={{ fontSize: '12px' }}>Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

// ============================================
// MAIN LANDING PAGE COMPONENT
// ============================================
export default function LandingPage() {
  useRevealAll();

  return (
    <div className="font-jakarta bg-bg-base min-h-screen">
      <LandingNav />
      <HeroSection />
      <SocialProofTicker />

      <EngineSection
        headline="Knowledge that pays. Literally."
        copy="15 courses. Real income. Every completed segment earns. From forex to freelancing — learn skills that the market actually rewards."
        cta="Explore Courses"
        icon={BookOpen}
        visual={<LearnVisual />}
      />
      <EngineSection
        headline="The smartest player wins. Always."
        copy="10 skill-based games. Merit-based earning. Your knowledge and speed translate directly into cash prizes."
        cta="See the Games"
        icon={Gamepad2}
        visual={<CompeteVisual />}
        reversed
      />
      <EngineSection
        headline="Your skills, matched. No CVs. No bias."
        copy="AI-powered marketplace. Matched by skill and fit. Applied and paid — all within the platform."
        cta="Browse Jobs"
        icon={Briefcase}
        visual={<WorkVisual />}
      />

      <AriaFeatureSection />
      <PricingSection />
      <Footer />

      <div className="fixed bottom-6 right-6 z-50">
        <AriaOrb />
      </div>

      <style>{`
        @media (max-width: 767px) {
          /* Prevent overflow */
          section { overflow-x: hidden !important; }
          /* Engine sections stack vertically */
          .engine-section-inner { flex-direction: column !important; }
          .engine-section-visual { width: 100% !important; min-width: 0 !important; }
          /* Pricing cards stack */
          .pricing-grid { grid-template-columns: 1fr !important; }
          /* Feature grids */
          .feature-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}