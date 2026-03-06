'use client';
import { useCountUp } from '../../hooks/useCountUp';
import { formatNaira } from '../../utils/FormatNaira';

interface CountUpProps {
  target: number;
  duration?: number;
  prefix?: string;
  className?: string;
  isCurrency?: boolean;
}

export function CountUp({ target, duration = 1200, prefix = '', className = '', isCurrency = true }: CountUpProps) {
  const { value, ref } = useCountUp(target, duration);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={`tabular-nums ${className}`}>
      {prefix}{isCurrency ? formatNaira(value) : value.toLocaleString()}
    </span>
  );
}
