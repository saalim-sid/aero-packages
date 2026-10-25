import {getCmsPage} from '@platform/core/cms-client'
import {getCmsCharities} from '@platform/plugins/charity-registration/data'
import {SearchCharitiesClient} from '@platform/plugins/charity-registration/SearchCharitiesClient'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/charities/search')
  return {title: page?.title, description: page?.lede}
}

export default async function SearchCharitiesPage() {
  const [charities, page] = await Promise.all([getCmsCharities(), getCmsPage('/charities/search')])
  return <SearchCharitiesClient initialCharities={charities} hero={page} />
}
