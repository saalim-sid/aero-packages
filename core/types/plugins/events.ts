export interface CmsEventItem {
  slug: string | {current: string}
  title: string
  kicker: string
  lede: string
  imageUrl?: string
  imageAlt?: string
  secondaryLabel?: string
  secondaryHref?: string
  date: string
  place: string
  body: string[]
}
