'use client'

import {useMemberStore} from '@platform/core/member-store'
import type {CmsPageData} from '@platform/core/types/cms'
import {RegisterForm} from '@platform/ui/forms/AuthForms'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export function RegisterClient({page}: {page?: CmsPageData | null}) {
  const {member} = useMemberStore()
  const router = useRouter()

  useEffect(() => {
    if (member) {
      router.push('/account')
    }
  }, [member, router])

  return (
    <>
      <PageHero
        kicker={page?.kicker}
        title={page?.title}
        lede={page?.lede}
        imageUrl={page?.imageUrl}
        imageAlt={page?.imageAlt}
      />
      <Shell py={{base: '10', md: '16'}} maxW="xl">
        <RegisterForm />
      </Shell>
    </>
  )
}
