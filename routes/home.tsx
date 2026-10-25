import {getCmsPage} from '@platform/core/cms-client'
import {site} from '@platform/core/site-config'
import {CmsLayout} from '@platform/ui/cms/CmsPage'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export const metadata: Metadata = site.meta.home || {
  title: site.meta.name,
  description: site.meta.description
}

export default async function HomePage() {
  const page = await getCmsPage('/')
  if (!page) notFound()
  return <CmsLayout page={page} />
}
