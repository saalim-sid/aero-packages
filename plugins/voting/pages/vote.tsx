import {Stack} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import {getVoteCharities} from '@platform/plugins/voting/api'
import {getCmsCauseCategories} from '@platform/plugins/voting/data'
import {VoteBoard} from '@platform/plugins/voting/VoteBoard'
import {GhostButton, JoinButton} from '@platform/ui/Ctas'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/vote')
  if (!page) return {title: 'Vote'}
  return {title: page.title}
}

export default async function VotePage() {
  const [page, voting, categories] = await Promise.all([
    getCmsPage('/vote'),
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
        actions={
          <Stack direction={{base: 'column', sm: 'row'}} gap="3">
            <JoinButton />
            <GhostButton
              href={page.secondaryHref || '/vote/standings'}
              label={page.secondaryLabel || ''}
            />
          </Stack>
        }
      />
      <Shell py="16">
        <VoteBoard initialPage={voting.page} categories={categories} />
      </Shell>
    </>
  )
}
