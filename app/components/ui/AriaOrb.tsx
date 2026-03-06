export function AriaOrb({ onClick, className = '' }: { onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-14 h-14 rounded-full cursor-pointer border-0 animate-aria-pulse
        hover:scale-[1.15] hover:shadow-glow transition-all duration-150 ease-out
        ${className}`}
      style={{
        background: 'radial-gradient(circle, var(--aria-glow-1), var(--aria-glow-2))',
      }}
      aria-label="Open ARIA assistant"
    />
  );
}
