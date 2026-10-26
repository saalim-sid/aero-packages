import type {ThemeChrome} from '@platform/core/types/theme'
import {legalFinanceChrome} from '@platform/themes/legal-finance/chrome'

// Header and footer per theme; kept apart from the registry because they need the website's own settings.
export const themeChrome: Record<string, ThemeChrome> = {blue: legalFinanceChrome}
