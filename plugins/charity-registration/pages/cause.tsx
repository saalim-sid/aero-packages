import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getSlugString} from '@platform/core/cms-client'
import {getCmsCauseCategory, getCmsCharities} from '@platform/plugins/charity-registration/data'
import {GhostButton} from '@platform/ui/Ctas'
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
  const category = await getCmsCauseCategory(slug)
  if (!category) return {title: 'Cause'}
  return {title: category.title}
}

export default async function CauseCategoryPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const [category, charities] = await Promise.all([getCmsCauseCategory(slug), getCmsCharities()])

  if (!category) notFound()
  const catSlug = getSlugString(category.slug)
  const listed = charities.filter((item) => item.category === catSlug)

  return (
    <>
      <PageHero
        kicker={category.title}
        title={category.title}
        lede={category.body || category.description}
      />
      <Shell py="16">
        {listed.length ? (
          <SimpleGrid columns={{base: 1, md: 2}} gap="4">
            {listed.map((charity) => {
              const id = charity.charityId || charity.id
              return (
                <Box
                  key={id}
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  p="6"
                >
                  <Text fontSize="sm" color="fg.subtle">
                    {charity.location}
                  </Text>
                  <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="1">
                    {charity.name}
                  </Heading>
                  <Text mt="2" color="fg.muted">
                    {charity.summary}
                  </Text>
                </Box>
              )
            })}
          </SimpleGrid>
        ) : (
          <Text color="fg.muted">No listings in this category yet.</Text>
        )}
        <Box mt="10">
          <GhostButton
            href="/charities/register"
            label={(category as {ctaLabel?: string}).ctaLabel || ''}
          />
        </Box>
      </Shell>
    </>
  )
}
