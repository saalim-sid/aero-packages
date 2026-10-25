import {getCmsSearchCx} from '@platform/core/cms-client'
import {GoogleSearchResults} from '@platform/ui/GoogleSearchResults'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export const metadata: Metadata = {title: 'Search', robots: {index: false, follow: true}}

export default async function SearchPage() {
  const cx = await getCmsSearchCx()
  if (!cx) notFound()

  return (
    <>
      <PageHero kicker="Search" title="Search the site" />
      <Shell py="12">
        <GoogleSearchResults cx={cx} />
      </Shell>
    </>
  )
}
