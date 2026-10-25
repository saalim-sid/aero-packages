import {Box, HStack, Image, Text} from '@chakra-ui/react'
import {siteMeta} from '@platform/core/site-meta'
import NextLink from 'next/link'
import type {ReactNode} from 'react'

export function Mark({size = '10'}: {size?: '8' | '10' | '12'}) {
  return (
    <Image
      src="/favicon.svg"
      alt={siteMeta.name}
      boxSize={size}
      objectFit="contain"
      flexShrink="0"
      aria-hidden="true"
    />
  )
}

export function Logo({
  compact = false,
  tone = 'brand',
  strapline,
  after
}: {
  compact?: boolean
  tone?: 'brand' | 'inverse'
  strapline?: string
  after?: ReactNode
}) {
  const fg = tone === 'inverse' ? 'fg.inverse' : 'fg'
  const muted = tone === 'inverse' ? 'fg.inverse.subtle' : 'fg.subtle'
  return (
    <Box asChild>
      <NextLink href="/" aria-label={`${siteMeta.name} home`}>
        <HStack gap="3" align="center">
          <Mark />
          <Box lineHeight="short">
            <Text
              fontFamily="heading"
              fontWeight="medium"
              fontSize={compact ? 'md' : 'lg'}
              letterSpacing="tight"
              color={fg}
            >
              {siteMeta.shortName}
            </Text>
            {!compact && strapline ? (
              <Text fontSize="xs" color={fg} fontWeight="medium">
                {strapline}
              </Text>
            ) : null}
            {!compact && after ? (
              <Text fontSize="xs" color={muted} letterSpacing="wide">
                {after}
              </Text>
            ) : null}
          </Box>
        </HStack>
      </NextLink>
    </Box>
  )
}
