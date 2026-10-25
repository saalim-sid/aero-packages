import {getCmsPage} from '@platform/core/cms-client'
import {CauseForm} from '@platform/plugins/charity-registration/CauseForm'
import {getCmsCauseCategories} from '@platform/plugins/charity-registration/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/charities/register')
  return {title: page?.title, description: page?.lede}
}

export default async function RegisterCharityPage() {
  const [categories, page] = await Promise.all([
    getCmsCauseCategories(),
    getCmsPage('/charities/register')
  ])
  return (
    <>
      {page ? (
        <PageHero
          kicker={page.kicker}
          title={page.title}
          lede={page.lede}
          imageUrl={page.imageUrl}
          imageAlt={page.imageAlt}
        />
      ) : null}
      <Shell py="16">
        <CauseForm categories={categories} />
      </Shell>
    </>
  )
}
