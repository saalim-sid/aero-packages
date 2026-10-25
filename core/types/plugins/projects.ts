export interface CmsProject {
  slug: string | {current: string}
  title: string
  kicker?: string
  lede: string
  imageUrl?: string
  imageAlt?: string
  secondaryLabel?: string
  secondaryHref?: string
  body: string[]
}
