'use client'

import {Badge, Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {useMemberProfile} from '@platform/core/member-store'
import type {CmsComponent} from '@platform/core/types/cms'
import type {PointsUser, RankTierItem} from '@platform/core/types/plugins/points'
import {Shell} from '@platform/ui/primitives'

export function RankTiersGrid({component}: {component: CmsComponent}) {
  const currentPoints = useMemberProfile<PointsUser>()?.points
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const items: RankTierItem[] = Array.isArray(component.items) ? component.items : []
  if (items.length === 0) return null

  const currentIndex =
    typeof currentPoints === 'number'
      ? items.reduce((idx, tier, i) => (currentPoints >= tier.minPoints ? i : idx), -1)
      : -1

  return (
    <Shell py="16">
      {def?.heading ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '4xl'}}
        >
          {def.heading}
        </Heading>
      ) : null}
      {def?.subheading ? (
        <Text color="fg.muted" maxW="prose" mt="3" mb="8">
          {def.subheading}
        </Text>
      ) : null}

      <SimpleGrid columns={{base: 2, sm: 3, md: 4, lg: 6}} gap="4" mt={def ? undefined : '0'}>
        {items.map((tier, i) => {
          const isCurrent = i === currentIndex
          return (
            <Box
              key={tier.name}
              bg={isCurrent ? 'brand.muted' : 'surface'}
              borderWidth="2px"
              borderColor={isCurrent ? 'brand.solid' : 'border'}
              borderRadius="xl"
              p="4"
              textAlign="center"
            >
              <Text fontSize="3xl">{tier.emoji}</Text>
              <Text fontWeight="semibold" fontSize="sm" mt="2">
                {tier.name}
              </Text>
              <Text fontSize="xs" color="fg.muted" mt="1">
                {tier.minPoints.toLocaleString()}+ pts
              </Text>
              {isCurrent ? (
                <Badge mt="2" colorPalette="green" size="sm">
                  Your Rank
                </Badge>
              ) : null}
              {tier.rewardText ? (
                <Text fontSize="2xs" color="fg.subtle" mt="2">
                  {tier.rewardText}
                </Text>
              ) : null}
            </Box>
          )
        })}
      </SimpleGrid>
      {typeof currentPoints !== 'number' ? (
        <Text mt="6" fontSize="sm" color="fg.subtle">
          Sign in to see your current rank highlighted.
        </Text>
      ) : null}
    </Shell>
  )
}
