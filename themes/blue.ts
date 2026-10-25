import type {SiteTheme} from '@platform/core/types/theme'
import {blueButton} from '@platform/themes/blue-recipes'

const scale = (o: Record<string | number, string>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, {value: v}]))

/** Fahaa Associates: clean blue and grey, Lato, MUI-like type scale and shadows. */
export const blueTheme: SiteTheme = {
  cssVarsPrefix: 'fa',
  fonts: {
    heading: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    body: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  palette: {
    blue: scale({50: '#EFF5FF', 400: '#42A5F5', 500: '#3B82F6', 600: '#2563EB', 800: '#0D47A1'}),
    grey: scale({
      50: '#F5F5F5',
      100: '#EEEEEE',
      200: '#E0E0E0',
      300: '#BDBDBD',
      400: '#9E9E9E',
      500: '#757575',
      700: '#616161'
    })
  },
  colors: {
    bg: '#FFFFFF',
    'bg.canvas': '#FFFFFF',
    'bg.muted': 'colors.grey.50',
    'bg.inverse': '#111827',
    surface: '#FFFFFF',
    'surface.raised': 'colors.grey.50',
    fg: '#333333',
    'fg.muted': '#666666',
    'fg.subtle': 'colors.grey.500',
    'fg.inverse': '#FFFFFF',
    'fg.inverse.muted': 'colors.grey.400',
    'fg.inverse.subtle': 'colors.grey.300',
    'fg.inverse.link': 'colors.blue.400',
    border: 'colors.grey.200',
    'border.strong': 'colors.grey.300',
    'border.inverse': 'colors.grey.300',
    'border.inverse.muted': 'colors.grey.700',
    overlay: 'rgba(13, 71, 161, 0.55)',
    'overlay.deep': 'rgba(0, 33, 113, 0.78)',
    danger: '#f44336',
    'danger.muted': '#FDECEA',
    success: '#4caf50',
    brand: {
      solid: 'colors.blue.600',
      contrast: '#FFFFFF',
      muted: 'colors.blue.50',
      emphasized: 'colors.blue.800',
      fg: 'colors.blue.600',
      focus: 'colors.blue.500',
      ghost: 'colors.blue.600'
    }
  },
  shadows: {
    quiet: '0 2px 12px rgba(0,0,0,0.08)',
    lift: '0 8px 24px rgba(0,0,0,0.12)'
  },
  extend: {
    preflight: false,
    theme: {
      breakpoints: {sm: '600px', md: '900px', lg: '1200px', xl: '1536px', '2xl': '1920px'},
      tokens: {
        shadows: scale({
          card: '0 2px 12px rgba(0,0,0,0.08)',
          cardHover: '0 8px 24px rgba(0,0,0,0.12)',
          header: '0 1px 3px rgba(0,0,0,0.12)',
          buttonHover: '0 2px 8px rgba(0,0,0,0.15)',
          heroButton: '0 4px 15px rgba(25, 118, 210, 0.3)',
          heroButtonHover: '0 6px 20px rgba(25, 118, 210, 0.4)',
          image: '0 20px 40px rgba(0,0,0,0.1)',
          badge: '0 10px 30px rgba(0,0,0,0.15)',
          panel: '0 4px 20px rgba(0,0,0,0.08)',
          map: '0 4px 20px rgba(0,0,0,0.1)',
          form: '0 8px 32px rgba(0,0,0,0.1)',
          accordion:
            '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
          drawer:
            '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)'
        }),
        gradients: scale({
          brand: 'linear-gradient(135deg, #2563eb, #0d47a1)',
          heroWash: 'linear-gradient(135deg, #2563eb15 0%, #0d47a125 100%)'
        }),
        sizes: scale({
          'container.sm': '600px',
          'container.md': '900px',
          'container.lg': '1200px',
          lede: '600px',
          'lede.wide': '800px',
          form: '800px',
          drawer: '280px',
          'icon.xs': '1rem',
          'icon.sm': '1.2rem',
          'icon.button.sm': '18px',
          'icon.button.md': '20px',
          'icon.button.lg': '22px',
          'icon.alert': '22px',
          'icon.md': '1.5rem',
          'icon.lg': '2.1875rem',
          avatar: '60px',
          map: '300px',
          'tab.min': '90px',
          'tab.max': '360px',
          'avatar.lg': '120px'
        })
      },
      semanticTokens: {
        colors: {
          primary: {
            DEFAULT: {value: '#2563eb'},
            light: {value: '#42a5f5'},
            dark: {value: '#0d47a1'}
          },
          secondary: {DEFAULT: {value: '#0d47a1'}, light: {value: '#3f51b5'}},
          'success.light': {value: '#81c784'},
          warning: {DEFAULT: {value: '#ff9800'}, light: {value: '#ffb74d'}},
          divider: {value: 'rgba(0, 0, 0, 0.12)'},
          rating: {DEFAULT: {value: '#faaf00'}, empty: {value: 'rgba(0, 0, 0, 0.26)'}},
          action: {
            active: {value: 'rgba(0, 0, 0, 0.54)'},
            disabled: {value: 'rgba(0, 0, 0, 0.26)'},
            disabledBg: {value: 'rgba(0, 0, 0, 0.12)'},
            hover: {value: 'rgba(37, 99, 235, 0.04)'},
            social: {value: 'rgba(25, 118, 210, 0.1)'}
          },
          input: {border: {value: 'rgba(0, 0, 0, 0.23)'}},
          alert: {
            info: {
              bg: {value: 'rgb(239, 247, 254)'},
              fg: {value: 'rgb(40, 72, 98)'},
              icon: {value: '#2196f3'}
            },
            success: {
              bg: {value: 'rgb(237, 247, 237)'},
              fg: {value: 'rgb(30, 70, 32)'},
              icon: {value: '#4caf50'}
            },
            error: {
              bg: {value: 'rgb(253, 237, 237)'},
              fg: {value: 'rgb(95, 33, 32)'},
              icon: {value: '#f44336'}
            }
          },
          backdrop: {value: 'rgba(0, 0, 0, 0.5)'}
        }
      },
      textStyles: {
        h1: {
          value: {fontSize: '3rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01562em'}
        },
        h2: {
          value: {
            fontSize: '2.25rem',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.00833em'
          }
        },
        h3: {value: {fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0em'}},
        h4: {
          value: {fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.00735em'}
        },
        h5: {value: {fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0em'}},
        h6: {
          value: {fontSize: '1rem', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.0075em'}
        },
        subtitle1: {
          value: {fontSize: '1rem', fontWeight: 400, lineHeight: 1.75, letterSpacing: '0.00938em'}
        },
        subtitle2: {value: {fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57}},
        body1: {
          value: {fontSize: '1rem', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.00938em'}
        },
        body2: {
          value: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: '0.01071em'
          }
        },
        caption: {
          value: {fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.03333em'}
        },
        input: {value: {fontSize: '1rem', lineHeight: '1.4375em', letterSpacing: '0.00938em'}},
        chip: {value: {fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.6}},
        badge: {
          value: {fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.6, letterSpacing: '0.00938em'}
        },
        tab: {
          value: {fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.25, letterSpacing: '0.02857em'}
        },
        avatar: {value: {fontSize: '1.25rem', lineHeight: 1}}
      },
      layerStyles: {
        card: {
          value: {
            bg: 'white',
            color: 'fg',
            borderRadius: 'md',
            boxShadow: 'card',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
            _hover: {boxShadow: 'cardHover', transform: 'translateY(-2px)'}
          }
        },
        gradientText: {value: {bgImage: 'brand', bgClip: 'text', color: 'transparent'}}
      },
      recipes: {fahaaButton: blueButton}
    },
    globalCss: {
      html: {
        bg: 'transparent',
        boxSizing: 'border-box',
        ...({
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          WebkitTextSizeAdjust: '100%'
        } as object)
      },
      '*, *::before, *::after': {boxSizing: 'inherit'},
      'strong, b': {fontWeight: 700},
      body: {m: 0, color: 'fg', bg: 'bg', fontFamily: 'body', textStyle: 'body1'}
    }
  }
}
