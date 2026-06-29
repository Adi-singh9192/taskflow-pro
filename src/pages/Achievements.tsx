import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AchievementBadge } from '../components/rewards/AchievementBadge';
import { Achievement } from '../types';
import api from '../lib/api';
import { Sparkles, Award, Star, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/rewards/achievements');
        setAchievements(response.data);
      } catch (err: any) {
        toast.error("Failed to load achievements list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--color-text-muted)] h-full">
        <div className="flex flex-col items-center gap-3">
          <Award className="w-8 h-8 text-[var(--color-primary)] animate-bounce" />
          <span>Synchronizing Achievements...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto pb-16 px-4 md:px-8"
    >
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-widest font-semibold">
          <span>Reward Engine</span>
          <span>/</span>
          <span className="text-[var(--color-primary)]">Achievements</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-heading">
          Badges & Achievements
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm md:text-base">
          Conquer productivity goals, unlock rare achievement medals, and trigger massive XP boosts.
        </p>
      </div>

      {/* Progress stats banner */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[rgba(232,255,0,0.03)] to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-[rgba(232,255,0,0.1)] border border-[rgba(232,255,0,0.2)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
            <Star className="w-6 h-6 fill-[var(--color-primary)] animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-wider block">
              Achievement Progress
            </span>
            <p className="text-xl font-heading font-bold text-[var(--color-text-main)]">
              Unlocked {unlockedCount} of {totalCount} Badges
            </p>
          </div>
        </div>

        <div className="w-full md:w-96 space-y-2 shrink-0">
          <div className="flex justify-between text-xs font-mono text-[var(--color-text-muted)]">
            <span>Progress bar</span>
            <span className="text-[var(--color-primary)] font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((badge) => (
          <div key={badge.id}>
            <AchievementBadge badge={badge} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
