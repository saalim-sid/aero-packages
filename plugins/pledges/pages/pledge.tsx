import {Box, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import {PledgeForm} from '@platform/plugins/pledges/PledgeForm'
import {CmsLayout} from '@platform/ui/cms/CmsPage'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/pledge')
  return {
    title: page?.title,
    description: page?.lede
  }
}

export default async function PledgePage() {
  const page = await getCmsPage('/pledge')
  const hasIntro = Boolean(page?.introText || page?.body || page?.secondaryText)

  return (
    <>
      <PageHero
        kicker={page?.kicker}
        title={page?.title}
        lede={page?.lede}
        imageUrl={page?.imageUrl}
        imageAlt={page?.imageAlt}
      />
      <Shell py="16">
        <SimpleGrid
          columns={hasIntro ? {base: 1, md: 2} : {base: 1}}
          gap="12"
          alignItems="start"
          maxW={hasIntro ? undefined : 'lg'}
          mx={hasIntro ? undefined : 'auto'}
        >
          {hasIntro ? (
            <Box>
              {page?.introText || page?.body ? (
                <Text color="fg.muted" fontSize="lg" lineHeight="relaxed">
                  {page.introText || page.body}
                </Text>
              ) : null}

              {page?.secondaryText ? (
                <Text mt="4" color="fg.subtle" fontSize="sm">
                  {page.secondaryText}
                </Text>
              ) : null}
            </Box>
          ) : null}
          <PledgeForm />
        </SimpleGrid>

        {page?.layout?.length ? (
          <Box mt="12">
            <CmsLayout page={page} />
          </Box>
        ) : null}
      </Shell>
    </>
  )
}
