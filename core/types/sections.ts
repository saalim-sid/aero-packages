import type {FaqItem} from '@platform/core/types/ui'

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

export interface Link {
  label: string
  href: string
}

export interface Stat {
  value: string
  label: string
}

export type SectionBackground = 'default' | 'muted' | 'brand' | 'inverse'

export interface SectionBase {
  heading?: 'page' | 'section' | 'sub'
  eyebrow?: string
  title?: string
  lede?: string
  ledeWidth?: number
  background?: SectionBackground
  spacing?: 'both' | 'top' | 'bottom' | 'none'
}

export interface PageHeaderSection extends SectionBase {
  icon?: string
  imageUrl?: string
  imageAlt?: string
  breadcrumb?: Link[]
}

export interface HeroSection extends SectionBase {
  imageUrl?: string
  imageAlt?: string
  backgroundImageUrl?: string
  overlay?: number
  primaryCta?: Link
  secondaryCta?: Link
  stats?: Stat[]
  badges?: Array<{title: string; caption?: string}>
}

export interface FeatureItem {
  icon?: string
  tone?: string
  number?: string
  badge?: string
  title: string
  body?: string
  bullets?: string[]
  href?: string
  linkLabel?: string
}

export interface CtaSection extends SectionBase {
  variant?: 'band' | 'panel' | 'card'
  body?: string
  primary?: Link
  secondary?: Link
  phone?: string
  email?: string
}

export interface FeaturesSection extends SectionBase {
  variant?: 'cards' | 'compact' | 'icons' | 'centered' | 'list' | 'numbered'
  items: FeatureItem[]
  linkLabel?: string
  highlights?: {title?: string; items: FeatureItem[]}
  cta?: CtaSection
}

export interface StepsSection extends SectionBase {
  items: StepItem[]
}

export interface StatsSection extends SectionBase {
  items: Stat[]
}

export interface SplitSection extends SectionBase {
  imageUrl?: string
  imageAlt?: string
  imageSide?: 'left' | 'right'
  body?: string[]
  bullets?: string[]
  quote?: string
  cite?: string
  cta?: Link
}

export interface TestimonialItem {
  name: string
  role?: string
  company?: string
  quote: string
  rating?: number
  imageUrl?: string
}

export interface TestimonialsSection extends SectionBase {
  variant?: 'grid' | 'carousel'
  items: TestimonialItem[]
  stats?: Stat[]
}

export interface FaqSection extends SectionBase {
  items: FaqItem[]
  cta?: Link
}

export interface FormSection extends SectionBase {
  variant?: 'contact' | 'question'
  formTitle?: string
  choiceLabel?: string
  choices?: Array<{value: string; label: string}>
  submitLabel?: string
  sendingLabel?: string
  successMessage?: string
  noteTitle?: string
  note?: string
  aside?: {title?: string; faqs?: FaqItem[]; noteTitle?: string; note?: string}
}

export interface ContactInfo {
  icon?: string
  title: string
  details: string[]
  body?: string
}

export interface ContactSection extends SectionBase {
  info?: ContactInfo[]
  infoTitle?: string
  mapTitle?: string
  mapUrl?: string
  form?: FormSection
}

export interface TeamMember {
  name: string
  role?: string
  bio?: string
  imageUrl?: string
  email?: string
  phone?: string
  experience?: string
  tags?: string[]
  details?: Array<{label: string; values: string[]; icon?: string; bullet?: boolean}>
}

export interface TeamSection extends SectionBase {
  tagsLabel?: string
  items: TeamMember[]
}

export interface TabsSection extends SectionBase {
  tabs: Array<{id: string; label: string; icon?: string; title?: string; items: FeatureItem[]}>
  bulletsLabel?: string
  cta?: CtaSection
}

export interface RichTextBlock {
  heading?: string
  intro?: string
  body?: string[]
  list?: string[]
  links?: Link[]
  highlight?: boolean
}

export interface RichTextSection extends SectionBase {
  blocks: RichTextBlock[]
  updated?: string
}

export interface MediaSection extends SectionBase {
  variant: 'slider' | 'video'
  images?: Array<{imageUrl: string; imageAlt?: string}>
  videos?: VideoItem[]
  overlay?: number
  cta?: Link
}

export interface DetailSection extends SectionBase {
  icon?: string
  breadcrumb?: Link[]
  overviewTitle?: string
  overview?: string[]
  checklistTitle?: string
  checklist?: string[]
  stepsTitle?: string
  steps?: StepItem[]
  faqTitle?: string
  faqs?: FaqItem[]
  contact?: CtaSection
  relatedTitle?: string
  related?: Link[]
  cta?: CtaSection
}

export interface SectionMap {
  'page-header': PageHeaderSection
  hero: HeroSection
  features: FeaturesSection
  steps: StepsSection
  stats: StatsSection
  split: SplitSection
  testimonials: TestimonialsSection
  faq: FaqSection
  cta: CtaSection
  contact: ContactSection
  form: FormSection
  team: TeamSection
  tabs: TabsSection
  'rich-text': RichTextSection
  media: MediaSection
  detail: DetailSection
}

export type SectionType = keyof SectionMap
