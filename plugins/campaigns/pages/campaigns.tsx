import {Box, Heading, Image, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString, resolveCmsImageUrl} from '@platform/core/cms-client'
import {getCmsCampaigns} from '@platform/plugins/campaigns/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/campaigns')
  if (!page) return {title: 'Campaigns'}
  return {title: page.title}
}

export default async function CampaignsPage() {
  const [page, campaigns] = await Promise.all([getCmsPage('/campaigns'), getCmsCampaigns()])

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
        <SimpleGrid columns={{base: 1, md: 2}} gap="6">
          {campaigns.map((campaign) => {
            const slug = getSlugString(campaign.slug)
            return (
              <SiteLink key={slug} href={`/campaigns/${slug}`} _hover={{textDecoration: 'none'}}>
                <Box
                  overflow="hidden"
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="2xl"
                  h="full"
                >
                  <Image
                    src={resolveCmsImageUrl(campaign.imageUrl)}
                    alt={campaign.imageAlt || campaign.title}
                    w="full"
                    h="48"
                    objectFit="cover"
                  />
                  <Box p="6">
                    <Text fontSize="sm" color="fg.subtle">
                      {campaign.kicker}
                    </Text>
                    <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium" mt="1">
                      {campaign.title}
                    </Heading>
                    <Text mt="3" color="fg.muted">
                      {campaign.lede}
                    </Text>
                  </Box>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
      </Shell>
    </>
  )
}
