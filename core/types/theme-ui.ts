import type {Link} from '@platform/core/types/sections'

export interface SiteHeaderData {
  primaryNav?: Link[]
  cta?: Link
}

export interface SiteFooterData {
  tagline?: string
  phone?: string
  email?: string
  addressLines?: string[]
  quickLinksTitle?: string
  quickLinks?: Link[]
  columns?: Array<{title: string; items: Link[]}>
  socials?: Array<{platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram'; href: string}>
  legalLinks?: Link[]
  copyright?: string
}

export interface ContactFormData {
  title: string
  subjects: Array<{value: string; label: string}>
  submitLabel: string
  sendingLabel: string
  privacyNote: string
  successMessage: string
}

export interface QuestionFormData {
  title: string
  typeLabel: string
  types: Array<{value: string; label: string}>
  submitLabel: string
  sendingLabel: string
  policyTitle: string
  policy: string
  successMessage: string
}

export interface PageHeaderData {
  title: string
  lede: string
  ledeWidth?: number
}

export interface SectionHeadingData {
  title: string
  lede: string
}

export type IconName = keyof typeof import('@platform/themes/legal-finance/icon-paths').ICON_PATHS

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'alert'

export type Breakpoint = 'sm' | 'md' | 'lg'

export interface IconProps {
  name: IconName
  size?: IconSize
}

export interface TextProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
  as?: string
  children?: React.ReactNode
}

export interface ColProps {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  children?: React.ReactNode
}

export interface ButtonProps {
  variant?: 'text' | 'contained' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  href?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
  children?: React.ReactNode
}

export interface TextFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: boolean
  helperText?: string
  type?: 'text' | 'email' | 'tel'
  rows?: number
  placeholder?: string
  options?: Array<{value: string; label: string}>
}

export interface RadioGroupProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{value: string; label: string}>
  error?: string
}

export interface AlertProps {
  severity: 'info' | 'success' | 'error'
  mt?: string
  children: React.ReactNode
}
