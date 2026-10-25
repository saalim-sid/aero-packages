'use client'

import {Text} from '@chakra-ui/react'
import type {FormValidation} from '@platform/core/types/forms'

export function FieldError({v, name}: {v: FormValidation; name: string}) {
  const msg = v.errors[name]
  if (!msg) return null
  return (
    <Text id={v.errorId(name)} color="danger" fontSize="sm" mt="1.5" role="alert">
      {msg}
    </Text>
  )
}
