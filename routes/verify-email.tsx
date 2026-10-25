import {requireMembers} from '@platform/core/plugins'
import {VerifyEmailPanel} from '@platform/ui/forms/AccountTokenForms'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {Suspense} from 'react'

export const metadata: Metadata = {title: 'Confirm your email', robots: {index: false}}

export default function VerifyEmailPage() {
  requireMembers()
  return (
    <Shell py="16" maxW="xl">
      <Suspense>
        <VerifyEmailPanel />
      </Suspense>
    </Shell>
  )
}
