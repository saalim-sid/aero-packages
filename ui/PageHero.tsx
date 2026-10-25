import {Box, Heading, Image, Stack, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {PageHeroProps} from '@platform/core/types/ui'
import {Breadcrumbs} from '@platform/ui/Breadcrumbs'
import {Eyebrow, Shell} from '@platform/ui/primitives'

export function PageHero({
  kicker,
  title,
  lede,
  imageUrl,
  imageAlt,
  actions,
  compact,
  breadcrumbs
}: PageHeroProps) {
  const imageSrc = resolveCmsImageUrl(imageUrl)
  const titleSize = compact ? {base: '2xl', md: '4xl'} : {base: '3xl', md: '5xl'}
  const ledeSize = compact ? 'md' : {base: 'md', md: 'lg'}

  if (imageSrc) {
    return (
      <Box
        position="relative"
        minH={compact ? {base: 'xs', md: 'sm'} : {base: 'sm', md: 'md'}}
        overflow="hidden"
      >
        <Image
          src={imageSrc}
          alt={imageAlt ?? ''}
          position="absolute"
          inset="0"
          w="full"
          h="full"
          objectFit="cover"
        />
        <Box position="absolute" inset="0" bg="overlay" />
        <Shell position="relative" py={compact ? {base: '8', md: '12'} : {base: '16', md: '24'}}>
          <Stack gap={compact ? '3' : '5'} maxW="prose" color="fg.inverse">
            {breadcrumbs ? (
              <Breadcrumbs items={breadcrumbs} inverse />
            ) : kicker ? (
              <Text
                fontSize="sm"
                fontWeight="medium"
                letterSpacing="widest"
                textTransform="uppercase"
                color="fg.inverse.muted"
              >
                {kicker}
              </Text>
            ) : null}
            {title ? (
              <Heading
                as="h1"
                fontFamily="heading"
                fontWeight="medium"
                fontSize={titleSize}
                lineHeight="shorter"
              >
                {title}
              </Heading>
            ) : null}
            {lede ? (
              <Text fontSize={ledeSize} color="fg.inverse">
                {lede}
              </Text>
            ) : null}
            {actions}
          </Stack>
        </Shell>
      </Box>
    )
  }

  if (!title && !kicker && !lede && !actions && !breadcrumbs) {
    return null
  }

  return (
    <Box bg="bg.canvas" borderBottomWidth="1px" borderColor="border">
      <Shell py={compact ? {base: '6', md: '8'} : {base: '12', md: '16'}}>
        <Stack gap={compact ? '2' : '4'} maxW="prose">
          {breadcrumbs ? (
            <Breadcrumbs items={breadcrumbs} />
          ) : kicker ? (
            <Eyebrow>{kicker}</Eyebrow>
          ) : null}
          {title ? (
            <Heading
              as="h1"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={titleSize}
              lineHeight="shorter"
            >
              {title}
            </Heading>
          ) : null}
          {lede ? (
            <Text fontSize={ledeSize} color="fg.muted">
              {lede}
            </Text>
          ) : null}
          {actions}
        </Stack>
      </Shell>
    </Box>
  )
}
