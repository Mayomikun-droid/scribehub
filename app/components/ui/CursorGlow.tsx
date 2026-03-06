'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    const mq = window.matchMedia('(pointer: coarse)');
    if (mq.matches) {
      setIsTouch(true);
      return;
    }

    const el = glowRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      gsap.to(el, {
        x: e.clientX - 100,
        y: e.clientY - 100,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={glowRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,47,255,0.4) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    />
  );
}
