import type {AuthUser} from '@platform/core/types/auth'
import type {CmsComponent, CmsPageData, SocialLink} from '@platform/core/types/cms'
import type {ComponentType, ReactNode} from 'react'

export type BlockComponent = ComponentType<{component: CmsComponent}>

export interface AccountTabProps {
  page: CmsPageData | null
  back: ReactNode
}

export interface AccountTab {
  label: string
  icon?: ComponentType<{size?: number; style?: React.CSSProperties}>
  href?: string
  Panel?: ComponentType<AccountTabProps>
}

export interface AccountStat {
  value: string
  label: string
}

export interface AccountSectionProps {
  page: CmsPageData | null
  openTab: (id: string) => void
}

export interface PlatformPlugin {
  id: string
  routes?: string[]
  blocks?: Record<string, BlockComponent>
  accountTab?: AccountTab
  accountStats?: (profile: AuthUser, page: CmsPageData | null) => AccountStat[]
  accountSection?: ComponentType<AccountSectionProps>
  accountAction?: {href: string; labelField: string}
  referrals?: boolean
  sections?: Record<string, () => Promise<ComponentType>>
  sitemap?: () => Promise<string[]>
}

export interface SiteMeta {
  name: string
  shortName: string
  description: string
  locale?: string
  currency?: string
  twitter?: string
  sameAs?: string[]
  themeColor?: string
  home?: {title: string; description: string}
  members?: boolean
  jsonLd?: {type: string; country?: string; identifiers?: Record<string, string>}
}

export interface HeaderProps {
  cmsData?: CmsComponent | null
  searchCx?: string | null
  socialLinks?: SocialLink[]
  logoAfter?: ReactNode
}

export interface FooterProps {
  cmsData?: CmsComponent | null
  logoAfter?: ReactNode
}

export interface SiteConfig {
  meta: SiteMeta
  theme?: string
  plugins: PlatformPlugin[]
  blocks?: Record<string, BlockComponent>
  components?: {Header?: ComponentType<HeaderProps>; Footer?: ComponentType<FooterProps>}
  sitemap?: string[]
}
