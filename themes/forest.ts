import type {SiteTheme} from '@platform/core/types/theme'

const scale = (o: Record<number, string>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, {value: v}]))

/** Forest greens on warm cream, Fraunces headings and Outfit body text. */
export const forestTheme: SiteTheme = {
  cssVarsPrefix: 'wt',
  fonts: {
    heading: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    body: "var(--font-outfit), 'Segoe UI', system-ui, sans-serif"
  },
  palette: {
    forest: scale({
      25: '#F6F8F6',
      50: '#EEF3F0',
      100: '#D7E4DC',
      200: '#B5CBBD',
      300: '#8AAD96',
      400: '#5E8A6E',
      500: '#3F6F58',
      600: '#325846',
      700: '#284638',
      800: '#1F3D32',
      900: '#17241E',
      950: '#0E1612'
    }),
    cream: scale({
      50: '#FDFCFA',
      100: '#F7F3EA',
      200: '#F4EFE4',
      300: '#E8DFD0',
      400: '#D4C6B0',
      500: '#B9A68C'
    })
  },
  colors: {
    bg: 'colors.cream.200',
    'bg.canvas': 'colors.cream.100',
    'bg.muted': 'colors.cream.300',
    'bg.inverse': 'colors.forest.900',
    surface: 'colors.cream.50',
    'surface.raised': 'colors.cream.100',
    fg: 'colors.forest.900',
    'fg.muted': 'colors.forest.700',
    'fg.subtle': 'colors.forest.600',
    'fg.inverse': 'colors.cream.100',
    'fg.inverse.muted': 'colors.cream.200',
    'fg.inverse.subtle': 'colors.forest.200',
    'fg.inverse.link': 'colors.forest.100',
    border: 'colors.cream.400',
    'border.strong': 'colors.forest.200',
    'border.inverse': 'colors.cream.300',
    'border.inverse.muted': 'colors.forest.800',
    overlay: 'rgba(14, 22, 18, 0.58)',
    'overlay.deep': 'rgba(14, 22, 18, 0.78)',
    danger: '#7A2E24',
    'danger.muted': '#F4E4E0',
    success: 'colors.forest.600',
    brand: {
      solid: 'colors.forest.800',
      contrast: 'colors.cream.100',
      muted: 'colors.forest.50',
      emphasized: 'colors.forest.700',
      fg: 'colors.forest.800',
      focus: 'colors.forest.500',
      ghost: 'colors.forest.400'
    }
  },
  shadows: {
    quiet: '0 1px 2px rgba(23, 36, 30, 0.06)',
    lift: '0 12px 32px rgba(23, 36, 30, 0.10)'
  }
}
