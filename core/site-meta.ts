import type {SiteMeta} from '@platform/core/types/platform'
import meta from '@site/site.meta'

export const siteMeta: SiteMeta = meta

export const SITE_LOCALE = siteMeta.locale?.replace('_', '-') || 'en'

const money = new Intl.NumberFormat(SITE_LOCALE, {
  style: 'currency',
  currency: siteMeta.currency || 'USD'
})

export const formatSiteMoney = (amount: number) => money.format(amount)
