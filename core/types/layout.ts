import type {CmsComponent} from '@platform/core/types/cms'
import type {ReactNode} from 'react'

/** One element on a page: its settings and, for containers, the elements inside it. */
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

/** Shows a field only while another field matches. */
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
  /** Tab in the edit panel; "General" when not set. */
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
  /** Repeater item fields, or the parts of an object field. */
  fields?: FieldDef[]
  /** Shown on the element in the outline and as its label. */
  summary?: boolean
}

export interface ElementRenderProps {
  node: LayoutNode
  settings: Record<string, unknown>
  children: ReactNode
  editing: boolean
  /** Put on the element's outer tag: its design options and extra class/id hang on these. */
  attrs: {className: string; id?: string; 'data-lb-id'?: string}
  /** Draws a website block (a CMS component type); each app brings its own renderer. */
  renderBlock?: (component: CmsComponent) => ReactNode
  /** Spread on the tag holding a text setting: in the editor it becomes typeable in place. */
  editable: EditableFn
  /** An image or file link as this app serves it. */
  url: (value: string) => string
  /** HTML from a setting, cleaned the way the CMS cleans it when saving. */
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

/** A link field's value. */
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
  /** Lucide icon name for the Add Element panel. */
  icon: string
  description?: string
  /** Element types it accepts inside; any content element when "content". */
  accepts?: string[] | 'content'
  /** Element types it may sit in; anywhere content may go when not set. */
  parents?: string[]
  /** Never offered in Add Element (columns, tab sections...). */
  hidden?: boolean
  /** Opens the edit panel right after it is added. */
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

/** Design options: the box model and background of one element. */
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

/** Per-device column width ("1/2", "5/12", "1/5"), offset and visibility. */
export type ResponsiveColumn = Partial<
  Record<Device, {width?: string; offset?: string; hide?: boolean}>
>

/** How an app draws a layout: the website and the CMS editor each fill these in. */
export interface LayoutContext {
  /** Editor canvas: hidden elements stay visible and every element carries its id for the editor's controls. */
  editing?: boolean
  renderBlock?: (component: CmsComponent) => ReactNode
  /** Websites serve uploaded media under their own addresses. */
  resolveUrl?: (value: string) => string | undefined
  /** The editor cleans HTML before showing it; websites get it already cleaned. */
  cleanHtml?: (html: string) => string
}

export interface LayoutViewProps extends LayoutContext {
  nodes: LayoutNode[]
}

export interface NodeViewProps {
  node: LayoutNode
  ctx: LayoutContext
}
