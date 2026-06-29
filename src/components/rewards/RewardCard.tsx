import React, { useState } from 'react';
import { Coins, CheckCircle, Gift } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export interface MarketplaceItem {
  id: string;
  brand: string;
  title: string;
  cost: number;
  discount: string;
  category: string;
  logoColor: string;
}

interface RewardCardProps {
  item: MarketplaceItem;
  userCoins: number;
  onRedeemed: (remainingCoins: number) => void;
}

export function RewardCard({ item, userCoins, onRedeemed }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const canAfford = userCoins >= item.cost;

  const handleRedeem = async () => {
    if (!canAfford) {
      toast.error("You do not have enough Flow Coins!");
      return;
    }

    setIsRedeeming(true);
    try {
      const response = await api.post('/rewards/redeem', { couponId: item.id });
      toast.success(response.data.message);
      onRedeemed(response.data.remainingCoins);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Redemption failed.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5 relative flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-[rgba(232,255,0,0.2)] shadow-md">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span 
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-full border"
            style={{ 
              backgroundColor: `${item.logoColor}12`, 
              borderColor: `${item.logoColor}35`,
              color: item.logoColor 
            }}
          >
            {item.brand}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider bg-[var(--color-background)] border border-[var(--color-border)] px-2 py-0.5 rounded-md">
            {item.category}
          </span>
        </div>

        <h3 className="font-heading font-bold text-lg text-[var(--color-text-main)] mb-1">
          {item.discount}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-5">
          {item.title}
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="font-heading font-bold text-[var(--color-secondary)]">
            {item.cost}
          </span>
          <span className="text-[10px] text-[var(--color-text-muted)] font-mono">coins</span>
        </div>

        <button
          onClick={handleRedeem}
          disabled={isRedeeming}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
            canAfford 
              ? "bg-[var(--color-primary)] text-black hover:opacity-90 active:scale-95" 
              : "bg-[var(--color-border)] text-[var(--color-text-muted)] cursor-not-allowed"
          }`}
        >
          {isRedeeming ? "Redeeming..." : "Redeem"}
        </button>
      </div>
    </div>
  );
}
