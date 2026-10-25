import {Box, Button, Heading, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import type {CtaBandProps, HowYouCanHelpProps} from '@platform/core/types/sections'
import {Eyebrow} from '@platform/ui/primitives'
import NextLink from 'next/link'
export {PromotionBanner} from '@platform/ui/PromotionBanner'

export function JoinButton({label, href = '/register'}: {label?: string; href?: string}) {
  if (!label) return null
  return (
    <Button asChild size="lg" bg="brand.solid" color="brand.contrast" borderRadius="md">
      <NextLink href={href}>{label}</NextLink>
    </Button>
  )
}

export function GhostButton({href, label}: {href: string; label: string}) {
  if (!label || !href) return null
  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      borderColor="border.strong"
      color="brand.ghost"
      borderRadius="md"
      _hover={{color: 'black'}}
    >
      <NextLink href={href}>{label}</NextLink>
    </Button>
  )
}

export function InverseButton({href, label}: {href: string; label: string}) {
  if (!label || !href) return null
  return (
    <Button asChild size="lg" bg="brand.contrast" color="brand.solid" borderRadius="md">
      <NextLink href={href}>{label}</NextLink>
    </Button>
  )
}

export function CtaBand({title, body, ctaLabel, ctaHref}: CtaBandProps) {
  if (!title && !body && !ctaLabel) {
    return null
  }

  return (
    <Box
      bg="bg.inverse"
      color="fg.inverse"
      borderRadius="2xl"
      px={{base: '6', md: '12'}}
      py={{base: '10', md: '14'}}
    >
      <Stack gap="5" maxW="prose">
        {title ? (
          <Heading
            as="h2"
            fontFamily="heading"
            fontWeight="medium"
            fontSize={{base: '2xl', md: '4xl'}}
          >
            {title}
          </Heading>
        ) : null}
        {body ? <Text color="fg.inverse.muted">{body}</Text> : null}
        {ctaHref && ctaLabel ? (
          <Box pt="2">
            <InverseButton href={ctaHref} label={ctaLabel} />
          </Box>
        ) : null}
      </Stack>
    </Box>
  )
}

export function HowYouCanHelp({items, eyebrow, heading, footerText}: HowYouCanHelpProps) {
  const resolvedItems = Array.isArray(items) ? items : []

  if (!heading && resolvedItems.length === 0) {
    return null
  }

  return (
    <Box>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '4xl'}}
          mb="8"
        >
          {heading}
        </Heading>
      ) : null}
      {resolvedItems.length > 0 ? (
        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
          {resolvedItems.map((item, index) => (
            <Box
              key={index}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="5"
            >
              <Text fontFamily="heading" fontSize="2xl" color="brand.fg">
                {String(index + 1).padStart(2, '0')}
              </Text>
              <Text mt="2">{item}</Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : null}
      {footerText ? (
        <Text mt="6" color="fg.muted" maxW="prose">
          {footerText}
        </Text>
      ) : null}
    </Box>
  )
}
