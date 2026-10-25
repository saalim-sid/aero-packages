import type {AuthUser} from '@platform/core/types/auth'

export interface ReferrerSummary {
  id: string
  displayName: string
  username?: string
  email?: string
}

export interface GenealogyUser extends AuthUser {
  referralUrl: string
}

export interface GenealogyNode {
  id: string
  username?: string
  displayName: string
  email?: string
  lastLoginAt: string | null
  points: number
  networkSize: number
  networkRank: number
  childCount: number
  hasChildren: boolean
  referralCode?: string
  referredBy?: ReferrerSummary | null
  generation?: number
}

export interface GenealogyPage {
  items: GenealogyNode[]
  total: number
  nextOffset: number | null
}

export interface GenealogyBranch extends GenealogyPage {
  loading: boolean
}

export interface GenealogyData {
  self: GenealogyNode
  tree: GenealogyNode[]
  total: number
  nextOffset: number | null
  totalNetworkSize: number
}
