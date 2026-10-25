export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
  disabled?: boolean
  label?: string
}

export interface SliderImage {
  src: string
  alt: string
}

export interface ImageSliderProps {
  slides: SliderImage[]
  interval?: number
  label: string
}

export interface Crumb {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: Crumb[]
  inverse?: boolean
}

export interface PageHeroProps {
  kicker?: string
  title?: string
  lede?: string
  imageUrl?: string
  imageAlt?: string
  actions?: import('react').ReactNode
  compact?: boolean
  breadcrumbs?: Crumb[]
}

export interface FaqItem {
  question: string
  answer: string
}
