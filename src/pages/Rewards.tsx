import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { XPProgressCard } from '../components/rewards/XPProgressCard';
import { FlowCoinCard } from '../components/rewards/FlowCoinCard';
import { RewardCard, MarketplaceItem } from '../components/rewards/RewardCard';
import { RewardTimeline } from '../components/rewards/RewardTimeline';
import { AchievementBadge } from '../components/rewards/AchievementBadge';
import { RewardProfile, RewardTransaction, Achievement } from '../types';
import api from '../lib/api';
import { Sparkles, ShoppingBag, History, Award, Info, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MARKETPLACE_CATALOG: MarketplaceItem[] = [
  { id: "amazon_10", brand: "Amazon", title: "$10 Gift Voucher", cost: 200, discount: "$10 Off Voucher", category: "Shopping", logoColor: "#FF9900" },
  { id: "spotify_premium", brand: "Spotify", title: "3 Months Premium subscription code", cost: 300, discount: "3 Months Premium", category: "Entertainment", logoColor: "#1DB954" },
  { id: "swiggy_meal", brand: "Swiggy", title: "Tasty treats delivered to your door", cost: 150, discount: "$15 Food Coupon", category: "Food & Drinks", logoColor: "#FC8019" },
  { id: "myntra_wear", brand: "Myntra", title: "Premium catalog fashion voucher", cost: 180, discount: "$20 Fashion Voucher", category: "Fashion", logoColor: "#FF3F6C" },
  { id: "zomato_feast", brand: "Zomato", title: "Free deliveries plus flat percentage off", cost: 100, discount: "20% Off Deliveries", category: "Food & Drinks", logoColor: "#E23744" },
  { id: "netflix_one", brand: "Netflix", title: "Stream your favorite shows in HD", cost: 350, discount: "1 Month Streaming", category: "Entertainment", logoColor: "#E50914" }
];

export default function Rewards() {
  const [profile, setProfile] = useState<RewardProfile | null>(null);
  const [history, setHistory] = useState<RewardTransaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [profileRes, historyRes, achievementsRes] = await Promise.all([
        api.get('/rewards/profile'),
        api.get('/rewards/history'),
        api.get('/rewards/achievements')
      ]);
      setProfile(profileRes.data);
      setHistory(historyRes.data);
      setAchievements(achievementsRes.data);
    } catch (err: any) {
      toast.error("Failed to load reward engine stats.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCoinsUpdate = (remainingCoins: number) => {
    if (profile) {
      setProfile({
        ...profile,
        flowCoins: remainingCoins
      });
      // Refresh transaction logs
      api.get('/rewards/history').then(res => setHistory(res.data));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--color-text-muted)] h-full">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          <span>Syncing Reward Engine...</span>
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
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-widest font-semibold">
            <span>Productivity Rewards</span>
            <span>/</span>
            <span className="text-[var(--color-secondary)]">Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-heading">
            Reward Engine
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base">
            Complete tasks, submit proof for AI evaluation, and earn real-world rewards.
          </p>
        </div>
        
        <Link 
          to="/wallet" 
          className="bg-transparent border border-[var(--color-border)] hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-center transition-all"
        >
          My Wallet Wallet
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overview Cards (XP progress & Streak/Coins) */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <XPProgressCard profile={profile} />
          <FlowCoinCard profile={profile} />
        </div>
      )}

      {/* Grid: Coupon Marketplace vs Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Marketplace (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="font-heading font-bold text-xl text-[var(--color-text-main)]">
                Coupon Marketplace
              </h2>
            </div>
            <span className="text-xs text-[var(--color-text-muted)] font-mono">
              Demo store
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MARKETPLACE_CATALOG.map((item) => (
              <div key={item.id}>
                <RewardCard 
                  item={item} 
                  userCoins={profile?.flowCoins || 0} 
                  onRedeemed={handleCoinsUpdate}
                />
              </div>
            ))}
          </div>
        </div>

        {/* History timeline (Right 1 col) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--color-secondary)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-text-main)]">
              Activity History
            </h2>
          </div>
          
          <RewardTimeline transactions={history.slice(0, 5)} />
        </div>
      </div>

      {/* Achievements / Recent Badge Unlocks Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--color-text-main)]">
              Achievements
            </h2>
          </div>
          <Link 
            to="/achievements" 
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-bold"
          >
            All Achievements
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.slice(0, 4).map((badge) => (
            <div key={badge.id}>
              <AchievementBadge badge={badge} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
