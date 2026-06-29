import React from 'react';
import { Coins, Flame, CalendarRange } from 'lucide-react';
import { RewardProfile } from '../../types';

interface FlowCoinCardProps {
  profile: RewardProfile;
}

export function FlowCoinCard({ profile }: FlowCoinCardProps) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden transition-all hover:border-[rgba(255,28,247,0.3)] shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[rgba(255,28,247,0.05)] to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="grid grid-cols-2 gap-4 divide-x divide-[var(--color-border)]">
        {/* Flow Coins Balance */}
        <div className="pr-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(255,28,247,0.1)] border border-[rgba(255,28,247,0.2)] flex items-center justify-center text-[var(--color-secondary)]">
              <Coins className="w-4 h-4" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-widest">Flow Coins</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-[var(--color-secondary)]">
              {profile.flowCoins}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">coins</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
            Spend them on brand discount vouchers in the coupon store.
          </p>
        </div>

        {/* Streak details */}
        <div className="pl-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-widest">Active Streak</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-orange-500 animate-pulse">
              {profile.currentStreak}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">days</span>
          </div>
          
          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono border ${
                  day <= profile.currentStreak
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white border-transparent shadow-md"
                    : "bg-[var(--color-background)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                }`}
              >
                D{day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
