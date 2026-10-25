import {IS_PRODUCTION_SITE, SITE_URL} from '@platform/core/site'
import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_SITE) return {rules: {userAgent: '*', disallow: '/'}}
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account',
        '/api/',
        '/go/',
        '/forgot-password',
        '/reset-password',
        '/verify-email'
      ]
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  }
}
