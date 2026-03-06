'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'earn';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base = variant === 'primary'
    ? 'btn-primary'
    : variant === 'earn'
    ? 'btn-earn'
    : 'btn-secondary';

  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
