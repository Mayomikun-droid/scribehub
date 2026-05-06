'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  BookOpen, Gamepad2, Briefcase, Sparkles,
  ChevronRight, Copy, Check, ArrowRight,
} from 'lucide-react';

const HEAR_OPTIONS = [
  'Twitter / X', 'Instagram', 'LinkedIn', 'Friend or colleague',
  'Google search', 'YouTube', 'Other',
];

const GOAL_CARDS = [
  { id: 'learn', icon: BookOpen, label: 'I want to Learn', desc: 'Master new skills with AI-guided courses' },
  { id: 'compete', icon: Gamepad2, label: 'I want to Compete', desc: 'Win cash prizes in skill-based games' },
  { id: 'earn', icon: Briefcase, label: 'I want to Earn', desc: 'Get matched to real paying gigs' },
  { id: 'all', icon: Sparkles, label: 'All of the above', desc: 'The full Scribe Hub experience' },
];

/* -- 3D Model -- */
function WindyDayModel() {
  const { scene } = useGLTF('/a_windy_day.glb');
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}

function WindyDayScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 45 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Violet ambient glow */}
      <ambientLight intensity={0.5} color="#7B2FFF" />
      <pointLight position={[0, 3, 2]} intensity={1.5} color="#9D4EDD" />
      <pointLight position={[-4, 0, -2]} intensity={0.8} color="#C084FC" />
      <pointLight position={[4, -1, 2]} intensity={0.6} color="#7B2FFF" />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />

      <Suspense fallback={null}>
        <WindyDayModel />
        <Environment preset="sunset" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
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
            width: '76%', height: '6px',
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
        padding: '0 20px', height: '64px',
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
        <Button variant="secondary" onClick={() => router.push('/')}>← Back</Button>
      </nav>

      {/* Main content */}
      <div style={{
        paddingTop: '64px', // flush with nav, canvas handles its own space
        maxWidth: '1400px', margin: '0 auto',
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        minHeight: '100vh',
      }}>

        {/* ========== LEFT — Free-floating 3D scene ========== */}
        <div style={{
          flex: '1 1 400px',
          position: 'relative',
          minHeight: '500px',
        }}>
          {/* Violet radial glow behind the model */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, rgba(123,47,255,0.35) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 30% 60%, rgba(192,132,252,0.18) 0%, transparent 60%)
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Canvas — fills entire left column, transparent bg */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <WindyDayScene />
          </div>

          {/* Drag hint — fades in */}
          <div style={{
            position: 'absolute', bottom: '32px', left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2, pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(10,10,15,0.5)', backdropFilter: 'blur(8px)',
            borderRadius: '20px', padding: '6px 14px',
            border: '1px solid rgba(123,47,255,0.3)',
            animation: 'fadeHint 2s ease 1.5s both',
          }}>
            <span style={{ fontSize: '14px' }}>✦</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Drag to explore
            </span>
          </div>
        </div>

        {/* ========== RIGHT — Form ========== */}
        <div style={{
          flex: '1 1 340px', minWidth: 0, maxWidth: '480px',
          padding: 'clamp(16px, 4vw, 56px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>

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

          {/* STEP 3 */}
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

      <style>{`
        @keyframes fadeHint {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }
        @media (max-width: 767px) {
          .editorial-word { font-size: clamp(36px, 10vw, 56px) !important; }
        }
      `}</style>
    </div>
  );
}