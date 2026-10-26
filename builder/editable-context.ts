'use client'

import type {EditableFn} from '@platform/core/types/layout'
import {createContext, useContext} from 'react'

export const EditableContext = createContext<EditableFn>(() => ({}))

export const useEditable = () => useContext(EditableContext)
