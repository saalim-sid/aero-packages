import type {SystemConfig} from '@chakra-ui/react'
import type {ReactNode} from 'react'

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

/** One choosable theme. A new theme is one file in themes/ plus one line in the registry. */
export interface ThemeEntry {
  label: string
  category: string
  theme: SiteTheme
}

export interface ProviderProps {
  children: ReactNode
  hasSession?: boolean
  /** A key of the themes registry, or null for the site's own theme. */
  theme?: string | null
}
