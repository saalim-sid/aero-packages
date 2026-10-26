import type {BoxProps} from '@chakra-ui/react'
import type {SectionBase} from '@platform/core/types/sections'
import type {IconName} from '@platform/core/types/theme-ui'
import {ICON_PATHS} from '@platform/themes/legal-finance/icon-paths'

const BACKGROUND: Record<NonNullable<SectionBase['background']>, BoxProps> = {
  default: {bg: 'white'},
  muted: {bg: 'bg.muted'},
  brand: {bgImage: 'brand', color: 'white'},
  inverse: {bg: 'bg.inverse', color: 'fg.inverse'}
}

export const frame = (c: SectionBase, own: BoxProps = {}, py = '16'): BoxProps => ({
  ...own,
  ...(c.background ? BACKGROUND[c.background] : {}),
  pt: c.spacing === 'bottom' || c.spacing === 'none' ? '0' : py,
  pb: c.spacing === 'top' || c.spacing === 'none' ? '0' : py
})

export const icon = (name: string | undefined, fallback: IconName): IconName =>
  name && name in ICON_PATHS ? (name as IconName) : fallback
