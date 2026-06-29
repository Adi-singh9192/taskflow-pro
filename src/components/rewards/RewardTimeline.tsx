import React from 'react';
import { PlusCircle, MinusCircle, Zap, Coins } from 'lucide-react';
import { RewardTransaction } from '../../types';

interface RewardTimelineProps {
  transactions: RewardTransaction[];
}

export function RewardTimeline({ transactions }: RewardTimelineProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 text-center text-[var(--color-text-muted)] text-sm">
        No transaction history available yet. Complete tasks or unlock badges to earn rewards!
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md">
      <div className="space-y-6">
        {transactions.map((tx) => {
          const isEarn = tx.type === "earn";
          return (
            <div key={tx._id} className="flex items-start gap-4 relative">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isEarn 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}>
                {isEarn ? <PlusCircle className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-main)] truncate">
                  {tx.description}
                </p>
                <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1 font-mono text-xs shrink-0 text-right">
                {tx.amountXp > 0 && (
                  <span className="text-[var(--color-primary)] font-bold flex items-center gap-0.5 justify-end">
                    <Zap className="w-3.5 h-3.5 fill-[var(--color-primary)]" />
                    +{tx.amountXp} XP
                  </span>
                )}
                
                {tx.amountCoins !== 0 && (
                  <span className={`font-bold flex items-center gap-0.5 justify-end ${isEarn ? "text-[var(--color-secondary)]" : "text-red-400"}`}>
                    <Coins className="w-3.5 h-3.5" />
                    {tx.amountCoins > 0 ? `+${tx.amountCoins}` : tx.amountCoins} Coins
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
