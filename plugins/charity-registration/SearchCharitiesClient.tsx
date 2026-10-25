'use client'

import {Box, Heading, Input, SimpleGrid, Text} from '@chakra-ui/react'
import type {CmsCharity} from '@platform/core/types/plugins/charity-registration'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {useMemo, useState} from 'react'

export function SearchCharitiesClient({
  initialCharities,
  hero
}: {
  initialCharities: CmsCharity[]
  hero?: {kicker?: string; title?: string; lede?: string} | null
}) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return initialCharities
    return initialCharities.filter((item) =>
      `${item.name} ${item.summary} ${item.location || ''} ${item.category}`
        .toLowerCase()
        .includes(needle)
    )
  }, [query, initialCharities])

  return (
    <>
      {hero ? <PageHero kicker={hero.kicker} title={hero.title} lede={hero.lede} /> : null}
      <Shell py="16">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search charities"
          bg="surface"
          borderColor="border"
          maxW="prose"
        />
        <SimpleGrid columns={{base: 1, md: 2}} gap="4" mt="8">
          {results.map((charity) => {
            const id = charity.charityId || charity.id
            return (
              <Box
                key={id}
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="xl"
                p="5"
              >
                <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium">
                  {charity.name}
                </Heading>
                <Text mt="2" color="fg.muted">
                  {charity.summary}
                </Text>
              </Box>
            )
          })}
        </SimpleGrid>
        <Text mt="8">
          Missing someone?{' '}
          <SiteLink href="/charities/nominate" color="brand.fg">
            Nominate a cause
          </SiteLink>
          .
        </Text>
      </Shell>
    </>
  )
}
