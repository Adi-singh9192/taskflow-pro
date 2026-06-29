import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-black hover:bg-[#cce600] shadow-[0_0_15px_rgba(232,255,0,0.3)] hover:shadow-[0_0_25px_rgba(232,255,0,0.5)] focus:ring-[var(--color-primary)]",
    secondary: "bg-[var(--color-card)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] focus:ring-[var(--color-border)]",
    ghost: "bg-transparent text-[var(--color-text-main)] hover:bg-[var(--color-hover)] focus:ring-[var(--color-border)]",
    danger: "bg-[var(--color-danger)] text-white hover:bg-red-600 focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
