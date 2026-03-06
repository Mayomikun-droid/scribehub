'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { AriaCharacter } from '../../components/ui/AriaCharacter';
import {
  BookOpen, Gamepad2, Briefcase, Sparkles,
  Check, ArrowRight, Eye, EyeOff,
} from 'lucide-react';

/* ============================================
   SIGN UP PAGE — Free account creation
   Same flow as waitlist but no pricing card
   ============================================ */

const HEAR_OPTIONS = [
  'Twitter / X', 'Instagram', 'LinkedIn',
  'Friend or colleague', 'Google search', 'YouTube', 'Other',
];

const GOAL_CARDS = [
  { id: 'learn',   icon: BookOpen,  label: 'I want to Learn',    desc: 'Master new skills with AI-guided courses' },
  { id: 'compete', icon: Gamepad2,  label: 'I want to Compete',  desc: 'Win cash prizes in skill-based games' },
  { id: 'earn',    icon: Briefcase, label: 'I want to Earn',     desc: 'Get matched to real paying gigs' },
  { id: 'all',     icon: Sparkles,  label: 'All of the above',   desc: 'The full Scribe Hub experience' },
];

/* -- Password strength -- */
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const colors = ['#EF4444', '#F59E0B', '#EAB308', '#CCFF00'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: '4px', borderRadius: '999px',
              background: i < strength ? colors[strength - 1] : 'var(--bg-elevated)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <p style={{ fontSize: '11px', color: colors[strength - 1] }}>
          {labels[strength - 1]}
        </p>
      )}
    </div>
  );
}

/* -- Animated Editorial Words -- */
function EditorialWords() {
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordsRef.current) return;
    const words = wordsRef.current.querySelectorAll('.editorial-word');
    gsap.from(words, {
      y: 100, opacity: 0, duration: 0.8, stagger: 0.2,
      ease: 'power3.out', delay: 0.3,
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
            display: 'block', lineHeight: 1.05,
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

/* -- Social Proof -- */
function SocialProof() {
  return (
    <div className="flex items-center gap-3" style={{ marginTop: '32px' }}>
      <div className="flex" style={{ gap: 0 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-2" style={{
            background: `hsl(${260 + i * 20}, 60%, ${50 + i * 5}%)`,
            zIndex: 5 - i, marginLeft: i === 0 ? 0 : '-8px',
            borderColor: 'var(--bg-base)',
          }} />
        ))}
      </div>
      <span className="text-text-secondary text-sm">
        <span className="text-text-primary font-semibold">1,200+</span> learners already in
      </span>
    </div>
  );
}

/* ============================================
   MAIN SIGN UP PAGE
   ============================================ */
export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', source: '' });
  const [goals, setGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.source) errs.source = 'Please select an option';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => { if (validate1()) setStep(2); };
  const handleCreate = () => {
    if (goals.length === 0) { setErrors({ goals: 'Pick at least one option' }); return; }
    setErrors({});
    setStep(3);
  };
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    setErrors({});
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
        <button onClick={() => router.push('/')} style={{
          fontSize: '20px', fontWeight: 700, color: 'var(--brand-violet)',
          fontFamily: 'var(--font-base)', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          Scribe Hub
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="text-text-secondary text-sm">Already have an account?</span>
          <Button variant="secondary" onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </nav>

      {/* Main layout */}
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
              FREE.
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(204,255,0,0.08)', border: '1px solid rgba(204,255,0,0.2)',
                borderRadius: '999px', padding: '6px 14px', marginBottom: '24px',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CCFF00' }} />
                <span style={{ color: '#CCFF00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
                  Free account — no credit card needed
                </span>
              </div>

              <EditorialWords />

              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body-lg)', marginBottom: '16px', maxWidth: '400px' }}>
                Join free. Learn real skills. Compete for cash. Get matched to jobs.
              </p>

              {/* Free vs Founding comparison */}
              <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: '12px', padding: '20px', marginBottom: '32px', maxWidth: '400px',
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  Free account includes
                </p>
                {[
                  { text: '3 starter courses', included: true },
                  { text: 'Limited game access', included: true },
                  { text: 'Basic job matching', included: true },
                  { text: 'ARIA — limited interactions', included: true },
                  { text: 'Full ARIA (unlock anytime)', included: false },
                  { text: 'All 15 courses + earn per segment', included: false },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: item.included ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.05)',
                    }}>
                      {item.included
                        ? <Check style={{ width: '10px', height: '10px', color: '#CCFF00' }} />
                        : <span style={{ color: 'var(--text-disabled)', fontSize: '10px' }}>✕</span>
                      }
                    </div>
                    <span style={{
                      fontSize: '13px',
                      color: item.included ? 'var(--text-primary)' : 'var(--text-disabled)',
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => router.push('/waitlist')}
                  style={{
                    marginTop: '12px', width: '100%', padding: '10px',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    background: 'rgba(123,47,255,0.1)', color: 'var(--brand-light)',
                    border: '1px solid rgba(123,47,255,0.3)',
                  }}
                >
                  Want full access? Join the waitlist →
                </button>
              </div>

              <AriaCharacter size="md" interactive={true} />
              <SocialProof />
            </div>
          </div>

          {/* ========== RIGHT COLUMN ========== */}
          <div style={{ width: '480px', flexShrink: 0 }}>

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                    background: step >= s ? 'var(--brand-violet)' : 'var(--bg-elevated)',
                    color: step >= s ? 'white' : 'var(--text-disabled)',
                    transition: 'all 0.3s',
                  }}>
                    {step > s ? <Check style={{ width: '12px', height: '12px' }} /> : s}
                  </div>
                  {s < 3 && (
                    <div style={{
                      width: '40px', height: '2px', borderRadius: '999px',
                      background: step > s ? 'var(--brand-violet)' : 'var(--bg-elevated)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                </div>
              ))}
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px', marginLeft: '8px' }}>
                Step {step} of 3
              </span>
            </div>

            {/* STEP 1 — Account details */}
            {step === 1 && (
              <div ref={step1Ref}>
                <Card variant="glass" style={{ padding: '40px' }}>
                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    Create your account.
                  </h2>
                  <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
                    Free forever. Upgrade anytime.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Full Name */}
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Full Name</label>
                      <input
                        className={`input-field ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      />
                      {errors.name && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Email Address</label>
                      <input
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                      />
                      {errors.email && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className={`input-field ${errors.password ? 'error' : ''}`}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 8 characters"
                          value={formData.password}
                          style={{ paddingRight: '48px' }}
                          onChange={e => { setFormData(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })); }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={formData.password} />
                      {errors.password && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Repeat your password"
                          value={formData.confirmPassword}
                          style={{ paddingRight: '48px' }}
                          onChange={e => { setFormData(p => ({ ...p, confirmPassword: e.target.value })); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(p => !p)}
                          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
                    </div>

                    {/* How did you hear */}
                    <div>
                      <label className="block text-text-secondary text-xs font-semibold uppercase tracking-wider" style={{ marginBottom: '8px' }}>How did you hear about us?</label>
                      <select
                        className={`input-field ${errors.source ? 'error' : ''}`}
                        value={formData.source}
                        onChange={e => { setFormData(p => ({ ...p, source: e.target.value })); setErrors(p => ({ ...p, source: '' })); }}
                        style={{
                          color: formData.source ? 'var(--text-primary)' : 'var(--text-disabled)',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B7BA8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', paddingRight: 40,
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

                  <Button
                    variant="earn"
                    className="w-full"
                    style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={handleContinue}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-disabled)' }}>
                    By creating an account you agree to our{' '}
                    <a href="#" style={{ color: 'var(--brand-light)' }}>Terms</a> and{' '}
                    <a href="#" style={{ color: 'var(--brand-light)' }}>Privacy Policy</a>
                  </p>
                </Card>
              </div>
            )}

            {/* STEP 2 — Goals */}
            {step === 2 && (
              <div ref={step2Ref}>
                <Card variant="glass" style={{ padding: '40px' }}>
                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    What brings you here?
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

                  <Button
                    variant="earn"
                    className="w-full"
                    style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={handleCreate}
                  >
                    Create My Account <Sparkles className="w-4 h-4" />
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

            {/* STEP 3 — Success */}
            {step === 3 && (
              <div ref={step3Ref}>
                <Card variant="glass" style={{ padding: '40px', textAlign: 'center' }}>
                  <AnimatedCheck />

                  <h2 className="font-extrabold text-text-primary" style={{ fontSize: 'var(--text-h2)', marginBottom: '8px' }}>
                    Welcome to Scribe Hub.
                  </h2>
                  <p className="text-text-secondary" style={{ marginBottom: '4px' }}>
                    Your free account is ready, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formData.name.split(' ')[0]}</span>.
                  </p>
                  <p className="text-text-secondary text-sm" style={{ marginBottom: '32px' }}>
                    We've sent a verification email to{' '}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formData.email}</span>.
                  </p>

                  {/* What you unlocked */}
                  <div style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left',
                  }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                      You've unlocked
                    </p>
                    {['3 starter courses', 'Limited game access', 'Basic job matching', 'ARIA — limited interactions'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(204,255,0,0.1)',
                        }}>
                          <Check style={{ width: '10px', height: '10px', color: '#CCFF00' }} />
                        </div>
                        <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}
                    onClick={() => router.push('/sign-in')}
                  >
                    Sign In to Your Account <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button
                    onClick={() => router.push('/waitlist')}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px', fontSize: '13px',
                      fontWeight: 600, cursor: 'pointer', background: 'rgba(123,47,255,0.08)',
                      color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.2)',
                    }}
                  >
                    Want full access? Join the founding waitlist →
                  </button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}