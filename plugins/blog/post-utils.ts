import {SITE_LOCALE} from '@platform/core/site-meta'
import type {BlogSummary} from '@platform/core/types/plugins/blog'

export const postDate = (p: Pick<BlogSummary, 'publishedAt' | 'date'>) =>
  p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString(SITE_LOCALE, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      })
    : p.date || ''

export const postHref = (p: Pick<BlogSummary, 'slug'>) => `/blog/${p.slug}`
