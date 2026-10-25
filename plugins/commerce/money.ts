import {SITE_LOCALE} from '@platform/core/site-meta'

const decimals = (code: string) =>
  new Intl.NumberFormat(SITE_LOCALE, {style: 'currency', currency: code}).resolvedOptions()
    .maximumFractionDigits ?? 2

export const money = (minor: number, code: string) =>
  new Intl.NumberFormat(SITE_LOCALE, {style: 'currency', currency: code}).format(
    minor / 10 ** decimals(code)
  )

export const toMinor = (major: number, code: string) => Math.round(major * 10 ** decimals(code))
