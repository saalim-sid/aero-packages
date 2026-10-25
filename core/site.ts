import {CMS_ENVIRONMENT} from '@platform/core/cms-auth'
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080').replace(
  /\/$/,
  ''
)

export const IS_PRODUCTION_SITE =
  (CMS_ENVIRONMENT || 'production') === 'production' && Boolean(process.env.NEXT_PUBLIC_SITE_URL)
