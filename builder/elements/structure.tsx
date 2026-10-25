import {EmptyColumn} from '@platform/builder/EmptyColumn'
import {Box} from '@chakra-ui/react'
import {responsive, str, VERTICAL, withCommon} from '@platform/builder/fields'
import type {ElementDef, LayoutNode} from '@platform/core/types/layout'

export const newId = () => crypto.randomUUID().replace(/-/g, '').slice(0, 10)

export const newColumn = (width: string, type = 'column'): LayoutNode => ({
  id: newId(),
  type,
  settings: {width},
  children: []
})

const rowFields = withCommon(
  {
    name: 'title',
    type: 'text',
    label: 'Row title',
    help: 'Only shown in the editor.',
    summary: true
  },
  {
    name: 'stretch',
    type: 'select',
    label: 'Row stretch',
    options: [
      {value: '', label: 'Default (boxed)'},
      {value: 'row', label: 'Stretch row'},
      {value: 'content', label: 'Stretch row and content'},
      {value: 'contentNoSpace', label: 'Stretch row and content (no padding)'}
    ]
  },
  {name: 'hide', type: 'toggle', label: 'Hide row', half: true},
  {name: 'equalHeight', type: 'toggle', label: 'Equal height', half: true},
  {
    name: 'gap',
    type: 'number',
    label: 'Column gap',
    units: ['px', 'rem'],
    default: '30px',
    half: true
  },
  {name: 'minHeight', type: 'number', label: 'Minimum height', units: ['px', 'vh'], half: true},
  {name: 'contentPosition', type: 'buttons', label: 'Content position', options: VERTICAL}
)

const STRETCH: Record<string, string> = {
  row: 'lb-stretch lb-stretch-row',
  content: 'lb-stretch lb-stretch-content',
  contentNoSpace: 'lb-stretch'
}

const rowClass = (s: Record<string, unknown>) =>
  [
    'lb-row',
    STRETCH[str(s.stretch)],
    s.equalHeight && 'lb-equal',
    s.contentPosition && `lb-${s.contentPosition}`
  ]
    .filter(Boolean)
    .join(' ')

export const structureElements: ElementDef[] = [
  {
    type: 'section',
    name: 'Section',
    category: 'Layout',
    icon: 'PanelsTopLeft',
    description: 'Group rows with one background',
    accepts: ['row'],
    parents: ['root'],
    fields: withCommon({name: 'hide', type: 'toggle', label: 'Hide section'}),
    defaultChildren: () => [{id: newId(), type: 'row', settings: {}, children: [newColumn('1/1')]}],
    render: ({settings, children, editing, attrs}) =>
      settings.hide && !editing ? null : (
        <Box
          as="section"
          {...attrs}
          className={`${attrs.className} lb-section`}
          opacity={settings.hide ? 0.4 : undefined}
        >
          {children}
        </Box>
      )
  },
  {
    type: 'row',
    name: 'Row',
    category: 'Layout',
    icon: 'Rows3',
    description: 'Columns side by side',
    accepts: ['column'],
    parents: ['root', 'section'],
    fields: rowFields,
    defaultChildren: () => [newColumn('1/1')],
    render: ({settings, children, editing, attrs}) =>
      settings.hide && !editing ? null : (
        <Box
          {...attrs}
          className={`${attrs.className} ${rowClass(settings)}`}
          minH={str(settings.minHeight) || undefined}
          opacity={settings.hide ? 0.4 : undefined}
        >
          {children}
        </Box>
      )
  },
  {
    type: 'column',
    name: 'Column',
    category: 'Layout',
    icon: 'Columns2',
    accepts: 'content',
    parents: ['row'],
    hidden: true,
    fields: [...withCommon(), responsive],
    render: ({node, children, editing, attrs}) => (
      <div {...attrs} className={`${attrs.className} lb-col`}>
        {children}
        {editing && !node.children?.length && <EmptyColumn />}
      </div>
    )
  },
  {
    type: 'innerRow',
    name: 'Inner row',
    category: 'Layout',
    icon: 'Rows2',
    description: 'Columns inside a column',
    accepts: ['innerColumn'],
    parents: ['column'],
    fields: withCommon(
      {name: 'hide', type: 'toggle', label: 'Hide row', half: true},
      {name: 'equalHeight', type: 'toggle', label: 'Equal height', half: true},
      {name: 'gap', type: 'number', label: 'Column gap', units: ['px', 'rem'], default: '30px'},
      {name: 'contentPosition', type: 'buttons', label: 'Content position', options: VERTICAL}
    ),
    defaultChildren: () => [newColumn('1/2', 'innerColumn'), newColumn('1/2', 'innerColumn')],
    render: ({settings, children, editing, attrs}) =>
      settings.hide && !editing ? null : (
        <div {...attrs} className={`${attrs.className} lb-el ${rowClass(settings)}`}>
          {children}
        </div>
      )
  },
  {
    type: 'innerColumn',
    name: 'Inner column',
    category: 'Layout',
    icon: 'Columns2',
    accepts: 'content',
    parents: ['innerRow'],
    hidden: true,
    fields: [...withCommon(), responsive],
    render: ({node, children, editing, attrs}) => (
      <div {...attrs} className={`${attrs.className} lb-col`}>
        {children}
        {editing && !node.children?.length && <EmptyColumn />}
      </div>
    )
  }
]

/** Row layouts offered in the layout picker. */
export const ROW_LAYOUTS = [
  '1/1',
  '1/2 + 1/2',
  '2/3 + 1/3',
  '1/3 + 2/3',
  '1/3 + 1/3 + 1/3',
  '1/4 + 1/2 + 1/4',
  '1/4 + 1/4 + 1/4 + 1/4',
  '1/5 + 1/5 + 1/5 + 1/5 + 1/5',
  '1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6'
]

/** "1/2 + 1/4 + 1/4" to column widths; null when a part is not a fraction of 12ths or 5ths. */
export function parseLayout(text: string): string[] | null {
  const parts = text.split('+').map((p) => p.trim())
  const ok = parts.every((p) => {
    const m = /^(\d+)\/(\d+)$/.exec(p)
    if (!m) return false
    const [n, d] = [Number(m[1]), Number(m[2])]
    return n >= 1 && n <= d && (12 % d === 0 || d === 5)
  })
  return ok && parts.length ? parts : null
}
