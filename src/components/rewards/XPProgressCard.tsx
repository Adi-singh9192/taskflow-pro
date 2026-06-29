import React from 'react';
import { Award, Zap } from 'lucide-react';
import { RewardProfile } from '../../types';

interface XPProgressCardProps {
  profile: RewardProfile;
}

export function XPProgressCard({ profile }: XPProgressCardProps) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 relative overflow-hidden transition-all hover:border-[rgba(232,255,0,0.3)] shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[rgba(232,255,0,0.05)] to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(232,255,0,0.1)] border border-[rgba(232,255,0,0.2)] flex items-center justify-center text-[var(--color-primary)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-widest">Level System</h3>
            <p className="text-lg font-heading font-bold text-[var(--color-primary)]">
              Lvl {profile.level} • {profile.levelTitle}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-xs text-[var(--color-text-muted)]">Total XP</span>
          <p className="text-xl font-heading font-bold flex items-center gap-1 justify-end">
            <Zap className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
            {profile.xp.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[var(--color-text-muted)]">{profile.xpPrev} XP</span>
          <span className="text-[var(--color-primary)] font-semibold">
            {profile.xpNext - profile.xp} XP to next level
          </span>
          <span className="text-[var(--color-text-muted)]">{profile.xpNext} XP</span>
        </div>
        
        <div className="w-full h-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-1000 ease-out"
            style={{ width: `${profile.levelProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-[var(--color-text-muted)]">Level progress</span>
          <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[rgba(232,255,0,0.1)] px-2 py-0.5 rounded border border-[rgba(232,255,0,0.15)]">
            {profile.levelProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
