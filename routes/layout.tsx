import {SESSION_COOKIE} from '@platform/core/cms-auth'
import {
  getCmsCookieConsent,
  getCmsFooter,
  getCmsGtmId,
  getCmsHeader,
  getCmsOrg,
  getCmsPromotionBanner,
  getCmsSearchCx,
  getCmsSocialLinks,
  getCmsTheme
} from '@platform/core/cms-client'
import {IS_PRODUCTION_SITE, SITE_URL} from '@platform/core/site'
import {sectionsFor, site} from '@platform/core/site-config'
import type {OrgConfig} from '@platform/core/types/cms'
import {CookieConsent} from '@platform/ui/CookieConsent'
import {PromotionBanner} from '@platform/ui/PromotionBanner'
import {SiteFooter} from '@platform/ui/layout/SiteFooter'
import {SiteHeader} from '@platform/ui/layout/SiteHeader'
import {Provider} from '@platform/ui/provider'
import type {Metadata, Viewport} from 'next'
import {cookies} from 'next/headers'
import {existsSync} from 'node:fs'
import path from 'node:path'
import type {ReactNode} from 'react'

const {meta} = site

// Only link the files this site has in public/, so a site without PWA icons gets no 404s.
const has = (file: string) => existsSync(path.join(process.cwd(), 'public', file))
const ICONS = [
  {url: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png'},
  {url: '/favicon.ico', sizes: '32x32'},
  {url: '/favicon.svg', type: 'image/svg+xml'}
].filter((i) => has(i.url))

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Dev/staging deployments are never indexed.
  robots: IS_PRODUCTION_SITE ? {index: true, follow: true} : {index: false, follow: false},
  openGraph: {
    type: 'website',
    siteName: meta.name,
    locale: meta.locale,
    ...(has('/og.jpg')
      ? {images: [{url: '/og.jpg', width: 1200, height: 630, alt: meta.name}]}
      : {})
  },
  ...(meta.twitter ? {twitter: {card: 'summary_large_image', site: meta.twitter}} : {}),
  title: {default: meta.name, template: `%s · ${meta.shortName}`},
  description: meta.description,
  icons: {icon: ICONS, ...(has('/pwa/icon-180.png') ? {apple: '/pwa/icon-180.png'} : {})},
  ...(has('/pwa/manifest.webmanifest') ? {manifest: '/pwa/manifest.webmanifest'} : {})
}

export const viewport: Viewport = meta.themeColor ? {themeColor: meta.themeColor} : {}

// schema.org organisation from the CMS organisation details; identifiers map organisation fields to register names.
function orgJsonLd(org: OrgConfig) {
  const ld = meta.jsonLd
  if (!ld) return null
  return {
    '@context': 'https://schema.org',
    '@type': ld.type,
    name: org.name,
    url: SITE_URL,
    logo: has('/pwa/icon-512.png') ? `${SITE_URL}/pwa/icon-512.png` : undefined,
    email: org.email || undefined,
    telephone: org.phone || undefined,
    address: org.address
      ? {'@type': 'PostalAddress', streetAddress: org.address, addressCountry: ld.country}
      : undefined,
    foundingDate: org.founded ? String(org.founded) : undefined,
    identifier: Object.entries(ld.identifiers || {}).flatMap(([field, propertyID]) => {
      const value = org[field as keyof OrgConfig]
      return value ? [{'@type': 'PropertyValue', propertyID, value: String(value)}] : []
    }),
    sameAs: meta.sameAs
  }
}

export async function PlatformLayout({
  fontClassName,
  children
}: {
  fontClassName?: string
  children: ReactNode
}) {
  const [
    headerData,
    footerData,
    promotionBanner,
    org,
    cookieCopy,
    gtmId,
    searchCx,
    socialLinks,
    logoSections,
    theme
  ] = await Promise.all([
    getCmsHeader(),
    getCmsFooter(),
    getCmsPromotionBanner(),
    getCmsOrg(),
    getCmsCookieConsent(),
    getCmsGtmId(),
    getCmsSearchCx(),
    getCmsSocialLinks(),
    sectionsFor('logo.after'),
    getCmsTheme()
  ])
  const logoAfter = logoSections.length
    ? logoSections.map((Section, i) => <Section key={i} />)
    : undefined
  const jsonLd = org ? orgJsonLd(org) : null
  const hasSession = (await cookies()).has(SESSION_COOKIE)
  const Header = site.components?.Header || SiteHeader
  const Footer = site.components?.Footer || SiteFooter

  return (
    <html lang="en" className={fontClassName} suppressHydrationWarning>
      <body>
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
          />
        ) : null}
        <Provider hasSession={hasSession} theme={theme}>
          <PromotionBanner banner={promotionBanner} />
          <Header
            cmsData={headerData}
            searchCx={searchCx}
            socialLinks={socialLinks}
            logoAfter={logoAfter}
          />
          {children}
          <Footer cmsData={footerData} logoAfter={logoAfter} />
          <CookieConsent copy={cookieCopy} gtmId={gtmId || undefined} />
        </Provider>
      </body>
    </html>
  )
}
