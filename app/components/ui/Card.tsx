import React from 'react';

interface CardProps {
  variant?: 'standard' | 'earn' | 'glass';
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function Card({ variant = 'standard', children, className = '', hover = true, style }: CardProps) {
  if (variant === 'glass') {
    return (
      <div className={`card-glass ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`card ${variant === 'earn' ? 'card-earn' : ''} ${
        hover ? '' : 'transform-none! shadow-none!'
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}