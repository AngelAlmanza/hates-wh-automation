import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-rust-100/70
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
