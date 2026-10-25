import {createSystem, defaultConfig, defineConfig} from '@chakra-ui/react'
import type {SiteTheme} from '@platform/core/types/theme'

// Theme page rules (html, body, *) apply to the preview element instead.
const rescope = (css: Record<string, object>, scope: string) => {
  const out: Record<string, object> = {}
  for (const [selector, rules] of Object.entries(css)) {
    const key = selector
      .split(',')
      .map((s) =>
        s
          .trim()
          .replace(/^(html|body)$/, scope)
          .replace(/^(?!\.|\[)/, `${scope} `)
      )
      .map((s) => s.replace(`${scope} ${scope}`, scope))
      .join(', ')
    out[key] = {...out[key], ...rules}
  }
  return out
}

// The browser's own text selection colour instead of Chakra's grey one.
const {'*::selection': _selection, ...baseGlobalCss} = defaultConfig.globalCss ?? {}
export const baseConfig = {...defaultConfig, globalCss: baseGlobalCss}

const tokens = (o: Record<string, string>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, {value: v}]))

/** `scope` (a CSS selector) keeps the theme inside that element, so the CMS can preview a site without restyling itself. */
export function createSiteSystem(site: SiteTheme, scope?: string) {
  const {brand, ...colors} = site.colors
  const page = {bg: 'bg', color: 'fg', fontFamily: 'body', lineHeight: 'tall'}
  const config = defineConfig({
    cssVarsPrefix: site.cssVarsPrefix || 'site',
    strictTokens: true,
    ...(scope ? {cssVarsRoot: scope, preflight: {scope}} : {}),
    globalCss: scope
      ? {[scope]: page}
      : {
          html: {bg: 'bg', color: 'fg', minHeight: '100%'},
          body: {...page, minHeight: '100%'},
          'html, body': {margin: '0', padding: '0'},
          'a, button': {WebkitTapHighlightColor: 'transparent'},
          "button:not(:disabled), [role='button']:not(:disabled)": {cursor: 'pointer'}
        },
    theme: {
      tokens: {
        fonts: tokens({mono: "ui-monospace, 'SF Mono', Menlo, monospace", ...site.fonts}),
        colors: site.palette || {},
        shadows: tokens(
          site.shadows || {
            quiet: '0 1px 2px rgba(0, 0, 0, 0.06)',
            lift: '0 12px 32px rgba(0, 0, 0, 0.10)'
          }
        ),
        radii: tokens({
          none: '0px',
          xs: '4px',
          sm: '8px',
          md: '12px',
          lg: '16px',
          xl: '24px',
          '2xl': '32px',
          full: '9999px'
        }),
        sizes: tokens({content: '72rem', wide: '80rem', prose: '42rem', narrow: '34rem'})
      },
      semanticTokens: {colors: {...tokens(colors), brand: tokens(brand)}},
      recipes: {
        button: {
          base: {
            fontFamily: 'body',
            fontWeight: 'medium',
            borderRadius: 'md',
            transitionProperty: 'background, color, transform, box-shadow',
            transitionDuration: 'fast',
            _focusVisible: {
              outline: '2px solid',
              outlineColor: 'brand.focus',
              outlineOffset: '2px'
            },
            _active: {transform: 'scale(0.98)'}
          }
        }
      }
    }
  })
  return createSystem(
    scope ? {...baseConfig, globalCss: {}} : baseConfig,
    config,
    scope && site.extend?.globalCss
      ? {...site.extend, globalCss: rescope(site.extend.globalCss as Record<string, object>, scope)}
      : site.extend || {}
  )
}
