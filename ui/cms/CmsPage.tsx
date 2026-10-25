import {LayoutView} from '@platform/builder/LayoutView'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import {siteBlocks} from '@platform/core/site-config'
import type {CmsComponent, CmsLayoutProps, CmsPageData} from '@platform/core/types/cms'
import {ComponentView} from '@platform/ui/cms/ComponentView'
import {PageHero} from '@platform/ui/PageHero'

export function CmsComponentRenderer({component}: {component: CmsComponent}) {
  const Block = siteBlocks[component.componentType ?? '']
  return Block ? <Block component={component} /> : <ComponentView component={component} />
}

/** The page's content, as built in the page builder. */
export function CmsLayout({page}: CmsLayoutProps) {
  return page?.layout?.length ? (
    <LayoutView
      nodes={page.layout}
      renderBlock={(c) => <CmsComponentRenderer component={c} />}
      resolveUrl={resolveCmsImageUrl}
    />
  ) : null
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
