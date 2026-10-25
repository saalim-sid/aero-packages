import {blockElement, componentElement} from '@platform/builder/elements/block'
import {contentElements} from '@platform/builder/elements/content'
import {structureElements} from '@platform/builder/elements/structure'
import type {ElementDef, LayoutNode} from '@platform/core/types/layout'

export const elements: Record<string, ElementDef> = Object.fromEntries(
  [...structureElements, ...contentElements, blockElement, componentElement].map((e) => [e.type, e])
)

export const ROOT = 'root'

/** Whether `child` may sit directly inside `parent` ("root" for the page itself). */
export function canContain(parent: string, child: string): boolean {
  const c = elements[child]
  if (!c) return false
  if (c.parents) return c.parents.includes(parent)
  if (parent === ROOT) return false
  const p = elements[parent]
  return p?.accepts === 'content'
}

/** Each field's default, for a new element. */
export const defaults = (type: string): Record<string, unknown> =>
  Object.fromEntries(
    (elements[type]?.fields || []).flatMap((f) =>
      f.default === undefined ? [] : [[f.name, f.default]]
    )
  )

/** Every element in a layout, depth first. */
export function* walk(nodes: LayoutNode[]): Generator<LayoutNode> {
  for (const n of nodes) {
    yield n
    if (n.children) yield* walk(n.children)
  }
}
