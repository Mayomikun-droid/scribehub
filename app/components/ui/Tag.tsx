interface TagProps {
  variant?: 'default' | 'success' | 'warning' | 'lime';
  children: React.ReactNode;
  className?: string;
}

export function Tag({ variant = 'default', children, className = '' }: TagProps) {
  const variantClass = variant === 'success'
    ? 'tag-success'
    : variant === 'warning'
    ? 'tag-warning'
    : variant === 'lime'
    ? 'tag-lime'
    : '';

  return (
    <span className={`tag ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
