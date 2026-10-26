'use client'

import {EditableContext, useEditable} from '@platform/builder/editable-context'
import type {EditableFn} from '@platform/core/types/layout'
import type {ReactNode} from 'react'

export function EditableScope({editable, children}: {editable: EditableFn; children: ReactNode}) {
  return <EditableContext.Provider value={editable}>{children}</EditableContext.Provider>
}

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
