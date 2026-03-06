import { useCallback, RefObject } from 'react';
import gsap from 'gsap';

export function useMagneticButton(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        gsap.to(ref.current, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    },
    [ref, strength]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1.2, 0.4)',
    });
  }, [ref]);

  return { onMouseMove, onMouseLeave };
}
