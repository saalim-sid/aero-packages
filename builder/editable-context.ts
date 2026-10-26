'use client'

import type {EditableFn} from '@platform/core/types/layout'
import {createContext, useContext} from 'react'

export const EditableContext = createContext<EditableFn>(() => ({}))

/** In the page builder: attributes that make a section's text typeable in place. On the website: nothing. */
export const useEditable = () => useContext(EditableContext)
