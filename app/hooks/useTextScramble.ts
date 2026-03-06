import { useState, useCallback, useRef } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function useTextScramble(target: string, speed = 30) {
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const length = target.length;

    intervalRef.current = setInterval(() => {
      const resolved = Math.floor(iteration / 3);
      let result = '';

      for (let i = 0; i < length; i++) {
        if (i < resolved) {
          result += target[i];
        } else if (target[i] === ' ') {
          result += ' ';
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);
      iteration++;

      if (resolved >= length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(target);
      }
    }, speed);
  }, [target, speed]);

  return { displayText, scramble };
}
