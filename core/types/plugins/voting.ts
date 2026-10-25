import type {AuthUser} from '@platform/core/types/auth'

export interface Round {
  _id: string
  title?: string
  closesAt: string
  fundAmount?: number
  isOpen?: boolean
}

export interface Standing {
  charityId: string
  votes: number
  share: number
  fundShare: number
}

export interface VoteStatus {
  round: Round | null
  votesLeft: number
  allowance: number
  votedToday: string[]
  extras?: Array<{label: string; extraVotes: number}>
}

export interface VoteCharity {
  _id: string
  name: string
  location: string | null
  summary: string | null
  country: string | null
  categories: string[]
  votes: number
}

export interface VoteCharityPage {
  items: VoteCharity[]
  total: number
  page: number
  pageSize: number
  countries: string[]
  categories: string[]
}

export interface CmsDonation {
  _id: string
  charity?: {_ref: string}
  charityName: string
  amountGBP: number
  paidAt?: string
  roundTitle?: string
  note?: string
}

export interface VotingUser extends AuthUser {
  activityStats: {votes: number}
}
