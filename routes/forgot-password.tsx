import {requireMembers} from '@platform/core/plugins'
import {ForgotPasswordForm} from '@platform/ui/forms/AccountTokenForms'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export const metadata: Metadata = {title: 'Reset your password', robots: {index: false}}

export default function ForgotPasswordPage() {
  requireMembers()
  return (
    <Shell py="16" maxW="xl">
      <ForgotPasswordForm />
    </Shell>
  )
}
