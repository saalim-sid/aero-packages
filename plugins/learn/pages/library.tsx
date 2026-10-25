import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsLibrary} from '@platform/plugins/learn/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/learn/library')
  if (!page) return {title: 'Library'}
  return {title: page.title}
}

export default async function LibraryPage() {
  const [page, library] = await Promise.all([getCmsPage('/learn/library'), getCmsLibrary()])

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
          {library.map((section) => {
            const slug = getSlugString(section.slug)
            return (
              <SiteLink
                key={slug}
                href={`/learn/library/${slug}`}
                _hover={{textDecoration: 'none'}}
              >
                <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="xl" p="6">
                  <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium">
                    {section.title}
                  </Heading>
                  <Text mt="2" color="fg.muted">
                    {section.lede}
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
