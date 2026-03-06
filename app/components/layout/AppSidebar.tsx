'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, LayoutDashboard, BookOpen, Gamepad2,
  Briefcase, Wallet, Sparkles, Settings,
  ChevronRight, LogOut, Menu, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home,            label: 'Home',      href: '/home' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen,        label: 'Courses',   href: '/courses' },
  { icon: Gamepad2,        label: 'Games',     href: '/games' },
  { icon: Briefcase,       label: 'Jobs',      href: '/jobs' },
  { icon: Wallet,          label: 'Wallet',    href: '/wallet' },
  { icon: Sparkles,        label: 'ARIA',      href: '/aria' },
  { icon: Settings,        label: 'Settings',  href: '/settings' },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* ══ DESKTOP SIDEBAR ══ */}
      {!isMobile && (
        <aside style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: collapsed ? '72px' : '220px',
          background: '#0D0D14',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column',
          zIndex: 40,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <div onClick={() => router.push('/')} style={{
            height: '64px', display: 'flex', alignItems: 'center',
            padding: collapsed ? '0 20px' : '0 24px',
            borderBottom: '1px solid var(--border-subtle)',
            cursor: 'pointer', flexShrink: 0, gap: '10px',
          }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: 'var(--brand-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white' }}>S</div>
            {!collapsed && <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Scribe Hub</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <button key={href} onClick={() => router.push(href)} style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '12px', padding: collapsed ? '10px 12px' : '10px 14px',
                  borderRadius: '10px', marginBottom: '2px',
                  background: active ? 'rgba(123,47,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(123,47,255,0.3)' : '1px solid transparent',
                  color: active ? 'var(--brand-light)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  {!collapsed && <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
                  {active && !collapsed && <ChevronRight style={{ width: '14px', height: '14px', marginLeft: 'auto', opacity: 0.6 }} />}
                </button>
              );
            })}
          </nav>

          {/* User + collapse */}
          <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            {!collapsed && (
              <div onClick={() => router.push('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-elevated)', marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--brand-violet), var(--accent-lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>T</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Temi Adeyemi</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Free plan</p>
                </div>
                <LogOut onClick={e => { e.stopPropagation(); router.push('/sign-in'); }} style={{ width: '14px', height: '14px', color: 'var(--text-disabled)', cursor: 'pointer', flexShrink: 0 }} />
              </div>
            )}
            <button onClick={() => setCollapsed(p => !p)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--text-disabled)', fontSize: '12px' }}>
              <ChevronRight style={{ width: '14px', height: '14px', transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
              {!collapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>
      )}

      {/* ══ MOBILE TOP BAR ══ */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '56px',
          background: 'rgba(13,13,20,0.97)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--brand-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: 'white' }}>S</div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Scribe Hub</span>
          </div>
          <button onClick={() => setMobileOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '6px', display: 'flex', alignItems: 'center' }}>
            {mobileOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>
        </div>
      )}

      {/* ══ MOBILE DRAWER ══ */}
      {isMobile && mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 48, backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: '260px',
            background: '#0D0D14', borderRight: '1px solid var(--border-subtle)',
            zIndex: 49, display: 'flex', flexDirection: 'column', padding: '16px 8px',
            animation: 'drawerIn 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <style>{`@keyframes drawerIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--brand-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white' }}>S</div>
              <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Scribe Hub</span>
            </div>
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <button key={href} onClick={() => router.push(href)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '13px 16px', borderRadius: '10px', marginBottom: '4px',
                  background: active ? 'rgba(123,47,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(123,47,255,0.3)' : '1px solid transparent',
                  color: active ? 'var(--brand-light)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '15px', fontWeight: active ? 600 : 400, textAlign: 'left',
                }}>
                  <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
            <div style={{ marginTop: 'auto', padding: '12px', borderRadius: '10px', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-violet), var(--accent-lime))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 }}>T</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Temi Adeyemi</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Free plan</p>
              </div>
              <LogOut onClick={() => router.push('/sign-in')} style={{ width: '16px', height: '16px', color: 'var(--text-disabled)', cursor: 'pointer' }} />
            </div>
          </div>
        </>
      )}

      {/* ══ MOBILE BOTTOM TABS ══ */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(13,13,20,0.97)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          paddingTop: '6px', zIndex: 40,
        }}>
          {NAV_ITEMS.slice(0, 5).map(({ icon: Icon, label, href }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <button key={href} onClick={() => router.push(href)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                padding: '4px 8px', border: 'none', cursor: 'pointer', background: 'transparent',
                color: active ? 'var(--brand-light)' : 'var(--text-disabled)', minWidth: '52px',
              }}>
                <div style={{ width: '36px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(123,47,255,0.2)' : 'transparent' }}>
                  <Icon style={{ width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}