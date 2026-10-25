import type {AuthUser} from '@platform/core/types/auth'

export interface RankTierItem {
  name: string
  emoji: string
  minPoints: number
  rewardText: string
}

export interface ShoppingTierItem {
  name: string
  emoji: string
  ptsPerPurchase: number
  benefit: string
  hasLottery?: boolean
  isLegend?: boolean
}

export interface HallOfFameLeaderboardEntry {
  position: number
  displayName: string
  rankEmoji: string
  rankName: string
  points: number
  isCurrentUser?: boolean
}

export interface HallOfFameUserProgress {
  displayName: string
  currentPoints: number
  currentRank: RankTierItem | null
  nextRank: RankTierItem | null
  pointsToNextRank: number
  percentToNextRank: number
  currentShoppingTier: ShoppingTierItem | null
  dailySpinEligible: boolean
}

export interface HallOfFameData {
  userProgress: HallOfFameUserProgress | null
  leaderboard: HallOfFameLeaderboardEntry[]
}

export interface PointsEarnRule {
  action: string
  icon: string
  label: string
  limit: string
  pts: number
  category?: 'daily' | 'account' | 'content' | 'ecommerce' | 'referral'
}

export type SpinState =
  | {status: 'idle'}
  | {status: 'spinning'}
  | {status: 'won'; awardedPoints: number}
  | {status: 'cooldown'; error: string}
  | {status: 'error'; error: string}

export interface PointsHistoryEntry {
  action: string
  points: number
  at: string
}

export interface PointsUser extends AuthUser {
  points: number
  grantFund: number
}
