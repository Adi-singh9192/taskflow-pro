export interface User {
  id: string;
  name: string;
  email: string;
  xp?: number;
  level?: number;
  flowCoins?: number;
  currentStreak?: number;
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  owner: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "To Do" | "In Progress" | "Review" | "Done" | "Verified Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  estimatedEffort?: string;
  board: string;
  owner: string;
  createdAt: string;
  submissionProof?: {
    proofType: string;
    proofValue: string;
    submittedAt: string;
  };
  verificationResult?: {
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
}

export interface RewardTransaction {
  _id: string;
  userId: string;
  type: "earn" | "redeem";
  amountXp: number;
  amountCoins: number;
  description: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export interface Coupon {
  _id: string;
  userId: string;
  brandName: string;
  title: string;
  code: string;
  discountValue: string;
  coinsCost: number;
  isRedeemed: boolean;
  createdAt: string;
}

export interface RewardProfile {
  xp: number;
  level: number;
  levelTitle: string;
  flowCoins: number;
  currentStreak: number;
  weeklyProgress: number;
  verifiedTasksCount: number;
  avgCompletionScore: number;
  xpPrev: number;
  xpNext: number;
  levelProgress: number;
}

