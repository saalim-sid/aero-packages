import {getCmsPages, getEnabledPlugins} from '@platform/core/cms-client'
import {pluginOfPath} from '@platform/core/plugins'
import {IS_PRODUCTION_SITE, SITE_URL} from '@platform/core/site'
import {site} from '@platform/core/site-config'
import type {MetadataRoute} from 'next'

const CORE_ROUTES = [
  '/',
  '/contact',
  ...(site.meta.members === false ? [] : ['/register', '/login'])
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!IS_PRODUCTION_SITE) return []
  const [pages, plugins, pluginPaths] = await Promise.all([
    getCmsPages(),
    getEnabledPlugins(),
    Promise.all(site.plugins.map((p) => p.sitemap?.() ?? []))
  ])
  const paths = new Set<string>([...CORE_ROUTES, ...(site.sitemap || []), ...pluginPaths.flat()])
  for (const p of pages) {
    const slug = p.slug.startsWith('/') ? p.slug : `/${p.slug}`
    if (!['/404', '/not-found'].includes(slug)) paths.add(slug)
  }

  const live = [...paths].filter((path) => {
    const plugin = pluginOfPath(path)
    return !plugin || !plugins || plugins.has(plugin)
  })
  return live.map((path) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    changeFrequency: path === '/' || path.startsWith('/vote') ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.6 : 0.8
  }))
}
