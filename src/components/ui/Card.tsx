import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function Card({ className, children, noPadding = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
        noPadding ? 'p-0' : 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
