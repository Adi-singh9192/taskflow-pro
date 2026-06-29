import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-[var(--color-text-muted)]">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-main)] transition-colors",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] focus-visible:border-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
