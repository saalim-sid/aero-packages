import type {
  BoxSides,
  DesignOptions,
  Device,
  LayoutNode,
  ResponsiveColumn
} from '@platform/core/types/layout'

/** Device ranges, measured on the page container (not the window) so editor previews match phones. */
export const DEVICES: {key: Device; label: string; min: number; max?: number; preview: number}[] = [
  {key: 'xs', label: 'Mobile portrait', min: 0, max: 767, preview: 480},
  {key: 'sm', label: 'Mobile landscape', min: 768, max: 991, preview: 768},
  {key: 'md', label: 'Tablet portrait', min: 992, max: 1199, preview: 1024},
  {key: 'lg', label: 'Tablet landscape', min: 1200, max: 1399, preview: 1280},
  {key: 'xl', label: 'Desktop', min: 1400, preview: 1440}
]

/** Layout rules every page needs once. */
export const BASE_CSS = `
.lb-page{container:lb-page/inline-size}
.lb-body{padding-inline:16px}
.lb-row{display:flex;flex-wrap:wrap;column-gap:var(--lb-gap,30px);row-gap:var(--lb-gap,30px)}
.lb-row>.lb-col{box-sizing:border-box;width:100%;min-width:0}
.lb-body>.lb-row,.lb-section>.lb-row{max-width:var(--lb-content,1200px);margin-inline:auto}
.lb-body>.lb-stretch,.lb-body>.lb-section{margin-inline:-16px;max-width:none}
.lb-body>.lb-section{padding-inline:16px}
.lb-stretch.lb-stretch-row{padding-inline:max(16px,calc((100% - var(--lb-content,1200px))/2))}
.lb-stretch.lb-stretch-content{padding-inline:16px}
.lb-row.lb-equal>.lb-col{display:flex;flex-direction:column}
.lb-row.lb-top{align-items:flex-start}.lb-row.lb-middle{align-items:center}.lb-row.lb-bottom{align-items:flex-end}
.lb-el+.lb-el{margin-top:var(--lb-el-gap,1.5rem)}
`

// A share of the row's width with the gaps between columns taken out; shares adding up to 1 fill the row.
export const fraction = (value: string) => {
  const [n, d] = value.split('/').map(Number)
  if (!(n > 0 && d > 0)) return undefined
  const share = +(n / d).toFixed(6)
  return share === 1 ? '100%' : `calc(${share} * (100% + var(--lb-gap,30px)) - var(--lb-gap,30px))`
}

const offsetOf = (value: string) => {
  const [n, d] = value.split('/').map(Number)
  return n > 0 && d > 0 ? `calc(${+(n / d).toFixed(6)} * (100% + var(--lb-gap,30px)))` : undefined
}

const at = (device: Device, rules: string, only = false) => {
  const d = DEVICES.find((x) => x.key === device)!
  const range = [
    d.min ? `(min-width:${d.min}px)` : '',
    only && d.max ? `(max-width:${d.max}px)` : ''
  ].filter(Boolean)
  return range.length ? `@container lb-page ${range.join(' and ')}{${rules}}` : rules
}

const sides = (prop: string, box?: BoxSides, suffix = '') =>
  (['top', 'right', 'bottom', 'left'] as const)
    .filter((s) => box?.[s])
    .map((s) => `${prop}-${s}${suffix}:${box![s]}`)

function designRules(d: DesignOptions, url: (value: string) => string): string[] {
  const rules = [
    ...sides('margin', d.margin),
    ...sides('padding', d.padding),
    ...sides('border', d.border, '-width')
  ]
  if (d.border && Object.values(d.border).some(Boolean))
    rules.push(`border-style:${d.borderStyle || 'solid'}`)
  if (d.borderColor) rules.push(`border-color:${d.borderColor}`)
  const r = d.radius
  if (r)
    for (const [k, prop] of [
      ['topLeft', 'top-left'],
      ['topRight', 'top-right'],
      ['bottomRight', 'bottom-right'],
      ['bottomLeft', 'bottom-left']
    ] as const)
      if (r[k]) rules.push(`border-${prop}-radius:${r[k]}`)
  if (d.background) rules.push(`background-color:${d.background}`)
  if (d.backgroundImage) {
    rules.push(`background-image:url("${url(d.backgroundImage).replace(/["\\\n]/g, '')}")`)
    const style = d.backgroundStyle || 'cover'
    rules.push(
      style === 'cover' || style === 'contain'
        ? `background-size:${style};background-position:center;background-repeat:no-repeat`
        : `background-repeat:${style}`
    )
  }
  return rules
}

// Values come from editors: keep CSS punctuation out so one setting cannot break the page's styles.
const clean = (css: string) => css.replace(/[<>{}]/g, '')

/** The CSS for every element of a page: design options and column widths, scoped by element id. */
export function layoutCss(nodes: LayoutNode[], resolveUrl?: (value: string) => string | undefined): string {
  const url = (value: string) => resolveUrl?.(value) || value
  const out: string[] = []
  const walk = (node: LayoutNode) => {
    const sel = `.lb-page .b-${node.id}`
    const design = node.settings.design as DesignOptions | undefined
    if (design) {
      const rules = designRules(design, url)
      if (rules.length) out.push(`${sel}{${clean(rules.join(';'))}}`)
    }
    if (node.settings.gap !== undefined && node.settings.gap !== '')
      out.push(`${sel}{--lb-gap:${clean(String(node.settings.gap))}}`)
    if (typeof node.settings.width === 'string') {
      const width = fraction(node.settings.width)
      if (width) out.push(at('sm', `${sel}{width:${width}}`))
    }
    const responsive = node.settings.responsive as ResponsiveColumn | undefined
    for (const d of DEVICES) {
      const r = responsive?.[d.key]
      if (!r) continue
      const width = r.width && fraction(r.width)
      const offset = r.offset === '0' ? '0' : r.offset && offsetOf(r.offset)
      // Mobile settings stop at the next size up; larger sizes carry upwards until overridden.
      const xs = d.key === 'xs'
      if (width) out.push(at(d.key, `${sel}{width:${width}}`, xs))
      if (offset) out.push(at(d.key, `${sel}{margin-left:${offset}}`, xs))
      if (r.hide) out.push(at(d.key, `${sel}{display:none}`, true))
    }
    node.children?.forEach(walk)
  }
  nodes.forEach(walk)
  return out.join('\n')
}
