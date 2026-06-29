import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, ShieldAlert, Sparkles, Zap, Flame } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface LeaderboardUser {
  name: string;
  xp: number;
  avatarUrl: string;
  level: number;
  rank: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  weekly: LeaderboardUser[];
  monthly: LeaderboardUser[];
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'organization' | 'university'>('global');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<Record<string, LeaderboardData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/rewards/leaderboard');
        setLeaderboardData(response.data);
      } catch (err: any) {
        toast.error("Failed to load competitive leaderboards.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--color-text-muted)] h-full">
        <div className="flex flex-col items-center gap-3">
          <Trophy className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
          <span>Syncing Competitive Rankings...</span>
        </div>
      </div>
    );
  }

  // Retrieve correct user list based on selected filter keys
  const users = leaderboardData?.[activeTab]?.[timeframe] || [];
  
  // Split into podium (top 3) and normal list items
  const podiumUsers = users.slice(0, 3);
  const restUsers = users.slice(3);

  // Helper to color podium positions
  const getPodiumStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { border: "border-yellow-500", glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]", medallion: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30", size: "scale-105" };
      case 2:
        return { border: "border-slate-300", glow: "shadow-[0_0_20px_rgba(203,213,225,0.15)]", medallion: "text-slate-300 bg-slate-300/10 border-slate-300/30", size: "scale-100" };
      case 3:
        return { border: "border-amber-600", glow: "shadow-[0_0_20px_rgba(217,119,6,0.15)]", medallion: "text-amber-600 bg-amber-600/10 border-amber-600/30", size: "scale-95" };
      default:
        return { border: "border-[var(--color-border)]", glow: "", medallion: "", size: "" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto pb-16 px-4 md:px-8"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-widest font-semibold">
            <span>Reward Engine</span>
            <span>/</span>
            <span className="text-[var(--color-secondary)]">Leaderboards</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-heading">
            Competitive Arena
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base">
            Compete with friends, your organization, or global performers to reach the productivity podium.
          </p>
        </div>
      </div>

      {/* Filter Tabs Grid */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-2.5">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {(['global', 'friends', 'organization', 'university'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[rgba(232,255,0,0.1)] border border-[rgba(232,255,0,0.25)] text-[var(--color-primary)]"
                  : "bg-transparent border border-transparent text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Time Horizon Selection */}
        <div className="flex bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-1 gap-1 shrink-0">
          {(['weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === t
                  ? "bg-[var(--color-card)] text-white shadow-md border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Row */}
      {podiumUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 pb-2">
          {/* Rank 2 (Render first on desktop, or second on mobile) */}
          {podiumUsers[1] && (
            <div className={`order-2 md:order-1 bg-[var(--color-card)] border ${getPodiumStyle(2).border} ${getPodiumStyle(2).glow} rounded-2xl p-5 text-center flex flex-col items-center relative transition-all hover:scale-101`}>
              <div className="absolute top-3 right-3 text-xs font-mono text-[var(--color-text-muted)]">2nd</div>
              <img src={podiumUsers[1].avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full bg-[var(--color-background)] border-2 border-slate-300 mb-3" />
              <h3 className="font-heading font-bold text-base truncate max-w-[150px] text-[var(--color-text-main)]">
                {podiumUsers[1].name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Level {podiumUsers[1].level}</p>
              <div className="mt-3 px-3 py-1 bg-slate-300/10 rounded-lg text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-slate-300" />
                {podiumUsers[1].xp.toLocaleString()} XP
              </div>
            </div>
          )}

          {/* Rank 1 (Main middle podium) */}
          {podiumUsers[0] && (
            <div className={`order-1 md:order-2 bg-[var(--color-card)] border-2 ${getPodiumStyle(1).border} ${getPodiumStyle(1).glow} rounded-2xl p-6 text-center flex flex-col items-center relative transform md:-translate-y-4 shadow-xl transition-all hover:scale-102`}>
              <div className="absolute -top-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] font-extrabold uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Trophy className="w-3.5 h-3.5" /> First Place
              </div>
              <img src={podiumUsers[0].avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full bg-[var(--color-background)] border-2 border-yellow-500 mb-3 animate-pulse" />
              <h3 className="font-heading font-bold text-lg truncate max-w-[180px] text-[var(--color-text-main)]">
                {podiumUsers[0].name}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">Level {podiumUsers[0].level}</p>
              <div className="mt-3 px-4 py-1.5 bg-yellow-500/10 rounded-lg text-sm font-mono font-bold text-yellow-500 flex items-center gap-1 shadow-inner">
                <Zap className="w-4 h-4 fill-yellow-500 animate-pulse" />
                {podiumUsers[0].xp.toLocaleString()} XP
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {podiumUsers[2] && (
            <div className={`order-3 bg-[var(--color-card)] border ${getPodiumStyle(3).border} ${getPodiumStyle(3).glow} rounded-2xl p-5 text-center flex flex-col items-center relative transition-all hover:scale-101`}>
              <div className="absolute top-3 right-3 text-xs font-mono text-[var(--color-text-muted)]">3rd</div>
              <img src={podiumUsers[2].avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full bg-[var(--color-background)] border-2 border-amber-600 mb-3" />
              <h3 className="font-heading font-bold text-base truncate max-w-[150px] text-[var(--color-text-main)]">
                {podiumUsers[2].name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Level {podiumUsers[2].level}</p>
              <div className="mt-3 px-3 py-1 bg-amber-600/10 rounded-lg text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-600" />
                {podiumUsers[2].xp.toLocaleString()} XP
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rankings List */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
          <span>Rank & Participant</span>
          <span>Rewards XP</span>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {restUsers.map((item) => (
            <div 
              key={item.name} 
              className={`flex items-center justify-between px-6 py-4 transition-all hover:bg-[var(--color-hover)] ${
                item.isCurrentUser ? "bg-[rgba(232,255,0,0.03)] font-semibold border-l-2 border-l-[var(--color-primary)]" : ""
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Rank number */}
                <span className="w-6 text-sm font-mono font-bold text-[var(--color-text-muted)] text-center">
                  {item.rank}
                </span>

                {/* Avatar */}
                <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full bg-[var(--color-background)] shrink-0 border border-[var(--color-border)]" />

                <div className="min-w-0">
                  <span className="text-sm text-[var(--color-text-main)] block truncate flex items-center gap-2">
                    {item.name}
                    {item.isCurrentUser && (
                      <span className="text-[9px] bg-[rgba(232,255,0,0.15)] text-[var(--color-primary)] border border-[rgba(232,255,0,0.25)] px-2 py-0.5 rounded uppercase font-bold">
                        You
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Level {item.level}
                  </span>
                </div>
              </div>

              <div className="font-mono text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                {item.xp.toLocaleString()} <span className="text-[10px]">XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
