import type {CmsComponent} from '@platform/core/types/cms'
import type {ThemeEntry} from '@platform/core/types/theme'
import {blueTheme} from '@platform/themes/blue'
import {classicTheme} from '@platform/themes/classic'
import {forestTheme} from '@platform/themes/forest'
import {legalFinanceSections} from '@platform/themes/legal-finance/sections'
import type {ComponentType} from 'react'

export const themes: Record<string, ThemeEntry> = {
  classic: {label: 'Classic', category: 'General', theme: classicTheme},
  forest: {label: 'Charity', category: 'Charity', theme: forestTheme},
  blue: {
    label: 'Legal & Finance',
    category: 'Legal & Finance',
    theme: blueTheme,
    sections: legalFinanceSections
  }
}

/** The theme's own renderer for a contract section, or undefined for any other component type. */
export function themeSection(
  key: string | null | undefined,
  componentType: string | undefined
): ComponentType<{component: CmsComponent}> | undefined {
  const sections = key ? themes[key]?.sections : undefined
  return sections && componentType && Object.hasOwn(sections, componentType)
    ? (sections[componentType as keyof typeof sections] as ComponentType<{component: CmsComponent}>)
    : undefined
}
