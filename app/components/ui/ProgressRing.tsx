interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'brand' | 'lime';
  showLabel?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 56,
  strokeWidth = 3,
  variant = 'brand',
  showLabel = true,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const strokeColor = variant === 'lime' ? 'var(--accent-lime)' : 'var(--brand-violet)';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s var(--ease-out)' }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-text-primary font-bold"
          style={{ fontSize: 'var(--text-body-sm)' }}
        >
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
