'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  Camera, User, MapPin, Zap, Link2, ArrowRight,
  ArrowLeft, Check, X, Upload, Globe, Clock,
  Twitter, Linkedin, Instagram, Github, Briefcase,
  GraduationCap, Lightbulb, Palette,
} from 'lucide-react';

/* ── CONSTANTS ── */
const SKILLS = [
  'JavaScript','Python','UI/UX Design','Data Analysis','Copywriting',
  'Excel / Sheets','Video Editing','Graphic Design','Trading','Marketing',
  'Product Management','Accounting','Photography','Content Writing','SEO',
  'Social Media','Public Speaking','Finance','Web Dev','Mobile Dev',
  'Blockchain','AI / ML','Sales','Customer Support','Animation',
];

const PERSONAS = [
  { id: 'student',       icon: GraduationCap, label: 'Student',       desc: 'Learning to build my future' },
  { id: 'professional',  icon: Briefcase,     label: 'Professional',  desc: 'Advancing my career & income' },
  { id: 'entrepreneur',  icon: Lightbulb,     label: 'Entrepreneur',  desc: 'Building something of my own' },
  { id: 'creator',       icon: Palette,       label: 'Creator',       desc: 'Creating content & art' },
];

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', tz: 'Africa/Lagos' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', tz: 'Africa/Accra' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', tz: 'Africa/Nairobi' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', tz: 'Africa/Johannesburg' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', tz: 'Europe/London' },
  { code: 'US', name: 'United States', flag: '🇺🇸', tz: 'America/New_York' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', tz: 'America/Toronto' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', tz: 'Australia/Sydney' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', tz: 'Europe/Berlin' },
  { code: 'FR', name: 'France', flag: '🇫🇷', tz: 'Europe/Paris' },
  { code: 'IN', name: 'India', flag: '🇮🇳', tz: 'Asia/Kolkata' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', tz: 'America/Sao_Paulo' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', tz: 'Africa/Dakar' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', tz: 'Africa/Dar_es_Salaam' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', tz: 'Africa/Kampala' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', tz: 'Africa/Abidjan' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', tz: 'Africa/Kigali' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', tz: 'Africa/Addis_Ababa' },
];

/* ── STEP INDICATOR ── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: '4px',
          width: i + 1 === current ? '24px' : i + 1 < current ? '16px' : '8px',
          borderRadius: '999px',
          background: i + 1 <= current ? 'var(--brand-violet)' : 'var(--bg-elevated)',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        }} />
      ))}
    </div>
  );
}

/* ── PHOTO UPLOAD ── */
function PhotoUpload({ value, onChange }: { value: string | null; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
    gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(123,47,255,0.5)', duration: 0.3 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div
        ref={ringRef}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); gsap.to(ringRef.current, { scale: 1.04, duration: 0.2 }); }}
        onDragLeave={() => gsap.to(ringRef.current, { scale: 1, duration: 0.2 })}
        onDrop={onDrop}
        style={{
          width: '160px', height: '160px', borderRadius: '50%',
          border: '2px dashed rgba(123,47,255,0.4)',
          background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
      >
        {value ? (
          <img src={value} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Camera style={{ width: '32px', height: '32px', color: 'var(--text-disabled)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-disabled)', textAlign: 'center', padding: '0 16px' }}>
              Drag or click to upload
            </span>
          </div>
        )}
        {value && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.6)', padding: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <Upload style={{ width: '12px', height: '12px', color: 'white' }} />
            <span style={{ fontSize: '11px', color: 'white' }}>Change</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        Supported: JPG, PNG, GIF · Max 5MB
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* form state */
  const [photo, setPhoto] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryList, setShowCountryList] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [persona, setPersona] = useState('');
  const [socials, setSocials] = useState({ twitter: '', linkedin: '', instagram: '', github: '' });

  const totalSteps = 5;

  /* animate between steps */
  const goStep = (next: number) => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, x: next > step ? -40 : 40, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        setStep(next);
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: next > step ? 40 : -40 },
          { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
        );
      },
    });
  };

  /* aurora background pulse */
  useEffect(() => {
    const orbs = document.querySelectorAll('.aurora-orb');
    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        x: `random(-60, 60)`, y: `random(-60, 60)`,
        duration: `random(8, 14)`, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: i * 2,
      });
    });
  }, []);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) :
      prev.length < 10 ? [...prev, skill] : prev
    );
  };

  const stepTitles = [
    { title: 'Your photo.', sub: 'Put a face to your name. First impressions matter.' },
    { title: 'Who are you?', sub: 'Tell the community a little about yourself.' },
    { title: 'Where are you?', sub: 'We\'ll personalise opportunities for your region.' },
    { title: 'What are your skills?', sub: 'Pick up to 10 — ARIA will use these to guide you.' },
    { title: 'Final touches.', sub: 'Tell us what describes you and link your socials.' },
  ];

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh', background: '#080810',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '24px',
      fontFamily: 'var(--font-base)',
    }}>
      {/* Aurora background */}
      <div className="aurora-orb" style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none',
      }} />
      <div className="aurora-orb" style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(204,255,0,0.06) 0%, transparent 70%)',
        bottom: '-80px', right: '-80px', pointerEvents: 'none',
      }} />
      <div className="aurora-orb" style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)',
        top: '40%', right: '20%', pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '520px', position: 'relative', zIndex: 10,
        background: 'rgba(13,13,20,0.9)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(123,47,255,0.15)', borderRadius: '24px',
        padding: '40px', boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <StepDots current={step} total={totalSteps} />
          <span style={{ fontSize: '12px', color: 'var(--text-disabled)', fontWeight: 500 }}>
            {step} / {totalSteps}
          </span>
        </div>

        {/* Step title */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800,
            color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '6px',
            fontFamily: 'var(--font-base)',
          }}>
            {stepTitles[step - 1].title}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {stepTitles[step - 1].sub}
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef}>

          {/* ── STEP 1: Photo ── */}
          {step === 1 && (
            <div>
              <PhotoUpload value={photo} onChange={setPhoto} />
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => goStep(2)}
                  style={{
                    padding: '8px 20px', borderRadius: '999px', fontSize: '13px',
                    fontWeight: 500, cursor: 'pointer', background: 'transparent',
                    color: 'var(--text-disabled)', border: '1px solid var(--border-subtle)',
                  }}
                >
                  Skip for now
                </button>
                <button
                  onClick={() => goStep(2)}
                  style={{
                    padding: '8px 24px', borderRadius: '999px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer',
                    background: photo ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)',
                    color: 'white', border: 'none',
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Name & Bio ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Display Name
                </label>
                <input className="input-field" placeholder="Your full name" value={displayName}
                  onChange={e => setDisplayName(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-disabled)', fontSize: '14px',
                  }}>@</span>
                  <input className="input-field" style={{ paddingLeft: '28px' }}
                    placeholder="yourhandle" value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bio</label>
                  <span style={{ fontSize: '11px', color: bio.length > 140 ? 'var(--error)' : 'var(--text-disabled)' }}>
                    {bio.length}/160
                  </span>
                </div>
                <textarea className="input-field" rows={3}
                  placeholder="Tell the community who you are..."
                  value={bio} onChange={e => setBio(e.target.value.slice(0, 160))}
                  style={{ resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => goStep(1)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                </button>
                <button onClick={() => { if (displayName.trim()) goStep(3); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: displayName ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Country ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  Country
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-disabled)' }} />
                  <input className="input-field" style={{ paddingLeft: '40px' }}
                    placeholder="Search country..."
                    value={country ? `${country.flag} ${country.name}` : countrySearch}
                    onFocus={() => { setShowCountryList(true); if (country) { setCountrySearch(''); setCountry(null); } }}
                    onChange={e => { setCountrySearch(e.target.value); setShowCountryList(true); }} />
                  {country && <Check style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--accent-lime)' }} />}
                </div>
                {showCountryList && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                    background: '#1A1A28', border: '1px solid var(--border-subtle)',
                    borderRadius: '12px', marginTop: '4px', maxHeight: '200px',
                    overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  }}>
                    {filteredCountries.map(c => (
                      <button key={c.code} onClick={() => { setCountry(c); setShowCountryList(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 14px', background: 'transparent', border: 'none',
                          cursor: 'pointer', color: 'var(--text-primary)', fontSize: '14px', textAlign: 'left',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(123,47,255,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: '18px' }}>{c.flag}</span>
                        <span>{c.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-disabled)' }}>{c.tz}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {country && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                  background: 'rgba(204,255,0,0.05)', borderRadius: '12px',
                  border: '1px solid rgba(204,255,0,0.15)',
                }}>
                  <Clock style={{ width: '16px', height: '16px', color: 'var(--accent-lime)' }} />
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Timezone detected</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{country.tz}</p>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => goStep(2)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                </button>
                <button onClick={() => goStep(4)}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: country ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Skills ── */}
          {step === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {selectedSkills.length}/10 selected
                </span>
                {selectedSkills.length === 10 && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-lime)', fontWeight: 600 }}>Max reached!</span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', maxHeight: '260px', overflowY: 'auto' }}>
                {SKILLS.map(skill => {
                  const sel = selectedSkills.includes(skill);
                  return (
                    <button key={skill} onClick={() => toggleSkill(skill)} style={{
                      padding: '7px 14px', borderRadius: '999px', fontSize: '13px',
                      fontWeight: sel ? 600 : 400, cursor: 'pointer', border: 'none',
                      background: sel ? 'var(--brand-violet)' : 'var(--bg-elevated)',
                      color: sel ? 'white' : 'var(--text-secondary)',
                      transform: sel ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.15s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: sel ? '0 0 16px rgba(123,47,255,0.4)' : 'none',
                    }}>
                      {sel && <Check style={{ width: '10px', height: '10px', display: 'inline', marginRight: '4px' }} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => goStep(3)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                </button>
                <button onClick={() => { if (selectedSkills.length > 0) goStep(5); }}
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', background: selectedSkills.length > 0 ? 'var(--brand-violet)' : 'rgba(123,47,255,0.3)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Persona + Socials ── */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  I best describe myself as...
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {PERSONAS.map(({ id, icon: Icon, label, desc }) => {
                    const sel = persona === id;
                    return (
                      <button key={id} onClick={() => setPersona(id)} style={{
                        padding: '14px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                        background: sel ? 'rgba(123,47,255,0.15)' : 'var(--bg-elevated)',
                        border: `1px solid ${sel ? 'var(--brand-violet)' : 'var(--border-subtle)'}`,
                        boxShadow: sel ? '0 0 20px rgba(123,47,255,0.2)' : 'none',
                        transition: 'all 0.2s',
                      }}>
                        <Icon style={{ width: '20px', height: '20px', color: sel ? 'var(--brand-light)' : 'var(--text-disabled)', marginBottom: '8px' }} />
                        <p style={{ fontSize: '13px', fontWeight: 600, color: sel ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '2px' }}>{label}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                  Social Links (optional)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'twitter', icon: Twitter, placeholder: 'twitter.com/yourhandle' },
                    { key: 'linkedin', icon: Linkedin, placeholder: 'linkedin.com/in/you' },
                    { key: 'instagram', icon: Instagram, placeholder: 'instagram.com/you' },
                    { key: 'github', icon: Github, placeholder: 'github.com/you' },
                  ].map(({ key, icon: Icon, placeholder }) => (
                    <div key={key} style={{ position: 'relative' }}>
                      <Icon style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text-disabled)' }} />
                      <input className="input-field" style={{ paddingLeft: '40px', fontSize: '13px' }}
                        placeholder={placeholder}
                        value={(socials as any)[key]}
                        onChange={e => setSocials(p => ({ ...p, [key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => goStep(4)} style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                  <ArrowLeft style={{ width: '14px', height: '14px' }} />
                </button>
                <button
                  onClick={() => router.push('/home')}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--brand-violet), #9333EA)',
                    color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                    boxShadow: '0 8px 24px rgba(123,47,255,0.4)',
                  }}>
                  🎉 Launch my profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}