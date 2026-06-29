import React from 'react';
import { Sparkles, CheckCircle, Lock } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementBadgeProps {
  badge: Achievement;
}

export function AchievementBadge({ badge }: AchievementBadgeProps) {
  return (
    <div 
      className={`relative p-5 border rounded-2xl transition-all shadow-sm ${
        badge.isUnlocked
          ? "bg-[var(--color-card)] border-[rgba(232,255,0,0.2)] hover:border-[var(--color-primary)] shadow-md"
          : "bg-[var(--color-card)]/50 border-[var(--color-border)] opacity-60"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
          badge.isUnlocked
            ? "bg-[rgba(232,255,0,0.1)] border-[rgba(232,255,0,0.2)] text-[var(--color-primary)]"
            : "bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-text-muted)]"
        }`}>
          <Sparkles className={`w-6 h-6 ${badge.isUnlocked ? "animate-pulse" : ""}`} />
        </div>
        
        <div>
          {badge.isUnlocked ? (
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-success)] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" />
              Unlocked
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] font-semibold bg-[var(--color-background)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>
      </div>

      <h4 className={`font-heading font-bold text-base mt-4 ${badge.isUnlocked ? "text-[var(--color-text-main)]" : "text-[var(--color-text-muted)]"}`}>
        {badge.title}
      </h4>
      
      <p className="text-xs text-[var(--color-text-muted)] mt-1 min-h-[32px]">
        {badge.description}
      </p>

      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] font-mono">
        <span className="text-[var(--color-text-muted)]">Rewards:</span>
        <span className={badge.isUnlocked ? "text-[var(--color-primary)] font-bold" : "text-[var(--color-text-muted)]"}>
          +{badge.rewardXp} XP • +{badge.rewardCoins} Coins
        </span>
      </div>
    </div>
  );
}
