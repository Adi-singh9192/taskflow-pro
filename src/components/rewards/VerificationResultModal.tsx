import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, Zap, Coins, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface VerificationResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    success: boolean;
    message?: string;
    unlockedBadges?: string[];
    verificationResult: {
      verified: boolean;
      completionScore: number;
      confidence: number;
      quality: string;
      reasoning: string;
      reward: {
        xp: number;
        coins: number;
        badge?: string;
      };
      verifiedAt: string;
    };
  };
}

export function VerificationResultModal({ isOpen, onClose, result }: VerificationResultModalProps) {
  if (!isOpen) return null;

  const { success, unlockedBadges, verificationResult } = result;
  const verified = verificationResult.verified;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden p-6 text-center shadow-2xl relative">
          
          {/* Decorative Background Glows */}
          <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-[rgba(232,255,0,0.06)] to-transparent rounded-full filter blur-3xl pointer-events-none" />

          {/* Success/Failure Header Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${
              verified
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce"
                : "bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            }`}>
              {verified ? <CheckCircle className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
            </div>
          </div>

          <h2 className="text-2xl font-heading font-bold text-[var(--color-text-main)] mb-1">
            {verified ? "Submission Verified!" : "Verification Failed"}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] font-mono uppercase tracking-widest mb-6">
            {verified ? "AI Audit complete • Task Approved" : "AI Audit complete • Feedback Provided"}
          </p>

          {/* Verification Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-3">
              <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase block mb-1">Score</span>
              <p className="text-xl font-heading font-bold text-[var(--color-primary)]">
                {verificationResult.completionScore}<span className="text-xs text-[var(--color-text-muted)]">/100</span>
              </p>
            </div>
            
            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-3">
              <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase block mb-1">Quality</span>
              <p className={`text-sm font-heading font-bold ${
                verificationResult.quality === "Excellent" ? "text-[var(--color-primary)]" :
                verificationResult.quality === "Good" ? "text-emerald-400" :
                "text-yellow-500"
              }`}>
                {verificationResult.quality}
              </p>
            </div>

            <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-3">
              <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase block mb-1">AI Confidence</span>
              <p className="text-base font-heading font-bold text-[var(--color-text-main)]">
                {verificationResult.confidence}%
              </p>
            </div>
          </div>

          {/* Reasoning Explanation Box */}
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-4 text-left text-xs mb-6">
            <span className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase block mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              AI Auditor Reasoning:
            </span>
            <p className="text-[var(--color-text-main)] leading-relaxed font-mono">
              {verificationResult.reasoning}
            </p>
          </div>

          {/* Rewards Panel if Verified */}
          {verified && (
            <div className="bg-gradient-to-r from-[rgba(232,255,0,0.06)] to-[rgba(255,28,247,0.06)] border border-[rgba(232,255,0,0.15)] rounded-2xl p-4 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Rewards Awarded
              </h3>
              
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(232,255,0,0.1)] flex items-center justify-center text-[var(--color-primary)]">
                    <Zap className="w-4 h-4 fill-[var(--color-primary)]" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] block leading-none">Experience</span>
                    <span className="font-heading font-bold text-sm text-[var(--color-primary)]">
                      +{verificationResult.reward.xp} XP
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(255,28,247,0.1)] flex items-center justify-center text-[var(--color-secondary)]">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] block leading-none">Flow Coins</span>
                    <span className="font-heading font-bold text-sm text-[var(--color-secondary)]">
                      +{verificationResult.reward.coins} Coins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badge Unlocks Celebration */}
          {unlockedBadges && unlockedBadges.length > 0 && (
            <div className="mb-6 p-3 bg-[rgba(232,255,0,0.05)] border border-dashed border-[var(--color-primary)]/40 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-primary)] animate-pulse">
              <Award className="w-4 h-4" />
              Badge Unlocked: {unlockedBadges.join(", ")}! (+Bonus XP/Coins)
            </div>
          )}

          {/* Action button */}
          <Button
            onClick={onClose}
            className="w-full bg-[var(--color-primary)] text-black font-bold h-11 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
          >
            {verified ? "Awesome, Claim Rewards!" : "Dismiss and Retry"}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
