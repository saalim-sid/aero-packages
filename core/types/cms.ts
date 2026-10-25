import type {LayoutNode} from '@platform/core/types/layout'

export interface CmsBlock {
  type: string
  [key: string]: any
}

export type Block =
  | {type: 'prose'; kicker?: string; title?: string; body: string[]}
  | {type: 'list'; title?: string; items: string[]}
  | {type: 'numbered'; title?: string; items: {title: string; body: string}[]}
  | {type: 'stats'; items: {value: string; label: string}[]}
  | {
      type: 'cards'
      title?: string
      items: {title: string; body: string; href?: string; cta?: string}[]
    }
  | {type: 'quote'; text: string; cite?: string}
  | {
      type: 'split'
      title: string
      body: string[]
      image: any
      imageUrl?: string
      alt: string
      href?: string
      cta?: string
    }
  | {type: 'help'}
  | {type: 'cta'; title?: string; body?: string}

export interface CmsComponent {
  _id: string
  _type?: string
  name?: string
  title?: string
  componentType?: string
  imageUrl?: string
  imageAlt?: string
  blocks?: CmsBlock[]
  [key: string]: any
}

export interface CmsPageData {
  id: string
  title: string
  slug: string
  kicker?: string
  lede?: string
  imageUrl?: string
  imageAlt?: string
  /** The page builder content; empty for pages never built. */
  layout?: LayoutNode[]
  meta?: {
    description?: string
    ogImage?: any
  }
  [key: string]: any
}

export interface CmsNavigationData {
  pages: Array<{id: string; title: string; slug: string}>
  categories: any[]
  globalComponents: CmsComponent[]
  gtmId?: string | null
  searchCx?: string | null
  theme?: string | null
  socialLinks?: SocialLink[]
}

export interface CmsPromotionBanner {
  enabled?: boolean
  badge?: string
  text: string
  linkText?: string
  linkHref?: string
  dismissible?: boolean
  accentColor?: string
}

export interface OrgConfig {
  logoStrapline?: string
  name: string
  short: string
  tagline: string
  live: string
  mantra: string[]
  address: string
  phone: string
  phoneHref: string
  email: string
  companyNumber: string
  founded: number
  warningDomain?: string
}

export interface CmsCookieConsent {
  text: string
  acceptLabel: string
  rejectLabel: string
  policyLabel?: string
  policyHref?: string
}

export interface CmsCollectionPage<T> {
  items: T[]
  nextCursor: string | null
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok'
  url: string
}

export interface CmsLayoutProps {
  page: CmsPageData | null | undefined
}
