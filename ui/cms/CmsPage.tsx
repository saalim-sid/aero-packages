import {LayoutView} from '@platform/builder/LayoutView'
import {getCmsTheme, resolveCmsImageUrl} from '@platform/core/cms-client'
import {site, siteBlocks} from '@platform/core/site-config'
import type {CmsComponent, CmsLayoutProps, CmsPageData} from '@platform/core/types/cms'
import {themeSection} from '@platform/themes'
import {ComponentView} from '@platform/ui/cms/ComponentView'
import {PageHero} from '@platform/ui/PageHero'

/** Order: the site's own block, then the theme's section, then the shared and plugin components. */
export function CmsComponentRenderer({
  component,
  theme
}: {
  component: CmsComponent
  theme?: string | null
}) {
  const Block =
    siteBlocks[component.componentType ?? ''] || themeSection(theme, component.componentType)
  return Block ? <Block component={component} /> : <ComponentView component={component} />
}

/** The page's content, as built in the page builder. */
export async function CmsLayout({page}: CmsLayoutProps) {
  if (!page?.layout?.length) return null
  const theme = (await getCmsTheme()) ?? site.theme
  return (
    <LayoutView
      nodes={page.layout}
      renderBlock={(c) => <CmsComponentRenderer component={c} theme={theme} />}
      resolveUrl={resolveCmsImageUrl}
    />
  )
}

/** Standard CMS page: its hero, then its content (e.g. /about, /mission). */
export function CmsPageView({page}: {page: CmsPageData}) {
  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
      />
      <CmsLayout page={page} />
    </>
  )
}
