import {getCmsPage, getEnabledPlugins} from '@platform/core/cms-client'
import {requireMembers} from '@platform/core/plugins'
import {AccountClient} from '@platform/ui/account/AccountClient'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/account')
  return {
    title: page?.title,
    description: page?.lede
  }
}

export default async function AccountPage() {
  requireMembers()
  const [page, plugins] = await Promise.all([getCmsPage('/account'), getEnabledPlugins()])
  return <AccountClient page={page} plugins={plugins ? [...plugins] : null} />
}
