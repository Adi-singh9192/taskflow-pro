import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-[18px] bg-[var(--color-card)] border border-[var(--color-border)] shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
