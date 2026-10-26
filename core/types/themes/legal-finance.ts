export interface FahaaLink {
  label: string
  href: string
}

export interface FahaaHeaderData {
  primaryNav?: FahaaLink[]
  cta?: FahaaLink
}

export interface FahaaFooterData {
  tagline?: string
  phone?: string
  email?: string
  addressLines?: string[]
  quickLinksTitle?: string
  quickLinks?: FahaaLink[]
  columns?: Array<{title: string; items: FahaaLink[]}>
  socials?: Array<{platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram'; href: string}>
  legalLinks?: FahaaLink[]
  copyright?: string
}

export interface FahaaContactFormData {
  title: string
  subjects: Array<{value: string; label: string}>
  submitLabel: string
  sendingLabel: string
  privacyNote: string
  successMessage: string
}

export interface FahaaPageHeaderData {
  title: string
  lede: string
  ledeWidth?: number
}

export interface FahaaQueryFormData {
  title: string
  typeLabel: string
  types: Array<{value: string; label: string}>
  submitLabel: string
  sendingLabel: string
  policyTitle: string
  policy: string
  successMessage: string
}

export type FahaaIconName =
  keyof typeof import('@platform/themes/legal-finance/icon-paths').ICON_PATHS

export type FahaaBreakpoints = 'sm' | 'md' | 'lg'

export interface FahaaTextProps {
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

export type FahaaIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'alert'

export interface FahaaIconProps {
  name: FahaaIconName
  size?: FahaaIconSize
}

export interface FahaaColProps {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  children?: React.ReactNode
}

export interface FahaaButtonProps {
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

export interface FahaaFieldProps {
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

export interface FahaaRadioGroupProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<{value: string; label: string}>
  error?: string
}

export interface FahaaAlertProps {
  severity: 'info' | 'success' | 'error'
  mt?: string
  children: React.ReactNode
}

export interface FahaaSectionHeadingData {
  title: string
  lede: string
}
