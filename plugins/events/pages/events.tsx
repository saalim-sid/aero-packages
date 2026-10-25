import {Box, Heading, Image, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString, resolveCmsImageUrl} from '@platform/core/cms-client'
import {sectionsFor} from '@platform/core/site-config'
import {getCmsEvents} from '@platform/plugins/events/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/events')
  if (!page) return {title: 'Events'}
  return {title: page.title}
}

export default async function EventsPage() {
  const [page, events, after] = await Promise.all([
    getCmsPage('/events'),
    getCmsEvents(),
    sectionsFor('events.after')
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
        <SimpleGrid columns={{base: 1, md: 3}} gap="4">
          {events.map((event) => {
            const slug = getSlugString(event.slug)
            return (
              <SiteLink key={slug} href={`/events/${slug}`} _hover={{textDecoration: 'none'}}>
                <Box
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  overflow="hidden"
                  h="full"
                >
                  <Image
                    src={resolveCmsImageUrl(event.imageUrl)}
                    alt={event.imageAlt || event.title}
                    w="full"
                    h="40"
                    objectFit="cover"
                  />
                  <Box p="5">
                    <Text fontSize="sm" color="fg.subtle">
                      {event.date} · {event.place}
                    </Text>
                    <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="1">
                      {event.title}
                    </Heading>
                    <Text mt="2" color="fg.muted" fontSize="sm">
                      {event.lede}
                    </Text>
                  </Box>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
        {after.map((Section, i) => (
          <Section key={i} />
        ))}
      </Shell>
    </>
  )
}
