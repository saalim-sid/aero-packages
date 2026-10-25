'use client'

import {useMemberStore} from '@platform/core/member-store'
import type {EmailCodeFormProps} from '@platform/core/types/auth'
import {CodeEntry} from '@platform/ui/forms/CodeEntry'
import {useRouter} from 'next/navigation'

export function EmailCodeForm({email}: EmailCodeFormProps) {
  const {api} = useMemberStore()
  const router = useRouter()
  return (
    <CodeEntry
      title="Verify your email"
      email={email}
      submitLabel="Verify and continue"
      onSubmit={async (code) => {
        const res = await api.verifyEmail(email, code)
        if (!res.success) return res.error || 'That code is not right.'
        router.push('/account')
        return null
      }}
      onResend={async () => {
        const res = await api.resendEmailCode(email)
        return res.success ? null : res.error || 'A new code could not be sent.'
      }}
    />
  )
}
