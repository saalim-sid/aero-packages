import {BASE_CSS, layoutCss} from '@platform/builder/css'
import {elements} from '@platform/builder/registry'
import type {LayoutViewProps, NodeViewProps} from '@platform/core/types/layout'
import type {ReactNode} from 'react'

function NodeView({node, ctx}: NodeViewProps): ReactNode {
  const element = elements[node.type]
  if (!element) return null
  const s = node.settings
  const editing = Boolean(ctx.editing)
  return element.render({
    node,
    settings: s,
    children: node.children?.map((c) => <NodeView key={c.id} node={c} ctx={ctx} />),
    renderBlock: ctx.renderBlock,
    editing,
    attrs: {
      className: [`b-${node.id}`, typeof s.className === 'string' && s.className]
        .filter(Boolean)
        .join(' '),
      id: typeof s.elementId === 'string' && s.elementId ? s.elementId : undefined,
      ...(editing ? {'data-lb-id': node.id} : {})
    },
    editable: (field, kind = 'text') =>
      editing
        ? {
            contentEditable: true,
            suppressContentEditableWarning: true,
            'data-lb-field': field,
            'data-lb-kind': kind
          }
        : {},
    url: (value) => (value && ctx.resolveUrl?.(value)) || value,
    html: (value) => (ctx.cleanHtml ? ctx.cleanHtml(value) : value)
  })
}

/** A page built in the page builder: its elements and the CSS their settings produce. */
export function LayoutView({nodes, ...ctx}: LayoutViewProps) {
  return (
    <div className="lb-page">
      <div className={ctx.editing ? 'lb-body lb-editing' : 'lb-body'}>
        <style>{BASE_CSS + layoutCss(nodes, ctx.resolveUrl)}</style>
        {nodes.map((n) => (
          <NodeView key={n.id} node={n} ctx={ctx} />
        ))}
      </div>
    </div>
  )
}
