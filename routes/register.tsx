import {getCmsPage} from '@platform/core/cms-client'
import {requireMembers} from '@platform/core/plugins'
import {RegisterClient} from '@platform/ui/forms/RegisterClient'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/register')
  return {
    title: page?.title,
    description: page?.lede
  }
}

export default async function RegisterPage() {
  requireMembers()
  const page = await getCmsPage('/register')
  return <RegisterClient page={page} />
}
