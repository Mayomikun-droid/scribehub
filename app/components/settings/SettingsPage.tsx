'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { AppSidebar } from '../../components/layout/AppSidebar';
import {
  User, Wallet, Bell, Shield, Trash2, ChevronRight,
  Camera, Check, X, Eye, EyeOff, Moon, Globe,
  Smartphone, Mail, LogOut, AlertTriangle,
} from 'lucide-react';

const TABS = [
  { id: 'profile',   icon: User,    label: 'Profile' },
  { id: 'wallet',    icon: Wallet,  label: 'Wallet' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security',  icon: Shield,  label: 'Security' },
  { id: 'danger',    icon: Trash2,  label: 'Danger Zone' },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: '44px', height: '24px', borderRadius: '999px', cursor: 'pointer',
        background: value ? 'var(--brand-violet)' : 'var(--bg-elevated)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        border: `1px solid ${value ? 'var(--brand-violet)' : 'var(--border-subtle)'}`,
      }}
    >
      <div style={{
        position: 'absolute', top: '3px',
        left: value ? 'calc(100% - 21px)' : '3px',
        width: '16px', height: '16px', borderRadius: '50%',
        background: value ? 'white' : 'var(--text-disabled)',
        transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
      gap: '16px',
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: desc ? '2px' : 0 }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px', padding: '24px', marginBottom: '20px',
    }}>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{title}</h3>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '12px' }}>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const contentRef = useRef<HTMLDivElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* notification toggles */
  const [notifs, setNotifs] = useState({
    courseUpdates: true, gameAlerts: true, jobMatches: true,
    earnings: true, weeklyDigest: false, marketing: false,
    pushEnabled: true, emailEnabled: true, smsEnabled: false,
  });

  /* security */
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  /* danger */
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const switchTab = (tab: string) => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, x: 20, duration: 0.15, ease: 'power2.in',
      onComplete: () => {
        setActiveTab(tab);
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }
        );
      },
    });
  };

  const handlePhotoFile = (file: File) => {
    const r = new FileReader();
    r.onload = e => setPhoto(e.target?.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'var(--font-base)' }}>
      <AppSidebar />

      {/* Main */}
      <div style={{ flex: 1, marginLeft: '220px', padding: '40px 48px', maxWidth: '900px' }}
        className="main-content">

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage your account, wallet, and preferences.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar tabs */}
          <div style={{ width: '180px', flexShrink: 0, position: 'sticky', top: '40px' }}>
            {TABS.map(({ id, icon: Icon, label }) => {
              const active = activeTab === id;
              const isDanger = id === 'danger';
              return (
                <button key={id} onClick={() => switchTab(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px', marginBottom: '4px',
                  background: active ? (isDanger ? 'rgba(239,68,68,0.1)' : 'rgba(123,47,255,0.12)') : 'transparent',
                  border: active ? `1px solid ${isDanger ? 'rgba(239,68,68,0.3)' : 'rgba(123,47,255,0.25)'}` : '1px solid transparent',
                  color: active ? (isDanger ? '#EF4444' : 'var(--brand-light)') : (isDanger ? '#EF4444' : 'var(--text-secondary)'),
                  cursor: 'pointer', fontSize: '14px', fontWeight: active ? 600 : 400, textAlign: 'left',
                  transition: 'all 0.15s',
                }}>
                  <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div ref={contentRef} style={{ flex: 1 }}>

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div>
                <SectionCard title="Profile Photo">
                  <div style={{ paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
                      <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--brand-violet), #9333EA)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', fontWeight: 800, color: 'white', overflow: 'hidden',
                      }}>
                        {photo ? <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'T'}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px',
                        borderRadius: '50%', background: 'var(--brand-violet)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--bg-base)',
                      }}>
                        <Camera style={{ width: '10px', height: '10px', color: 'white' }} />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Temi Adeyemi</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>JPG, PNG or GIF · Max 5MB</p>
                      <button onClick={() => inputRef.current?.click()} style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                        background: 'rgba(123,47,255,0.1)', color: 'var(--brand-light)',
                        border: '1px solid rgba(123,47,255,0.25)', cursor: 'pointer',
                      }}>Upload new photo</button>
                    </div>
                    <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }} />
                  </div>
                </SectionCard>

                <SectionCard title="Personal Info">
                  <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'Display Name', value: 'Temi Adeyemi', placeholder: 'Your name' },
                      { label: 'Username', value: '@temiadeyemi', placeholder: '@handle' },
                      { label: 'Email', value: 'temi@email.com', placeholder: 'email' },
                      { label: 'Bio', value: 'Learning, competing, earning.', placeholder: 'Your bio', multiline: true },
                    ].map(({ label, value, placeholder, multiline }) => (
                      <div key={label}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{label}</label>
                        {multiline ? (
                          <textarea className="input-field" defaultValue={value} rows={2} style={{ resize: 'none' }} />
                        ) : (
                          <input className="input-field" defaultValue={value} placeholder={placeholder} />
                        )}
                      </div>
                    ))}
                    <button style={{
                      padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                      background: 'var(--brand-violet)', color: 'white', border: 'none', cursor: 'pointer',
                      marginTop: '4px',
                    }}>Save Changes</button>
                  </div>
                </SectionCard>

                <SectionCard title="Social Links">
                  <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map(s => (
                      <input key={s} className="input-field" placeholder={`${s} URL`} style={{ fontSize: '13px' }} />
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── WALLET ── */}
            {activeTab === 'wallet' && (
              <div>
                <SectionCard title="Current Setup">
                  <SettingRow label="Home Currency" desc="Nigerian Naira (₦)">
                    <button onClick={() => router.push('/wallet/setup')} style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(123,47,255,0.1)', color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.25)', cursor: 'pointer' }}>Change</button>
                  </SettingRow>
                  <SettingRow label="Linked Bank" desc="Access Bank · ****7890">
                    <button style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(123,47,255,0.1)', color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.25)', cursor: 'pointer' }}>Update</button>
                  </SettingRow>
                  <SettingRow label="ID Verification" desc="Under review">
                    <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600, background: 'rgba(245,158,11,0.1)', padding: '4px 10px', borderRadius: '999px' }}>Pending</span>
                  </SettingRow>
                </SectionCard>
                <SectionCard title="Payout Settings">
                  <SettingRow label="Auto-withdraw" desc="Automatically withdraw when balance hits ₦50,000">
                    <Toggle value={false} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="Minimum payout threshold" desc="₦5,000">
                    <button style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'rgba(123,47,255,0.1)', color: 'var(--brand-light)', border: '1px solid rgba(123,47,255,0.25)', cursor: 'pointer' }}>Edit</button>
                  </SettingRow>
                </SectionCard>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <div>
                <SectionCard title="Delivery Method">
                  <SettingRow label="Push Notifications" desc="In-app and mobile">
                    <Toggle value={notifs.pushEnabled} onChange={v => setNotifs(p => ({ ...p, pushEnabled: v }))} />
                  </SettingRow>
                  <SettingRow label="Email Notifications">
                    <Toggle value={notifs.emailEnabled} onChange={v => setNotifs(p => ({ ...p, emailEnabled: v }))} />
                  </SettingRow>
                  <SettingRow label="SMS Notifications" desc="Standard rates may apply">
                    <Toggle value={notifs.smsEnabled} onChange={v => setNotifs(p => ({ ...p, smsEnabled: v }))} />
                  </SettingRow>
                </SectionCard>

                <SectionCard title="What to Notify Me About">
                  <SettingRow label="Course updates" desc="New lessons, certificate earned">
                    <Toggle value={notifs.courseUpdates} onChange={v => setNotifs(p => ({ ...p, courseUpdates: v }))} />
                  </SettingRow>
                  <SettingRow label="Game challenges" desc="New competitions, results">
                    <Toggle value={notifs.gameAlerts} onChange={v => setNotifs(p => ({ ...p, gameAlerts: v }))} />
                  </SettingRow>
                  <SettingRow label="Job matches" desc="When new jobs match your profile">
                    <Toggle value={notifs.jobMatches} onChange={v => setNotifs(p => ({ ...p, jobMatches: v }))} />
                  </SettingRow>
                  <SettingRow label="Earnings & withdrawals" desc="Payments received, withdrawals processed">
                    <Toggle value={notifs.earnings} onChange={v => setNotifs(p => ({ ...p, earnings: v }))} />
                  </SettingRow>
                  <SettingRow label="Weekly digest" desc="Your weekly performance summary">
                    <Toggle value={notifs.weeklyDigest} onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
                  </SettingRow>
                  <SettingRow label="Marketing & promotions">
                    <Toggle value={notifs.marketing} onChange={v => setNotifs(p => ({ ...p, marketing: v }))} />
                  </SettingRow>
                </SectionCard>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <div>
                <SectionCard title="Change Password">
                  <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <input className="input-field" type={showOld ? 'text' : 'password'}
                        placeholder="Current password" value={oldPw} onChange={e => setOldPw(e.target.value)} style={{ paddingRight: '44px' }} />
                      <button type="button" onClick={() => setShowOld(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}>
                        {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input className="input-field" type={showNew ? 'text' : 'password'}
                        placeholder="New password" value={newPw} onChange={e => setNewPw(e.target.value)} style={{ paddingRight: '44px' }} />
                      <button type="button" onClick={() => setShowNew(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-disabled)' }}>
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button style={{ padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', background: 'var(--brand-violet)', color: 'white', border: 'none', cursor: 'pointer' }}>
                      Update Password
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Two-Factor Authentication">
                  <SettingRow label="Enable 2FA" desc="Secure your account with an authenticator app">
                    <Toggle value={twoFA} onChange={setTwoFA} />
                  </SettingRow>
                  {twoFA && (
                    <div style={{
                      marginTop: '16px', padding: '16px', borderRadius: '12px',
                      background: 'rgba(123,47,255,0.06)', border: '1px solid rgba(123,47,255,0.15)',
                    }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Scan the QR code with Google Authenticator or Authy to set up 2FA. (QR setup coming soon)
                      </p>
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Active Sessions">
                  {[
                    { device: 'Chrome · Windows', location: 'Lagos, NG', time: 'Now', current: true },
                    { device: 'Safari · iPhone 14', location: 'Lagos, NG', time: '2 hours ago', current: false },
                  ].map((session, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Smartphone style={{ width: '16px', height: '16px', color: 'var(--text-disabled)' }} />
                        <div>
                          <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {session.device}
                            {session.current && <span style={{ marginLeft: '8px', fontSize: '10px', background: 'rgba(204,255,0,0.1)', color: 'var(--accent-lime)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Current</span>}
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--text-disabled)' }}>{session.location} · {session.time}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', cursor: 'pointer' }}>
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}

            {/* ── DANGER ZONE ── */}
            {activeTab === 'delete' && (
              <div>
                <div style={{
                  padding: '20px', borderRadius: '16px', marginBottom: '20px',
                  background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}>
                  <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#EF4444', marginBottom: '4px' }}>DELETE MY ACCOUNT</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Actions here are irreversible. Please proceed with extreme caution.
                    </p>
                  </div>
                </div>

                <SectionCard title="Sign Out">
                  <div style={{ paddingTop: '12px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Sign out of your account on this device.
                    </p>
                    <button onClick={() => router.push('/sign-in')} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                      background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)', cursor: 'pointer',
                    }}>
                      <LogOut style={{ width: '16px', height: '16px' }} /> Sign Out
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Delete Account">
                  <div style={{ paddingTop: '12px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                      Permanently delete your account and all associated data including earnings history, course progress, and wallet. This <strong style={{ color: 'var(--text-primary)' }}>cannot be undone</strong>.
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Type <strong style={{ color: '#EF4444' }}>DELETE MY ACCOUNT</strong> to confirm:
                    </p>
                    <input className="input-field" placeholder="DELETE MY ACCOUNT"
                      value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                      style={{ marginBottom: '12px', borderColor: deleteConfirm === 'DELETE MY ACCOUNT' ? '#EF4444' : undefined }} />
                    <button
                      disabled={deleteConfirm !== 'DELETE MY ACCOUNT'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                        background: deleteConfirm === 'DELETE MY ACCOUNT' ? '#EF4444' : 'rgba(239,68,68,0.1)',
                        color: deleteConfirm === 'DELETE MY ACCOUNT' ? 'white' : '#EF4444',
                        border: 'none', cursor: deleteConfirm === 'DELETE MY ACCOUNT' ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                      }}>
                      <Trash2 style={{ width: '16px', height: '16px' }} /> Delete My Account Forever
                    </button>
                  </div>
                </SectionCard>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile padding for bottom nav */}
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding: 24px 16px 100px !important; }
        }
      `}</style>
    </div>
  );
}