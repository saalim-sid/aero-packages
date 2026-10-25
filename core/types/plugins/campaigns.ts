export interface CmsCampaign {
  slug: string | {current: string}
  title: string
  kicker: string
  lede: string
  imageUrl?: string
  imageAlt?: string
  secondaryLabel?: string
  secondaryHref?: string
  body: string[]
  facts?: Array<{value: string; label: string}>
  quotes?: Array<{text: string; cite?: string}>
}
