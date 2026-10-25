import {Box} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import {getCmsRetailers} from '@platform/plugins/shop/data'
import {RetailerDirectory} from '@platform/plugins/shop/RetailerDirectory'
import {CmsLayout} from '@platform/ui/cms/CmsPage'
import {JoinButton} from '@platform/ui/Ctas'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import {CardsGridSection} from '@platform/ui/Sections'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/shop')
  return {
    title: page?.title,
    description: page?.lede
  }
}

export default async function ShopPage() {
  const [page, retailers] = await Promise.all([getCmsPage('/shop'), getCmsRetailers()])

  return (
    <>
      <PageHero
        kicker={page?.kicker}
        title={page?.title}
        lede={page?.lede}
        imageUrl={page?.imageUrl}
        imageAlt={page?.imageAlt}
        actions={page?.ctaLabel ? <JoinButton label={page.ctaLabel} /> : null}
      />

      <Shell py="16">
        <CardsGridSection
          eyebrow={page?.aislesEyebrow}
          title={page?.aislesTitle}
          lede={page?.aislesLede}
          items={page?.aisles}
          columns={{base: 1, md: 2, lg: 3}}
        />

        <Box mt="12">
          <RetailerDirectory retailers={retailers} />
        </Box>

        {page?.layout?.length ? (
          <Box mt="12">
            <CmsLayout page={page} />
          </Box>
        ) : null}
      </Shell>
    </>
  )
}
