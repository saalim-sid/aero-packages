import {getCmsPage} from '@platform/core/cms-client'
import {requireMembers} from '@platform/core/plugins'
import {LoginClient} from '@platform/ui/forms/LoginClient'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/login')
  return {
    title: page?.title,
    description: page?.lede
  }
}

export default async function LoginPage() {
  requireMembers()
  const page = await getCmsPage('/login')
  return <LoginClient page={page} />
}
