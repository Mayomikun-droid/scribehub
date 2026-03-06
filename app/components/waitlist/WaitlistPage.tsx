'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AriaCharacter } from '../../components/ui/AriaCharacter';
import {
  BookOpen, Gamepad2, Briefcase, Sparkles,
  ChevronRight, Copy, Check, ArrowRight,
} from 'lucide-react';

/* ============================================
   WAITLIST PAGE — Multi-step form
   ============================================ */

const HEAR_OPTIONS = [
  'Twitter / X',
  'Instagram',
  'LinkedIn',
  'Friend or colleague',
  'Google search',
  'YouTube',
  'Other',
];

const GOAL_CARDS = [
  { id: 'learn', icon: BookOpen, label: 'I want to Learn', desc: 'Master new skills with AI-guided courses' },
  { id: 'compete', icon: Gamepad2, label: 'I want to Compete', desc: 'Win cash prizes in skill-based games' },
  { id: 'earn', icon: Briefcase, label: 'I want to Earn', desc: 'Get matched to real paying gigs' },
  { id: 'all', icon: Sparkles, label: 'All of the above', desc: 'The full Scribe Hub experience' },
];

/* -- Animated Editorial Words -- */
function EditorialWords() {
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordsRef.current) return;
    const words = wordsRef.current.querySelectorAll('.editorial-word');
    gsap.from(words, {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.3,
    });
  }, []);

  return (
    <div ref={wordsRef} style={{ marginBottom: '24px' }}>
      {['LEARN.', 'COMPETE.', 'EARN.'].map((word, i) => (
        <h1
          key={i}
          className="editorial-word font-extrabold leading-none tracking-tight"
          style={{
            fontSize: 'clamp(48px, 7vw, 80px)',
            color: i === 2 ? 'var(--accent-lime)' : 'var(--text-primary)',
            display: 'block',
            lineHeight: 1.05,
          }}
        >
          {word}
        </h1>
      ))}
    </div>
  );
}

/* -- Animated Check Mark -- */
function AnimatedCheck() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const path = svgRef.current.querySelector('.check-path') as SVGPathElement;
    const circle = svgRef.current.querySelector('.check-circle') as SVGCircleElement;
    if (!path || !circle) return;

    const pathLen = path.getTotalLength();
    const circleLen = circle.getTotalLength();

    gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
    gsap.set(circle, { strokeDasharray: circleLen, strokeDashoffset: circleLen });

    gsap.to(circle, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.5, delay: 0.6, ease: 'power2.out' });
  }, []);

  return (
    <svg ref={svgRef} width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-6">
      <circle className="check-circle" cx="40" cy="40" r="36" stroke="#CCFF00" strokeWidth="3" />
      <path className="check-path" d="M24 42 L34 52 L56 30" stroke="#CCFF00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* -- Social Proof Avatars -- */
function SocialProof() {
  return (
    <div className="flex items-center gap-3" style={{ marginTop: '32px' }}>
      <div className="flex" style={{ gap: 0 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2"
            style={{
              background: `hsl(${260 + i * 20}, 60%, ${50 + i * 5}%)`,
              zIndex: 5 - i,
              marginLeft: i === 0 ? 0 : '-8px',
              borderColor: 'var(--bg-base)',
            }}
          />
        ))}
      </div>
      <span className="text-text-secondary text-sm">
        <span className="text-text-primary font-semibold">1,200+</span> learners waiting
      </span>
    </div>
  );
}

/* -- Progress Bar -- */
function SpotProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    gsap.from(barRef.current, { width: '0%', duration: 1.5, ease: 'power2.out', delay: 0.3 });
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="flex justify-between text-xs" style={{ marginBottom: '6px' }}>
        <span className="text-text-secondary">Founding spots</span>
        <span className="text-brand-light font-semibold">47 remaining</span>
      </div>
      <div className="rounded-full" style={{ background: 'var(--bg-elevated)', height: '6px' }}>
        <div
          ref={barRef}
          className="rounded-full"
          style={{
            width: '76%',
            height: '6px',
            background: 'linear-gradient(90deg, var(--brand-violet), var(--brand-light))',
          }}
        />
      </div>
    </div>
  );
}

/* ============================================
   MAIN WAITLIST PAGE
   ============================================ */
export default function WaitlistPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', source: '' });
  const [goals, setGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [referralLink] = useState(
    'https://scribehub.co/ref/SH-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  );

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  /* Animate step transitions */
  useEffect(() => {
    const refs = [step1Ref, step2Ref, step3Ref];
    const current = refs[step - 1]?.current;
    if (!current) return;
    gsap.fromTo(current,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [step]);

  const validate1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.source) errs.source = 'Please select an option';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => { if (validate1()) setStep(2); };
  const handleClaim = () => {
    if (goals.length === 0) { setErrors({ goals: 'Pick at least one option' }); return; }
    setErrors({});
    setStep(3);
  };
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    setErrors({});
  };
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          ← Back
        </Button>
      </nav>

      {/* Main content */}
      <div style={{ paddingTop: '100px', paddingBottom: '80px', paddingLeft: '64px', paddingRight: '64px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '80px', alignItems: 'flex-start' }}>

          {/* ========== LEFT COLUMN ========== */}
          <div style={{ flex: 1, position: 'sticky', top: '100px' }}>
            {/* Watermark */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              fontSize: 'clamp(120px, 18vw, 260px)', fontWeight: 900,
              lineHeight: 0.85, color: 'rgba(123,47,255,0.04)',
              letterSpacing: '-0.04em', pointerEvents: 'none', userSelect: 'none',
            }}>
              EARN.
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              <EditorialWords />

              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body-lg)', marginBottom: '40px', maxWidth: '400px' }}>
                The future of earning starts here.
              </p>

              {/* ARIA Character */}
              <AriaCharacter size="md" interactive={true} />

              <SocialProof />
            </div>
          </div>

          {/* ========== RIGHT COLUMN — Form ========== */}
          <div style={{ width: '480px', flexShrink: 0 }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div ref={step1Ref}>
                <Card variant="glass" style={{ padding: '40px' }}>
                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    Claim your spot.
                  </h2>
                  <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
                    Join the founding members shaping Africa's earning future.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>
                        Full Name
                      </label>
                      <input
                        className={`input-field ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      />
                      {errors.name && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>
                        Email Address
                      </label>
                      <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                      />
                      {errors.email && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>
                        How did you hear about us?
                      </label>
                      <select
                        className={`input-field ${errors.source ? 'error' : ''}`}
                        value={formData.source}
                        onChange={e => { setFormData(p => ({ ...p, source: e.target.value })); setErrors(p => ({ ...p, source: '' })); }}
                        style={{
                          color: formData.source ? 'var(--text-primary)' : 'var(--text-disabled)',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B7BA8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          paddingRight: 40,
                        }}
                      >
                        <option value="" disabled>Select an option</option>
                        {HEAR_OPTIONS.map(o => (
                          <option key={o} value={o} style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>{o}</option>
                        ))}
                      </select>
                      {errors.source && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.source}</p>}
                    </div>
                  </div>

                  <Button variant="earn" className="w-full" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleContinue}>
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>

                  <SpotProgress />
                </Card>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div ref={step2Ref}>
                <Card variant="glass" style={{ padding: '40px' }}>
                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    What brings you to Scribe Hub?
                  </h2>
                  <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
                    Pick one or more — we'll personalise your experience.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {GOAL_CARDS.map(({ id, icon: Icon, label, desc }) => {
                      const selected = goals.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggleGoal(id)}
                          style={{
                            textAlign: 'left', padding: '16px', borderRadius: '12px',
                            border: `1px solid ${selected ? 'var(--brand-violet)' : 'var(--border-subtle)'}`,
                            background: selected ? 'rgba(123,47,255,0.1)' : 'var(--bg-elevated)',
                            boxShadow: selected ? '0 0 20px rgba(123,47,255,0.15)' : 'none',
                            cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '8px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: selected ? 'rgba(123,47,255,0.25)' : 'rgba(123,47,255,0.1)',
                            }}>
                              <Icon className="w-4 h-4" style={{ color: selected ? '#C084FC' : '#8B7BA8' }} />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '14px', color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                              {label}
                            </span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', paddingLeft: '48px' }}>{desc}</p>
                          {selected && (
                            <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                              <Check className="w-4 h-4" style={{ color: '#C084FC' }} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {errors.goals && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>{errors.goals}</p>}

                  <Button variant="earn" className="w-full" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleClaim}>
                    Claim My Spot <Sparkles className="w-4 h-4" />
                  </Button>

                  <button
                    style={{ width: '100%', marginTop: '12px', color: 'var(--text-secondary)', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    onClick={() => setStep(1)}
                  >
                    ← Go back
                  </button>
                </Card>
              </div>
            )}

            {/* STEP 3 — Confirmation */}
            {step === 3 && (
              <div ref={step3Ref}>
                <Card variant="glass" style={{ padding: '40px', textAlign: 'center' }}>
                  <AnimatedCheck />

                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    You're in.
                  </h2>
                  <p className="text-text-secondary" style={{ marginBottom: '4px' }}>
                    You're <span style={{ color: 'var(--brand-light)', fontWeight: 700 }}>#1,248</span> on the waitlist.
                  </p>
                  <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
                    We've sent your login details to <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formData.email}</span>.
                  </p>

                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>
                      Move up the queue — share your link
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="input-field flex-1" style={{ fontSize: '12px' }} value={referralLink} readOnly />
                      <button
                        onClick={copyLink}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '0 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                          background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(123,47,255,0.15)',
                          color: copied ? 'var(--success)' : 'var(--brand-light)',
                          border: 'none', cursor: 'pointer',
                        }}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => router.push('/waitlist/confirmed')}
                  >
                    See what's coming <ChevronRight className="w-4 h-4" />
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}