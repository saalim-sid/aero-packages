export interface CardItem {
  title: string
  body?: string
  href?: string
  cta?: string
  badge?: string
}

export interface CardsGridSectionProps {
  eyebrow?: string
  title?: string
  lede?: string
  items?: CardItem[]
  columns?: {base: number; md?: number; lg?: number}
}

export interface StepItem {
  title: string
  body?: string
}

export interface NumberedStepsSectionProps {
  eyebrow?: string
  title?: string
  lede?: string
  items?: StepItem[]
  columns?: {base: number; md?: number}
}

export interface BenefitItem {
  title: string
  body?: string
  icon?: string
}

export interface FeatureListSectionProps {
  title?: string
  lede?: string
  items?: BenefitItem[]
}

export interface CtaBandProps {
  title?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
}

export interface HowYouCanHelpProps {
  items?: string[]
  eyebrow?: string
  heading?: string
  footerText?: string
}

export interface VideoItem {
  _key?: string
  title?: string
  description?: string
  youtubeUrl?: string
}
