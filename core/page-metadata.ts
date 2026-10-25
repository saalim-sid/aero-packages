import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {CmsPageData} from '@platform/core/types/cms'
import type {Metadata} from 'next'

export function cmsPageMetadata(page: CmsPageData, path: string): Metadata {
  const description = page.lede
  const image = resolveCmsImageUrl(page.imageUrl)
  const canonical = path.startsWith('/') ? path : `/${path}`
  return {
    title: page.title,
    description,
    alternates: {canonical},
    openGraph: {
      title: page.title,
      description,
      url: canonical,
      ...(image ? {images: [{url: String(image)}]} : {})
    }
  }
}
