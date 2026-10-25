import {getCmsPage} from '@platform/core/cms-client'
import {HallOfFameLeaderboard} from '@platform/plugins/points/HallOfFameLeaderboard'
import {CmsLayout} from '@platform/ui/cms/CmsPage'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/hall-of-fame')
  return {
    title: page?.title || 'Hall of Fame',
    description: page?.meta?.description
  }
}

export default async function HallOfFamePage() {
  const page = await getCmsPage('/hall-of-fame')

  return (
    <>
      <HallOfFameLeaderboard />
      <CmsLayout page={page} />
    </>
  )
}
