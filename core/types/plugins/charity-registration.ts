import type {OrgConfig} from '@platform/core/types/cms'

export interface CauseProjectInput {
  imageAssetId?: string
  imageName?: string
  description: string
  link: string
}

export interface CharityProjectItem {
  _key?: string
  image?: {url?: string; alt?: string}
  description?: string
  link?: string
}

export interface CmsCauseCategory {
  slug: string | {current: string}
  title: string
  description?: string
  body?: string
}

export interface CmsCharity {
  _id?: string
  id: string
  charityId?: string
  name: string
  category: string
  categories?: string[]
  country?: string
  location?: string
  websiteUrl?: string
  logo?: {url?: string; alt?: string} | null
  reg?: string
  summary: string
  tags?: string[]
  seedVotes?: number
  votes: number
}

export interface CharityOrg extends OrgConfig {
  charityNumber: string
  charityUrl: string
}
