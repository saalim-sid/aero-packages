import type {SiteTheme} from '@platform/core/types/theme'

/** Neutral starting theme: the builder preview uses it until a website picks its own theme. */
export const classicTheme: SiteTheme = {
  fonts: {
    heading: 'Georgia, "Times New Roman", serif',
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  },
  colors: {
    bg: '#FFFFFF',
    'bg.canvas': '#F7F6F3',
    'bg.muted': '#EFEDE8',
    'bg.inverse': '#1C1B19',
    surface: '#FFFFFF',
    'surface.raised': '#FFFFFF',
    fg: '#1C1B19',
    'fg.muted': '#5C5A55',
    'fg.subtle': '#8A877F',
    'fg.inverse': '#FFFFFF',
    'fg.inverse.muted': 'rgba(255, 255, 255, 0.8)',
    'fg.inverse.subtle': 'rgba(255, 255, 255, 0.6)',
    'fg.inverse.link': '#FFFFFF',
    border: '#E2DFD8',
    'border.strong': '#C9C5BB',
    'border.inverse': 'rgba(255, 255, 255, 0.4)',
    'border.inverse.muted': 'rgba(255, 255, 255, 0.2)',
    overlay: 'rgba(0, 0, 0, 0.45)',
    'overlay.deep': 'rgba(0, 0, 0, 0.65)',
    danger: '#B42318',
    'danger.muted': '#FEE4E2',
    success: '#067647',
    brand: {
      solid: '#1F4E79',
      contrast: '#FFFFFF',
      muted: '#E3ECF5',
      emphasized: '#163A5B',
      fg: '#1F4E79',
      focus: '#2E6DA4',
      ghost: '#2E6DA4'
    }
  }
}
