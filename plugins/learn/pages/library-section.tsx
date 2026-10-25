import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsLibrarySection} from '@platform/plugins/learn/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const section = await getCmsLibrarySection(slug)
  if (!section) return {title: 'Library'}
  return {title: section.title}
}

export default async function LibrarySectionPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const section = await getCmsLibrarySection(slug)
  if (!section) notFound()
  return (
    <>
      <PageHero
        kicker={section.kicker}
        title={section.title}
        lede={section.lede}
        imageUrl={section.imageUrl}
      />
      <Shell py="16">
        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
          {section.tips?.map((tip) => (
            <Box
              key={tip.title}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="6"
            >
              <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium">
                {tip.title}
              </Heading>
              <Text mt="3" color="fg.muted">
                {tip.body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Shell>
    </>
  )
}
