import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'yellow' | 'blue' | 'green';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-black text-white border-2 border-black',
    outline: 'bg-white text-black border-2 border-black',
    yellow: 'bg-yellow-300 text-black border-2 border-black',
    blue: 'bg-blue-300 text-black border-2 border-black',
    green: 'bg-green-300 text-black border-2 border-black',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
