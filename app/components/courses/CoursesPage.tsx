'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COURSES, CATEGORIES, getCoursesByCategory, Course } from '../../data/courses';
import { AppSidebar } from '../layout/AppSidebar';
import { LaunchGate } from '../aria/LaunchGate';
import { Star, Clock, Users, Lock, ChevronRight, Play, Zap } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

function getDifficultyColor(d: string) {
  return d === 'Beginner' ? '#22C55E' : d === 'Intermediate' ? '#F59E0B' : '#EF4444';
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, index }: { course: Course; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <LaunchGate featureName={course.title}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--bg-surface, #13131A)',
          border: `1px solid ${hovered ? 'rgba(123,47,255,0.4)' : 'rgba(123,47,255,0.12)'}`,
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? '0 20px 60px rgba(123,47,255,0.2)' : '0 0 0 transparent',
          animation: `cardIn 0.5s ease ${index * 0.04}s both`,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        {/* Thumbnail */}
        <div style={{
          height: '180px',
          background: `linear-gradient(135deg, ${course.color} 0%, ${course.colorEnd} 60%, rgba(123,47,255,0.4) 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glass overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: hovered ? 'blur(2px)' : 'none',
            transition: 'all 0.3s ease',
          }} />

          {/* Frosted glass card on hover */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: '12px',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(12px)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(204,255,0,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={20} color="#0A0A0F" fill="#0A0A0F" />
              </div>
            </div>
          )}

          {/* Category tag */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '999px',
            padding: '4px 10px',
            color: '#C084FC',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            {course.category}
          </div>

          {/* Earn badge */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(10,10,15,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(204,255,0,0.3)',
            borderRadius: '999px',
            padding: '4px 10px',
            color: '#CCFF00',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            Earn {formatNaira(course.potentialEarnings)}
          </div>

          {/* Lock icon */}
          <div style={{
            position: 'absolute', bottom: '12px', right: '12px',
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={12} color="rgba(255,255,255,0.6)" />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: `${getDifficultyColor(course.difficulty)}20`,
              color: getDifficultyColor(course.difficulty),
              fontSize: '10px', fontWeight: 700,
              padding: '2px 8px', borderRadius: '999px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {course.difficulty}
            </span>
          </div>

          <h3 style={{
            color: '#F5F0FF', fontSize: '15px', fontWeight: 700,
            margin: '0 0 6px', lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.title}
          </h3>

          <p style={{
            color: '#8B7BA8', fontSize: '12px', margin: '0 0 12px',
            lineHeight: 1.5, display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.tagline}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} color="#8B7BA8" />
              <span style={{ color: '#8B7BA8', fontSize: '12px' }}>{course.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} color="#8B7BA8" />
              <span style={{ color: '#8B7BA8', fontSize: '12px' }}>{course.enrolled.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <span style={{ color: '#8B7BA8', fontSize: '12px' }}>{course.rating}</span>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(123,47,255,0.1)',
          }}>
            <span style={{ color: '#F5F0FF', fontWeight: 800, fontSize: '16px' }}>
              {formatNaira(course.price)}
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              color: '#CCFF00', fontSize: '12px', fontWeight: 600,
            }}>
              <Zap size={12} color="#CCFF00" />
              Launch Apr 16
            </div>
          </div>
        </div>
      </div>
    </LaunchGate>
  );
}

// ─── Continue Learning Row ────────────────────────────────────────────────────
function ContinueRow() {
  const progress = [
    { title: 'Finance Fundamentals', progress: 33, earned: 900, color: '#1a472a', colorEnd: '#2d6a4f' },
    { title: 'Python for Beginners', progress: 16, earned: 450, color: '#1a1a2e', colorEnd: '#16213e' },
  ];

  if (progress.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: '#F5F0FF', fontSize: '18px', fontWeight: 700, margin: '0 0 16px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Continue Learning
      </h2>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
        {progress.map((c, i) => (
          <LaunchGate key={i} featureName={c.title}>
            <div style={{
              flexShrink: 0, width: '280px',
              background: 'var(--bg-surface, #13131A)',
              border: '1px solid rgba(123,47,255,0.2)',
              borderRadius: '14px', padding: '16px',
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>
              <div style={{
                height: '80px', borderRadius: '10px', marginBottom: '12px',
                background: `linear-gradient(135deg, ${c.color}, ${c.colorEnd})`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Play size={24} color="white" />
                </div>
              </div>
              <p style={{ color: '#F5F0FF', fontSize: '13px', fontWeight: 600, margin: '0 0 8px' }}>{c.title}</p>
              <div style={{ background: 'rgba(123,47,255,0.15)', borderRadius: '999px', height: '4px', marginBottom: '6px' }}>
                <div style={{ width: `${c.progress}%`, height: '100%', borderRadius: '999px', background: '#7B2FFF' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B7BA8', fontSize: '11px' }}>{c.progress}% complete</span>
                <span style={{ color: '#CCFF00', fontSize: '11px', fontWeight: 700 }}>₦{c.earned} earned</span>
              </div>
            </div>
          </LaunchGate>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = getCoursesByCategory(activeCategory);
  const ariaName = typeof window !== 'undefined' ? (localStorage.getItem('ariaName') || 'ARIA') : 'ARIA';
  const userName = typeof window !== 'undefined' ? (localStorage.getItem('userName') || 'there') : 'there';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(123,47,255,0.3); border-radius: 2px; }
      `}</style>

      <AppSidebar />

      <main className="app-main" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

        {/* ARIA Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(168,85,247,0.08))',
          border: '1px solid rgba(123,47,255,0.2)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'radial-gradient(circle at 35% 30%, #C084FC, #7B2FFF)',
            boxShadow: '0 0 20px rgba(123,47,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 800, color: 'white',
          }}>
            {ariaName[0]}
          </div>
          <div>
            <p style={{ color: '#F5F0FF', fontSize: '14px', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>
              <span style={{ color: '#C084FC', fontWeight: 700 }}>{ariaName} says:</span>{' '}
              {userName}, every course you complete puts real money in your wallet. Pick one and let's get started — March 16 is closer than you think.
            </p>
          </div>
        </div>

        {/* Continue Learning */}
        <ContinueRow />

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#F5F0FF', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, margin: '0 0 8px' }}>
            Learn & Earn
          </h1>
          <p style={{ color: '#8B7BA8', fontSize: '15px', margin: 0 }}>
            Every segment completed brings you closer to real income. {COURSES.length} courses across {CATEGORIES.length - 1} categories.
          </p>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex', gap: '8px',
          overflowX: 'auto', paddingBottom: '16px',
          marginBottom: '24px', scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                background: activeCategory === cat ? '#7B2FFF' : 'rgba(123,47,255,0.08)',
                border: `1px solid ${activeCategory === cat ? '#7B2FFF' : 'rgba(123,47,255,0.2)'}`,
                borderRadius: '999px',
                padding: '8px 16px',
                color: activeCategory === cat ? 'white' : '#8B7BA8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p style={{ color: '#8B7BA8', fontSize: '13px', marginBottom: '20px' }}>
          {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>

        {/* Course Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>

      </main>
    </>
  );
}