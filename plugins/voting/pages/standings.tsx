import {getCmsPage} from '@platform/core/cms-client'
import {getVoteCharities} from '@platform/plugins/voting/api'
import {getCmsCauseCategories} from '@platform/plugins/voting/data'
import {VoteBoard} from '@platform/plugins/voting/VoteBoard'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/vote/standings')
  if (!page) return {title: 'Standings'}
  return {title: page.title}
}

export default async function StandingsPage() {
  const [page, voting, categories] = await Promise.all([
    getCmsPage('/vote/standings'),
    getVoteCharities(),
    getCmsCauseCategories()
  ])

  if (!page || voting.off) notFound()

  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
      />
      <Shell py="16">
        <VoteBoard standingsOnly initialPage={voting.page} categories={categories} />
      </Shell>
    </>
  )
}
