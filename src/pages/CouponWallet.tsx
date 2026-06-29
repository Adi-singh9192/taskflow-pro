import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CouponCard } from '../components/rewards/CouponCard';
import { Coupon, RewardProfile } from '../types';
import api from '../lib/api';
import { Sparkles, Wallet, Coins, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function CouponWallet() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [profile, setProfile] = useState<RewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletData = async () => {
    try {
      const [couponsRes, profileRes] = await Promise.all([
        api.get('/rewards/coupons'),
        api.get('/rewards/profile')
      ]);
      setCoupons(couponsRes.data);
      setProfile(profileRes.data);
    } catch (err: any) {
      toast.error("Failed to load your reward wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--color-text-muted)] h-full">
        <div className="flex flex-col items-center gap-3">
          <Wallet className="w-8 h-8 text-[var(--color-secondary)] animate-spin" />
          <span>Opening Coupon Wallet...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto pb-16 px-4 md:px-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2 uppercase tracking-widest font-semibold">
            <span>Reward Engine</span>
            <span>/</span>
            <span className="text-[var(--color-secondary)]">Wallet</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-heading">
            Coupon Wallet
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base">
            Store and manage your purchased brand vouchers, copy reward codes, or mark them as used.
          </p>
        </div>

        {profile && (
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3 self-start sm:self-center shadow-md">
            <div className="w-8 h-8 rounded-lg bg-[rgba(255,28,247,0.1)] flex items-center justify-center text-[var(--color-secondary)]">
              <Coins className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider block font-mono">
                Available Coins
              </span>
              <span className="font-heading font-extrabold text-base text-[var(--color-secondary)]">
                {profile.flowCoins} Coins
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="border border-dashed border-[var(--color-border)] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6 bg-[var(--color-card)]/30">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-muted)] flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-lg text-[var(--color-text-main)]">
              Your Wallet is Empty
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              You haven't redeemed any Flow Coins for brand vouchers yet. Go complete some tasks to earn coins and unlock Swiggy, Swiggy, or Swiggy coupons!
            </p>
          </div>

          <Link
            to="/rewards"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-black font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-[0_0_15px_rgba(232,255,0,0.3)]"
          >
            Visit Coupon Marketplace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[var(--color-text-main)] mb-1">
            My Vouchers ({coupons.length})
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon._id}>
                <CouponCard coupon={coupon} />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
