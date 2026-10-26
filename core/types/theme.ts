import type {SystemConfig} from '@chakra-ui/react'
import type {FooterProps, HeaderProps} from '@platform/core/types/platform'
import type {SectionMap, SectionType} from '@platform/core/types/sections'
import type {ComponentType, ReactNode} from 'react'

type Token = {value: string}

/** Colour names every platform component uses. A site theme must define all of them. */
export type SemanticColor =
  | 'bg'
  | 'bg.canvas'
  | 'bg.muted'
  | 'bg.inverse'
  | 'surface'
  | 'surface.raised'
  | 'fg'
  | 'fg.muted'
  | 'fg.subtle'
  | 'fg.inverse'
  | 'fg.inverse.muted'
  | 'fg.inverse.subtle'
  | 'fg.inverse.link'
  | 'border'
  | 'border.strong'
  | 'border.inverse'
  | 'border.inverse.muted'
  | 'overlay'
  | 'overlay.deep'
  | 'danger'
  | 'danger.muted'
  | 'success'

export type BrandColor = 'solid' | 'contrast' | 'muted' | 'emphasized' | 'fg' | 'focus' | 'ghost'

export interface SiteTheme {
  cssVarsPrefix?: string
  fonts: {heading: string; body: string; mono?: string}
  palette?: Record<string, Record<string, Token>>
  colors: Record<SemanticColor, string> & {brand: Record<BrandColor, string>}
  shadows?: {quiet: string; lift: string}
  extend?: SystemConfig
}

export type SectionComponents = {
  [K in SectionType]: ComponentType<{component: SectionMap[K] & {_id: string}}>
}

/** One choosable theme: its tokens, and for a full design every contract section. A new theme is one folder in themes/ plus one line in the registry. */
export interface ThemeEntry {
  label: string
  category: string
  theme: SiteTheme
  sections?: SectionComponents
}

export interface ThemeChrome {
  Header: ComponentType<HeaderProps>
  Footer: ComponentType<FooterProps>
}

export interface ProviderProps {
  children: ReactNode
  hasSession?: boolean
  /** A key of the themes registry, or null for the site's own theme. */
  theme?: string | null
}
