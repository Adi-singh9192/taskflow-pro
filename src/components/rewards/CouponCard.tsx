import React, { useState } from 'react';
import { Copy, Check, Calendar, ExternalLink, Ticket } from 'lucide-react';
import { Coupon } from '../../types';
import toast from 'react-hot-toast';

interface CouponCardProps {
  coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const [isUsed, setIsUsed] = useState(coupon.isRedeemed);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success("Coupon code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`border rounded-2xl bg-[var(--color-card)] relative overflow-hidden transition-all shadow-md ${
      isUsed 
        ? "border-[var(--color-border)] opacity-50" 
        : "border-[rgba(255,28,247,0.15)] hover:border-[var(--color-secondary)] hover:shadow-lg"
    }`}>
      {/* Decorative side notches to look like a realistic ticket */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[var(--color-background)] rounded-r-full border-r border-t border-b border-[var(--color-border)] z-10" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[var(--color-background)] rounded-l-full border-l border-t border-b border-[var(--color-border)] z-10" />

      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            isUsed 
              ? "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text-muted)]" 
              : "bg-[rgba(255,28,247,0.1)] border-[rgba(255,28,247,0.2)] text-[var(--color-secondary)]"
          }`}>
            <Ticket className="w-6 h-6" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-mono font-bold uppercase ${isUsed ? "text-[var(--color-text-muted)]" : "text-[var(--color-secondary)]"}`}>
                {coupon.brandName}
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(coupon.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h4 className="font-heading font-bold text-lg text-[var(--color-text-main)] mt-1">
              {coupon.discountValue}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)]">
              {coupon.title}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
          {/* Coupon Code copy section */}
          <div className="flex items-center bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-1.5 pl-3">
            <span className="text-xs font-mono font-bold tracking-wider text-[var(--color-text-main)] mr-3">
              {coupon.code}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-[var(--color-hover)] rounded text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              onClick={() => setIsUsed(!isUsed)}
              className={`px-3 py-1 rounded text-[10px] font-semibold tracking-wider uppercase border cursor-pointer ${
                isUsed
                  ? "border-[var(--color-border)] bg-[var(--color-hover)] text-[var(--color-text-muted)]"
                  : "border-[rgba(255,28,247,0.2)] hover:bg-[rgba(255,28,247,0.05)] text-[var(--color-secondary)]"
              }`}
            >
              {isUsed ? "Mark Active" : "Mark Redeemed"}
            </button>
            
            <span className="text-[9px] text-[var(--color-text-muted)] font-mono">
              Value: {coupon.coinsCost} coins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
