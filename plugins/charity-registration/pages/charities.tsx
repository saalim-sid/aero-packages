import {Box, Heading, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsCauseCategories} from '@platform/plugins/charity-registration/data'
import {CtaBand, GhostButton, JoinButton} from '@platform/ui/Ctas'
import {PageHero} from '@platform/ui/PageHero'
import {Eyebrow, Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/charities')
  if (!page) return {title: 'Charities'}
  return {title: page.title}
}

export default async function CharitiesPage() {
  const [page, causeCategories] = await Promise.all([
    getCmsPage('/charities'),
    getCmsCauseCategories()
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
        actions={
          <Stack direction={{base: 'column', sm: 'row'}} gap="3">
            <JoinButton label={page.joinLabel} href={page.joinHref || '/charities/register'} />
            <GhostButton href={page.secondaryHref || '/vote'} label={page.secondaryLabel || ''} />
          </Stack>
        }
      />
      <Shell py="16">
        <Eyebrow>{page.title}</Eyebrow>
        <SimpleGrid columns={{base: 1, md: 2}} gap="4" mt="6">
          {causeCategories.map((category, index) => {
            const catSlug = getSlugString(category.slug)
            return (
              <SiteLink key={catSlug} href={`/causes/${catSlug}`} _hover={{textDecoration: 'none'}}>
                <Box
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  p="5"
                  h="full"
                >
                  <Text color="brand.fg" fontFamily="heading">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Heading as="h3" fontSize="lg" fontFamily="heading" fontWeight="medium" mt="1">
                    {category.title}
                  </Heading>
                  <Text mt="2" color="fg.muted" fontSize="sm">
                    {category.body || category.description}
                  </Text>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
      </Shell>
      <Shell py="16">
        <CtaBand />
      </Shell>
    </>
  )
}
