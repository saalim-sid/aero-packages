'use client'

import {EditableContext, useEditable} from '@platform/builder/editable-context'
import type {EditableFn} from '@platform/core/types/layout'
import type {ReactNode} from 'react'

/** Gives the sections inside a page-builder block their in-place editing. */
export function EditableScope({editable, children}: {editable: EditableFn; children: ReactNode}) {
  return <EditableContext.Provider value={editable}>{children}</EditableContext.Provider>
}

/** Text inside a button or link: editable in the builder, the bare text on the website. */
export function EditableText({
  field,
  kind = 'line',
  children
}: {
  field: string
  kind?: 'line' | 'text'
  children: ReactNode
}) {
  const attrs = useEditable()(field, kind)
  return Object.keys(attrs).length ? <span {...attrs}>{children}</span> : children
}
