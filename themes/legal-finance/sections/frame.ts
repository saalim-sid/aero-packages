import type {SectionBase} from '@platform/core/types/sections'
import type {FahaaIconName} from '@platform/core/types/themes/legal-finance'
import {ICON_PATHS} from '@platform/themes/legal-finance/icon-paths'
import type {BoxProps} from '@chakra-ui/react'

const BACKGROUND: Record<NonNullable<SectionBase['background']>, BoxProps> = {
  default: {bg: 'white'},
  muted: {bg: 'bg.muted'},
  brand: {bgImage: 'brand', color: 'white'},
  inverse: {bg: 'bg.inverse', color: 'fg.inverse'}
}

/** Root box of a section: its own look, then the editor's background, then padding per `spacing`. */
export const frame = (c: SectionBase, own: BoxProps = {}, py = '16'): BoxProps => ({
  ...own,
  ...(c.background ? BACKGROUND[c.background] : {}),
  pt: c.spacing === 'bottom' || c.spacing === 'none' ? '0' : py,
  pb: c.spacing === 'top' || c.spacing === 'none' ? '0' : py
})

export const icon = (name: string | undefined, fallback: FahaaIconName): FahaaIconName =>
  name && name in ICON_PATHS ? (name as FahaaIconName) : fallback
