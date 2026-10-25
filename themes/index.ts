import type {ThemeEntry} from '@platform/core/types/theme'
import {blueTheme} from '@platform/themes/blue'
import {classicTheme} from '@platform/themes/classic'
import {forestTheme} from '@platform/themes/forest'

export const themes: Record<string, ThemeEntry> = {
  classic: {label: 'Classic', category: 'General', theme: classicTheme},
  forest: {label: 'Forest', category: 'Charity', theme: forestTheme},
  blue: {label: 'Blue', category: 'Legal & Finance', theme: blueTheme}
}
