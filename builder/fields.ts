import type {FieldDef, FieldOption, LinkValue} from '@platform/core/types/layout'

export const opts = (...pairs: [string, string][]): FieldOption[] =>
  pairs.map(([value, label]) => ({value, label}))

export const ALIGN = opts(['left', 'Left'], ['center', 'Center'], ['right', 'Right'])
export const VERTICAL = opts(
  ['', 'Default'],
  ['top', 'Top'],
  ['middle', 'Middle'],
  ['bottom', 'Bottom']
)
export const SIZES = opts(['xs', 'XS'], ['sm', 'S'], ['md', 'M'], ['lg', 'L'], ['xl', 'XL'])
export const SHAPES = opts(['square', 'Square'], ['rounded', 'Rounded'], ['round', 'Round'])
export const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh']

const advanced: FieldDef[] = [
  {name: 'elementId', type: 'text', label: 'Element ID', half: true},
  {name: 'className', type: 'text', label: 'Extra class name', half: true}
]
const design: FieldDef = {
  name: 'design',
  type: 'design',
  label: 'Design options',
  group: 'Design options'
}
export const responsive: FieldDef = {
  name: 'responsive',
  type: 'responsive',
  label: 'Responsiveness',
  group: 'Responsiveness'
}

/** An element's own fields plus the ones every element has: id, class and design options. */
export const withCommon = (...fields: FieldDef[]): FieldDef[] => [...fields, ...advanced, design]

export const str = (v: unknown) => (typeof v === 'string' ? v : '')

/** Anchor attributes for a link field. */
export function linkAttrs(link: unknown) {
  const l = (link || {}) as LinkValue
  if (!l.url) return null
  return {
    href: l.url,
    title: l.title || undefined,
    target: l.newTab ? '_blank' : undefined,
    rel: [l.newTab && 'noopener', l.nofollow && 'nofollow'].filter(Boolean).join(' ') || undefined
  }
}
