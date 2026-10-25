import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsCauseCategories, getCmsCharities} from '@platform/plugins/charity-registration/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/causes')
  if (!page) return {title: 'Causes'}
  return {title: page.title}
}

export default async function CausesPage() {
  const [page, causeCategories, charities] = await Promise.all([
    getCmsPage('/causes'),
    getCmsCauseCategories(),
    getCmsCharities()
  ])

  if (!page) notFound()

  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
      />
      <Shell py="16">
        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
          {causeCategories.map((category) => {
            const catSlug = getSlugString(category.slug)
            const count = charities.filter((item) => item.category === catSlug).length
            return (
              <SiteLink key={catSlug} href={`/causes/${catSlug}`} _hover={{textDecoration: 'none'}}>
                <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="6">
                  <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium">
                    {category.title}
                  </Heading>
                  <Text mt="2" color="fg.muted">
                    {category.body || category.description}
                  </Text>
                  <Text mt="3" fontSize="sm" color="fg.subtle">
                    {count} listed
                  </Text>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
      </Shell>
    </>
  )
}
