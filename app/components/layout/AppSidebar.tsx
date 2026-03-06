'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, LayoutDashboard, BookOpen, Gamepad2,
  Briefcase, Wallet, Sparkles, Settings,
  ChevronRight, Bell, LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home,            label: 'Home',       href: '/home' },
  { icon: LayoutDashboard, label: 'Dashboard',  href: '/dashboard' },
  { icon: BookOpen,        label: 'Courses',    href: '/courses' },
  { icon: Gamepad2,        label: 'Games',      href: '/games' },
  { icon: Briefcase,       label: 'Jobs',       href: '/jobs' },
  { icon: Wallet,          label: 'Wallet',     href: '/wallet' },
  { icon: Sparkles,        label: 'ARIA',       href: '/aria' },
  { icon: Settings,        label: 'Settings',   href: '/settings' },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: collapsed ? '72px' : '220px',
        background: '#0D0D14',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        zIndex: 40, transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
      className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{
          height: '64px', display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 24px',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: 'pointer', flexShrink: 0,
        }}
          onClick={() => router.push('/')}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--brand-violet)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 800, color: 'white',
          }}>S</div>
          {!collapsed && (
            <span style={{
              marginLeft: '10px', fontWeight: 700, fontSize: '16px',
              color: 'var(--text-primary)', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-base)',
            }}>Scribe Hub</span>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '12px', padding: collapsed ? '10px 12px' : '10px 14px',
                  borderRadius: '10px', marginBottom: '2px',
                  background: active ? 'rgba(123,47,255,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(123,47,255,0.3)' : '1px solid transparent',
                  color: active ? 'var(--brand-light)' : 'var(--text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {!collapsed && (
                  <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                )}
                {active && !collapsed && (
                  <ChevronRight style={{ width: '14px', height: '14px', marginLeft: 'auto', opacity: 0.6 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: user + collapse */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
          {/* User pill */}
          {!collapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              background: 'var(--bg-elevated)', marginBottom: '8px',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-violet), var(--accent-lime))',
                flexShrink: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white',
              }}>T</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Temi Adeyemi</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Free plan</p>
              </div>
              <LogOut style={{ width: '14px', height: '14px', color: 'var(--text-disabled)', cursor: 'pointer', flexShrink: 0 }} />
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(p => !p)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer',
              background: 'transparent', border: 'none', color: 'var(--text-disabled)',
              fontSize: '12px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-disabled)')}
          >
            <ChevronRight style={{
              width: '14px', height: '14px',
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.25s',
            }} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM TAB NAV ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
        zIndex: 40,
      }}
      className="flex md:hidden"
      >
        {NAV_ITEMS.slice(0, 6).map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                padding: '6px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: active ? 'var(--brand-light)' : 'var(--text-disabled)',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'rgba(123,47,255,0.2)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <Icon style={{ width: '18px', height: '18px' }} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}