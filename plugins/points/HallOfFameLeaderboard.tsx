'use client'

import {Box, Button, Heading, HStack, Progress, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {useMemberStore} from '@platform/core/member-store'
import type {HallOfFameData} from '@platform/core/types/plugins/points'
import {getHallOfFameData} from '@platform/plugins/points/client'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {useEffect, useState} from 'react'

export function HallOfFameLeaderboard() {
  const {member} = useMemberStore()
  const [data, setData] = useState<HallOfFameData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getHallOfFameData().then((d) => {
      setData(d)
      setIsLoading(false)
    })
  }, [member?.id])

  const progress = data?.userProgress

  return (
    <Box bg="overlay.deep" color="fg.inverse" py={{base: '12', md: '20'}}>
      <Shell>
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '3xl', md: '5xl'}}
        >
          Hall of Fame
        </Heading>
        <Text mt="3" color="fg.inverse" maxW="prose">
          Community leaderboards, ranks, and rewards — earned by what you do, not what you pay.
        </Text>

        {member && progress ? (
          <Box mt="8" bg="whiteAlpha.100" borderRadius="xl" p="6">
            <HStack justify="space-between" flexWrap="wrap" gap="3">
              <Box>
                <Text fontSize="sm" color="fg.inverse.muted">
                  Your rank
                </Text>
                <Text fontSize="xl" fontWeight="semibold">
                  {progress.currentRank
                    ? `${progress.currentRank.emoji} ${progress.currentRank.name}`
                    : 'Unranked'}
                  {' · '}
                  {progress.currentPoints.toLocaleString()} pts
                </Text>
              </Box>
              {progress.nextRank ? (
                <Text fontSize="sm" color="fg.inverse.muted">
                  {progress.pointsToNextRank.toLocaleString()} pts to {progress.nextRank.name}
                </Text>
              ) : null}
            </HStack>
            {progress.nextRank ? (
              <Progress.Root
                value={progress.percentToNextRank}
                mt="3"
                size="sm"
                borderRadius="full"
              >
                <Progress.Track bg="whiteAlpha.200">
                  <Progress.Range bg="brand.solid" />
                </Progress.Track>
              </Progress.Root>
            ) : null}
          </Box>
        ) : !member && !isLoading ? (
          <SiteLink href="/register">
            <Button mt="8" size="lg" bg="brand.solid" color="brand.contrast" borderRadius="full">
              Join free and start earning
            </Button>
          </SiteLink>
        ) : null}

        {data && data.leaderboard.length > 0 ? (
          <SimpleGrid columns={{base: 1, md: 2}} gap="3" mt="10">
            {data.leaderboard.slice(0, 10).map((entry) => (
              <Stack
                key={entry.position}
                direction="row"
                align="center"
                justify="space-between"
                bg="whiteAlpha.100"
                borderRadius="lg"
                px="4"
                py="3"
                borderWidth={entry.isCurrentUser ? '1px' : '0'}
                borderColor="brand.solid"
              >
                <HStack gap="3">
                  <Text fontFamily="heading" fontWeight="semibold" w="6" flexShrink={0}>
                    #{entry.position}
                  </Text>
                  <Text fontSize="lg">{entry.rankEmoji}</Text>
                  <Text fontWeight="medium">{entry.displayName}</Text>
                </HStack>
                <Text fontWeight="semibold" color="fg.inverse.muted">
                  {entry.points.toLocaleString()} pts
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        ) : null}
      </Shell>
    </Box>
  )
}
