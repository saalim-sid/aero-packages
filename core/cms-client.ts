import {CMS_ENVIRONMENT} from '@platform/core/cms-auth'
import {themes} from '@platform/themes'
import type {
  CmsCollectionPage,
  CmsComponent,
  CmsCookieConsent,
  CmsNavigationData,
  CmsPageData,
  CmsPromotionBanner,
  OrgConfig,
  SocialLink
} from '@platform/core/types/cms'

export function resolveCmsImageUrl(image?: any, fallback?: string): string | undefined {
  let candidate: string | undefined = undefined

  if (typeof image === 'string' && image.trim()) {
    candidate = image.trim()
  } else if (image && typeof image === 'object') {
    if (typeof image.url === 'string' && image.url.trim()) {
      candidate = image.url.trim()
    } else if (typeof image.src === 'string' && image.src.trim()) {
      candidate = image.src.trim()
    } else if (image.asset) {
      if (typeof image.asset.url === 'string' && image.asset.url.trim()) {
        candidate = image.asset.url.trim()
      } else if (typeof image.asset._ref === 'string') {
        const match = image.asset._ref.match(/^image-([a-f0-9]+)-([0-9x]+)-([a-z]+)$/)
        if (match) {
          candidate = `/media/images/${match[1]}-${match[2]}.${match[3]}`
        }
      }
    }
  }

  if (candidate) {
    if (candidate.startsWith('image-')) {
      const match = candidate.match(/^image-([a-f0-9]+)-([0-9x]+)-([a-z]+)$/)
      if (match) {
        candidate = `/media/images/${match[1]}-${match[2]}.${match[3]}`
      }
    }

    candidate = candidate.replace(
      /^https?:\/\/cdn\.sanity\.io\/(images|files)\/[^/]+\/[^/]+\//,
      '/media/$1/'
    )

    candidate = candidate.replace(/^\/media\/(images|files)\/[^/]+\/[^/]+\//, '/media/$1/')

    candidate = candidate.replace(
      /^\/api\/v1\/content\/media\/(images|files)\/[^/]+\/[^/]+\//,
      '/media/$1/'
    )

    candidate = candidate.replace(/^\/api\/v1\/content\/media\//, '/media/')

    candidate = candidate.replace(/^https?:\/\/cdn\.sanity\.io\//, '/media/')

    if (!/^(https?:\/\/|\/|blob:|data:)/.test(candidate)) {
      candidate = `/images/${candidate}`
    }
  }

  return candidate || fallback
}

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || ''
const CMS_API_KEY = process.env.CMS_API_KEY || ''

if (typeof window === 'undefined' && (!CMS_API_URL || !CMS_API_KEY)) {
  console.error(
    '[CMS Client] NEXT_PUBLIC_CMS_API_URL or CMS_API_KEY is not set: every page will be empty (404).'
  )
}

export async function cmsGet(url: string, init: RequestInit, attempt = 1): Promise<Response> {
  try {
    const res = await fetch(url, {...init, signal: init.signal ?? AbortSignal.timeout(10_000)})
    if (!res.ok && res.status !== 404) {
      const reason = await res
        .clone()
        .json()
        .then((d: {error?: string}) => d.error)
        .catch(() => '')
      console.error(
        `[CMS Client] ${new URL(url).pathname} → HTTP ${res.status}${reason ? `: ${reason}` : ''}`
      )
    }
    return res
  } catch (err) {
    if (attempt >= 3) throw err
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    return cmsGet(url, init, attempt + 1)
  }
}

const shared = new Map<string, {at: number; promise: Promise<unknown>}>()
function sharedFor<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const hit = shared.get(key)
  if (hit && Date.now() - hit.at < ttlMs) return hit.promise as Promise<T>
  const promise = load().then((value) => {
    if (value === null || (Array.isArray(value) && !value.length)) shared.delete(key)
    return value
  })
  shared.set(key, {at: Date.now(), promise})
  return promise
}

function getHeaders(): HeadersInit {
  return {
    'X-Website-Key': CMS_API_KEY,
    Accept: 'application/json',
    ...(CMS_ENVIRONMENT ? {'X-CMS-Environment': CMS_ENVIRONMENT} : {})
  }
}

export async function cmsGetJson<T>(
  path: string,
  next: {revalidate: number; tags: string[]}
): Promise<{status: number; data: T | null}> {
  try {
    const res = await cmsGet(`${CMS_API_URL}${path}`, {headers: getHeaders(), next})
    const data = await res.json().catch(() => null)
    return {status: res.status, data: res.ok && data?.success ? (data as T) : null}
  } catch {
    return {status: 0, data: null}
  }
}

export function clearCmsShared(): void {
  shared.clear()
}

export function cached(...tags: string[]): RequestInit {
  return {headers: getHeaders(), next: {revalidate: 3600, tags: ['cms', ...tags]}}
}

export function getSlugString(slug: string | {current: string} | undefined): string {
  if (!slug) return ''
  if (typeof slug === 'string') return slug.replace(/^\//, '')
  return slug.current ? slug.current.replace(/^\//, '') : ''
}

export async function getCmsPage(slug: string): Promise<CmsPageData | null> {
  try {
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`
    const url = `${CMS_API_URL}/page?slug=${encodeURIComponent(cleanSlug)}`

    const res = await cmsGet(url, cached(`cms:page:${cleanSlug}`))

    if (!res.ok) {
      if (res.status === 404) return null
      console.error(`[CMS Client] Failed to fetch page '${slug}': HTTP ${res.status}`)
      return null
    }

    const data = await res.json()
    if (!data.success || !data.page) {
      return null
    }

    return data.page as CmsPageData
  } catch (err) {
    console.error(`[CMS Client] Network error fetching page '${slug}':`, err)
    return null
  }
}

export function getCmsPages(): Promise<Array<{id: string; title: string; slug: string}>> {
  return sharedFor('pages', 60_000, loadPages)
}

async function loadPages(): Promise<Array<{id: string; title: string; slug: string}>> {
  try {
    const url = `${CMS_API_URL}/pages`
    const res = await cmsGet(url, cached('cms:pages'))

    if (!res.ok) return []
    const data = await res.json()
    return data.pages || []
  } catch (err) {
    console.error('[CMS Client] Network error fetching pages list:', err)
    return []
  }
}

export function getCmsNavigation(): Promise<CmsNavigationData | null> {
  return sharedFor('navigation', 60_000, loadNavigation)
}

async function loadNavigation(): Promise<CmsNavigationData | null> {
  try {
    const url = `${CMS_API_URL}/navigation`
    const res = await cmsGet(url, cached('cms:navigation'))

    if (!res.ok) return null
    const data = await res.json()
    return (data.navigation as CmsNavigationData) || null
  } catch (err) {
    console.error('[CMS Client] Network error fetching navigation:', err)
    return null
  }
}

export async function getCmsHeader(): Promise<CmsComponent | null> {
  const nav = await getCmsNavigation()
  if (!nav?.globalComponents) return null
  return nav.globalComponents.find((c) => c.name === 'global-header') || null
}

export async function getCmsPromotionBanner(): Promise<CmsPromotionBanner | null> {
  const nav = await getCmsNavigation()
  const promoComp = nav?.globalComponents?.find((c) => c.componentType === 'promotion-banner')

  if (!promoComp || promoComp.enabled === false) {
    return null
  }

  const text = promoComp.text
  if (!text) {
    return null
  }

  return {
    enabled: true,
    badge: promoComp.badge,
    text,
    linkText: promoComp.linkText,
    linkHref: promoComp.linkHref,
    dismissible: promoComp.dismissible ?? true
  }
}

export async function getCmsCookieConsent(): Promise<CmsCookieConsent | null> {
  const nav = await getCmsNavigation()
  const c = nav?.globalComponents?.find((g) => g.componentType === 'cookie-consent')
  if (!c || c.enabled === false || !c.text || !c.acceptLabel || !c.rejectLabel) return null
  return {
    text: c.text,
    acceptLabel: c.acceptLabel,
    rejectLabel: c.rejectLabel,
    policyLabel: c.linkText,
    policyHref: c.linkHref
  }
}

export async function getCmsGtmId(): Promise<string | null> {
  const id = (await getCmsNavigation())?.gtmId
  return typeof id === 'string' && /^GTM-[A-Z0-9]+$/.test(id) ? id : null
}

export async function getCmsSearchCx(): Promise<string | null> {
  const cx = (await getCmsNavigation())?.searchCx
  return typeof cx === 'string' && /^[A-Za-z0-9:_-]{5,80}$/.test(cx) ? cx : null
}

export async function getCmsTheme(): Promise<string | null> {
  const key = (await getCmsNavigation())?.theme
  return typeof key === 'string' && Object.hasOwn(themes, key) ? key : null
}

export async function getCmsSocialLinks(): Promise<SocialLink[]> {
  const links = (await getCmsNavigation())?.socialLinks
  return Array.isArray(links)
    ? links.filter((l) => typeof l?.url === 'string' && l.url.startsWith('https://'))
    : []
}

export async function getCmsFooter(): Promise<CmsComponent | null> {
  const nav = await getCmsNavigation()
  if (!nav?.globalComponents) return null
  return nav.globalComponents.find((c) => c.name === 'global-footer') || null
}

export async function getCmsOrg(): Promise<OrgConfig | null> {
  const header = await getCmsHeader()
  return (header?.org as OrgConfig) || null
}

export async function getCmsCollectionPage<T>(
  type: string,
  opts: {omit?: string[]; limit?: number; cursor?: string} = {}
): Promise<CmsCollectionPage<T>> {
  try {
    const qs = new URLSearchParams({type})
    if (opts.omit?.length) qs.set('omit', opts.omit.join(','))
    if (opts.limit) qs.set('limit', String(Math.min(100, opts.limit)))
    if (opts.cursor) qs.set('cursor', opts.cursor)
    const url = `${CMS_API_URL}/collection?${qs.toString()}`
    const res = await cmsGet(url, cached(`cms:collection:${type}`))

    if (!res.ok) return {items: [], nextCursor: null}
    const data = await res.json()
    return {
      items: (data.items as T[]) || [],
      nextCursor: typeof data.nextCursor === 'string' && data.nextCursor ? data.nextCursor : null
    }
  } catch (err) {
    console.error(`[CMS Client] Error fetching collection '${type}':`, err)
    return {items: [], nextCursor: null}
  }
}

export async function getCmsCollection<T>(
  type: string,
  opts: {omit?: string[]} = {}
): Promise<T[]> {
  const items: T[] = []
  let cursor: string | undefined
  for (let n = 0; n < 100; n++) {
    const page = await getCmsCollectionPage<T>(type, {
      ...opts,
      ...(cursor ? {limit: 100, cursor} : {})
    })
    items.push(...page.items)
    if (!page.nextCursor) break
    cursor = page.nextCursor
  }
  return items
}

export async function getCmsCollectionById<T>(type: string, id: string): Promise<T | null> {
  try {
    const url = `${CMS_API_URL}/collection?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`
    const res = await cmsGet(url, cached(`cms:collection:${type}`))
    if (!res.ok) return null
    const data = await res.json()
    return (data.item as T) || null
  } catch (err) {
    console.error(`[CMS Client] Error fetching '${type}' id '${id}':`, err)
    return null
  }
}

export async function getCmsCollectionItem<T>(type: string, slugOrId: string): Promise<T | null> {
  try {
    const url = `${CMS_API_URL}/collection?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slugOrId)}`
    const res = await cmsGet(url, cached(`cms:collection:${type}`))

    if (!res.ok) return null
    const data = await res.json()
    return (data.item as T) || null
  } catch (err) {
    console.error(`[CMS Client] Error fetching '${type}' item '${slugOrId}':`, err)
    return null
  }
}

export async function getEnabledPlugins(): Promise<Set<string> | null> {
  try {
    const res = await cmsGet(`${CMS_API_URL}/plugins`, cached('cms:plugins'))
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data.plugins) ? new Set<string>(data.plugins) : null
  } catch {
    return null
  }
}
