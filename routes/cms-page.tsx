import {getCmsPage} from '@platform/core/cms-client'
import {cmsPageMetadata} from '@platform/core/page-metadata'
import {CmsPageView} from '@platform/ui/cms/CmsPage'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const page = await getCmsPage(slug)
  if (!page) {
    return {title: 'Page Not Found'}
  }
  return cmsPageMetadata(page, slug)
}

export default async function GenericPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const page = await getCmsPage(slug)

  if (!page) {
    notFound()
  }

  return <CmsPageView page={page} />
}
