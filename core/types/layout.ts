import type {CmsComponent} from '@platform/core/types/cms'
import type {ReactNode} from 'react'

export interface LayoutNode {
  id: string
  type: string
  settings: Record<string, unknown>
  children?: LayoutNode[]
}

export type Device = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'code'
  | 'select'
  | 'toggle'
  | 'buttons'
  | 'number'
  | 'range'
  | 'color'
  | 'image'
  | 'images'
  | 'link'
  | 'icon'
  | 'repeater'
  | 'object'
  | 'design'
  | 'responsive'
  | 'animation'
  | 'typography'
  | 'lines'
  | 'hidden'

export interface FieldOption {
  value: string
  label: string
}

export type FieldChoices = Record<string, string[]>

export interface FieldCondition {
  field: string
  equals?: string | string[]
  notEquals?: string | string[]
  notEmpty?: boolean
  empty?: boolean
}

export interface FieldDef {
  name: string
  type: FieldType
  label: string
  group?: string
  default?: unknown
  options?: FieldOption[]
  units?: string[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
  help?: string
  half?: boolean
  showIf?: FieldCondition
  fields?: FieldDef[]
  summary?: boolean
}

export interface ElementRenderProps {
  node: LayoutNode
  settings: Record<string, unknown>
  children: ReactNode
  editing: boolean
  attrs: {className: string; id?: string; 'data-lb-id'?: string}
  renderBlock?: (component: CmsComponent) => ReactNode
  editable: EditableFn
  url: (value: string) => string
  html: (value: string) => string
}

/** `field` is a setting name, or a dotted path into it (items.0.title). */
export type EditableFn = (field: string, kind?: 'line' | 'text' | 'rich') => EditableAttrs

export interface EditableAttrs {
  contentEditable?: boolean
  suppressContentEditableWarning?: boolean
  'data-lb-field'?: string
  'data-lb-kind'?: string
}

export interface LinkValue {
  url?: string
  title?: string
  newTab?: boolean
  nofollow?: boolean
}

export interface ElementDef {
  type: string
  name: string
  category: string
  icon: string
  description?: string
  accepts?: string[] | 'content'
  parents?: string[]
  hidden?: boolean
  editOnAdd?: boolean
  fields: FieldDef[]
  defaultChildren?: () => LayoutNode[]
  render: (props: ElementRenderProps) => ReactNode
}

export interface BoxSides {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

export interface DesignOptions {
  margin?: BoxSides
  padding?: BoxSides
  border?: BoxSides
  radius?: {topLeft?: string; topRight?: string; bottomRight?: string; bottomLeft?: string}
  borderColor?: string
  borderStyle?: string
  background?: string
  backgroundImage?: string
  backgroundStyle?: 'cover' | 'contain' | 'no-repeat' | 'repeat'
}

export type ResponsiveColumn = Partial<
  Record<Device, {width?: string; offset?: string; hide?: boolean}>
>

export interface LayoutContext {
  editing?: boolean
  renderBlock?: (component: CmsComponent) => ReactNode
  resolveUrl?: (value: string) => string | undefined
  cleanHtml?: (html: string) => string
}

export interface LayoutViewProps extends LayoutContext {
  nodes: LayoutNode[]
}

export interface NodeViewProps {
  node: LayoutNode
  ctx: LayoutContext
}
