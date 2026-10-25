import type {BlockComponent, SiteConfig} from '@platform/core/types/platform'
import config from '@site/platform.config'

export const site: SiteConfig = config

export const siteBlocks: Record<string, BlockComponent> = Object.assign(
  {},
  ...site.plugins.map((p) => p.blocks),
  site.blocks
)

export const pluginRoutes: Record<string, string> = Object.fromEntries(
  site.plugins.flatMap((p) => (p.routes || []).map((r) => [r, p.id]))
)

export const sectionsFor = (name: string) =>
  Promise.all(site.plugins.flatMap((p) => (p.sections?.[name] ? [p.sections[name]()] : [])))
