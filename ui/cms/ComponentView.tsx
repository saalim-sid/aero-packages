import {Box, Button, Heading, Image, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import {imageOverlay} from '@platform/core/image-overlay'
import type {CmsComponent} from '@platform/core/types/cms'
import {BlockView} from '@platform/ui/Blocks'
import {cardsGridBlock} from '@platform/ui/blocks/cards-grid-block'
import {FaqAccordion} from '@platform/ui/blocks/FaqAccordion'
import {LegalFooterDisclaimer} from '@platform/ui/blocks/LegalFooterDisclaimer'
import {CtaBand, GhostButton, HowYouCanHelp, JoinButton, PromotionBanner} from '@platform/ui/Ctas'
import {ImageSlider} from '@platform/ui/ImageSlider'
import {Eyebrow, Shell, SiteLink} from '@platform/ui/primitives'
import {FeatureListSection, NumberedStepsSection} from '@platform/ui/Sections'
import {VideoGrid} from '@platform/ui/VideoGrid'
import NextLink from 'next/link'
import type {ReactNode} from 'react'

const ItemCards = cardsGridBlock('items')

/** Built-in CMS components; `fallback` shows for types this list does not know. */
export function ComponentView({
  component,
  fallback = null
}: {
  component: CmsComponent
  fallback?: ReactNode
}) {
  const type = component.componentType ?? ''
  switch (type) {
    case 'hero': {
      const mantra = Array.isArray(component.mantra) ? component.mantra.join('  ·  ') : ''
      return (
        <Box position="relative" minH={{base: 'lg', md: 'xl'}} overflow="hidden">
          {resolveCmsImageUrl(component.imageUrl) ? (
            <Image
              src={resolveCmsImageUrl(component.imageUrl)}
              alt={component.imageAlt || ''}
              position="absolute"
              inset="0"
              w="full"
              h="full"
              objectFit="cover"
            />
          ) : null}
          <Box
            position="absolute"
            inset="0"
            bgImage={imageOverlay(component.overlayStrength, 55)}
          />
          <Shell position="relative" py={{base: '16', md: '28'}}>
            <Stack gap="6" maxW="prose" color="fg.inverse">
              {mantra ? (
                <Text
                  fontSize="sm"
                  letterSpacing="widest"
                  textTransform="uppercase"
                  color="fg.inverse.muted"
                >
                  {mantra}
                </Text>
              ) : null}
              {component.tagline ? (
                <Heading
                  as="h1"
                  fontFamily="heading"
                  fontWeight="medium"
                  fontSize={{base: '4xl', md: '6xl'}}
                  lineHeight="shorter"
                >
                  {component.tagline}
                </Heading>
              ) : null}
              {component.lede ? (
                <Text fontSize={{base: 'md', md: 'xl'}} color="fg.inverse">
                  {component.lede}
                </Text>
              ) : null}
              <Stack direction={{base: 'column', sm: 'row'}} gap="3" align="start">
                {component.joinLabel ? (
                  <JoinButton label={component.joinLabel} href={component.joinHref} />
                ) : null}
                {component.learnHref && component.learnLabel ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    borderColor="border.inverse"
                    color="fg.inverse"
                    borderRadius="full"
                    px="6"
                    _hover={{bg: 'overlay.subtle'}}
                  >
                    <NextLink href={component.learnHref}>{component.learnLabel}</NextLink>
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Shell>
        </Box>
      )
    }

    case 'mission-grid': {
      const items = Array.isArray(component.items) ? component.items : []
      if (items.length === 0) return null
      return (
        <Box bg="bg.canvas" py="16">
          <Shell>
            <SimpleGrid columns={{base: 1, md: 3}} gap="6">
              {items.map((item: any, i: number) => (
                <Box key={i}>
                  <Heading as="h3" fontFamily="heading" fontSize="2xl" fontWeight="medium">
                    {item.title}
                  </Heading>
                  {item.body ? (
                    <Text mt="3" color="fg.muted">
                      {item.body}
                    </Text>
                  ) : null}
                  {item.href && item.cta ? (
                    <SiteLink
                      href={item.href}
                      mt="4"
                      display="inline-block"
                      color="brand.fg"
                      fontWeight="medium"
                    >
                      {item.cta}
                    </SiteLink>
                  ) : null}
                </Box>
              ))}
            </SimpleGrid>
          </Shell>
        </Box>
      )
    }

    case 'image-banner': {
      const bannerImage = resolveCmsImageUrl(component.imageUrl)
      const slides = (Array.isArray(component.slides) ? component.slides : [])
        .map((sl: {image?: unknown; imageUrl?: string; imageAlt?: string}) => ({
          src: resolveCmsImageUrl(sl?.imageUrl) || '',
          alt: sl?.imageAlt || ''
        }))
        .filter((sl: {src: string}) => sl.src)
      return (
        <Shell py="16">
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            minH={{base: 'sm', md: 'md'}}
            display="flex"
            alignItems="center"
          >
            {slides.length > 1 ? (
              <ImageSlider slides={slides} label={component.titleText || 'Images'} />
            ) : bannerImage ? (
              <Image
                src={bannerImage}
                alt={component.imageAlt || ''}
                position="absolute"
                inset="0"
                w="full"
                h="full"
                objectFit="cover"
              />
            ) : null}
            <Box
              position="absolute"
              inset="0"
              bgImage={imageOverlay(component.overlayStrength, 55)}
              pointerEvents="none"
            />
            <Box position="relative" p={{base: '8', md: '14'}} maxW="prose" color="fg.inverse">
              {component.eyebrow ? (
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  letterSpacing="widest"
                  textTransform="uppercase"
                  color="fg.inverse.muted"
                  mb="2"
                >
                  {component.eyebrow}
                </Text>
              ) : null}
              <Heading
                as="h2"
                fontFamily="heading"
                fontWeight="medium"
                fontSize={{base: '2xl', md: '4xl'}}
              >
                {component.titleText}
              </Heading>
              {component.lede ? (
                <Text mt="4" fontSize="lg" color="fg.inverse">
                  {component.lede}
                </Text>
              ) : null}
              {component.ctaHref && component.ctaLabel ? (
                <Box mt="6">
                  <JoinButton label={component.ctaLabel} href={component.ctaHref} />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Shell>
      )
    }

    case 'pillars': {
      const pillars = Array.isArray(component.pillars) ? component.pillars : []
      if (pillars.length === 0) return null
      return (
        <Shell py="16">
          {component.eyebrow ? <Eyebrow>{component.eyebrow}</Eyebrow> : null}
          {component.titleText ? (
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '3xl', md: '4xl'}}
              mb="8"
            >
              {component.titleText}
            </Heading>
          ) : null}
          <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap="6">
            {pillars.map((pillar: any, i: number) => (
              <Box
                key={i}
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="xl"
                p="6"
              >
                <Text fontFamily="heading" fontSize="3xl" color="brand.fg" fontWeight="semibold">
                  {pillar.n}
                </Text>
                <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="2">
                  {pillar.title}
                </Heading>
                {pillar.body ? (
                  <Text mt="3" color="fg.muted" fontSize="sm">
                    {pillar.body}
                  </Text>
                ) : null}
                {pillar.href ? (
                  <SiteLink
                    href={pillar.href}
                    mt="4"
                    display="inline-block"
                    color="brand.fg"
                    fontWeight="medium"
                  >
                    Learn more
                  </SiteLink>
                ) : null}
              </Box>
            ))}
          </SimpleGrid>
        </Shell>
      )
    }

    case 'stats-grid': {
      const stats = Array.isArray(component.stats) ? component.stats : []
      if (stats.length === 0) return null
      return (
        <Box bg="bg.canvas" py="16">
          <Shell>
            <SimpleGrid columns={{base: 2, md: 3, lg: 6}} gap="4">
              {stats.map((item: any, i: number) => (
                <Box key={i}>
                  <Text fontFamily="heading" fontSize="3xl">
                    {item.value}
                  </Text>
                  <Text fontSize="sm" color="fg.muted" mt="1">
                    {item.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Shell>
        </Box>
      )
    }

    case 'split-feature': {
      const imageSrc = resolveCmsImageUrl(component.imageUrl)
      return (
        <Shell py="16">
          <SimpleGrid columns={{base: 1, md: 2}} gap="10" alignItems="center">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={component.imageAlt || ''}
                w="full"
                borderRadius="2xl"
                objectFit="cover"
              />
            ) : null}
            <Stack gap="4">
              {component.eyebrow ? <Eyebrow>{component.eyebrow}</Eyebrow> : null}
              <Heading
                as="h2"
                fontFamily="heading"
                fontWeight="medium"
                fontSize={{base: '3xl', md: '4xl'}}
              >
                {component.titleText}
              </Heading>
              {component.body ? <Text color="fg.muted">{component.body}</Text> : null}
              {component.ctaHref && component.ctaLabel ? (
                <GhostButton href={component.ctaHref} label={component.ctaLabel} />
              ) : null}
            </Stack>
          </SimpleGrid>
        </Shell>
      )
    }

    case 'split-feature-quote': {
      const imageSrc = resolveCmsImageUrl(component.imageUrl)
      return (
        <Box bg="bg.canvas" py="16">
          <Shell>
            <SimpleGrid columns={{base: 1, md: 2}} gap="10" alignItems="center">
              <Stack gap="4">
                {component.eyebrow ? <Eyebrow>{component.eyebrow}</Eyebrow> : null}
                <Heading
                  as="h2"
                  fontFamily="heading"
                  fontWeight="medium"
                  fontSize={{base: '3xl', md: '4xl'}}
                  lineHeight="1"
                >
                  {component.titleText}
                </Heading>
                {component.quote ? (
                  <Text color="fg.muted" fontFamily="heading" fontSize="xl" fontStyle="italic">
                    {component.quote}
                  </Text>
                ) : null}
                {component.cite ? (
                  <Text color="fg.subtle" fontSize="sm">
                    {component.cite}
                  </Text>
                ) : null}
                {component.ctaHref && component.ctaLabel ? (
                  <GhostButton href={component.ctaHref} label={component.ctaLabel} />
                ) : null}
              </Stack>
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={component.imageAlt || ''}
                  w="full"
                  borderRadius="2xl"
                  objectFit="cover"
                />
              ) : null}
            </SimpleGrid>
          </Shell>
        </Box>
      )
    }

    case 'home-community': {
      const howYouCanHelp = Array.isArray(component.howYouCanHelp) ? component.howYouCanHelp : []
      return (
        <Shell py="16">
          <Stack gap="16">
            <Box>
              {component.eyebrow ? <Eyebrow>{component.eyebrow}</Eyebrow> : null}
              {component.titleText ? (
                <Heading
                  as="h2"
                  fontFamily="heading"
                  fontWeight="medium"
                  fontSize={{base: '3xl', md: '4xl'}}
                  maxW="prose"
                  lineHeight="1"
                >
                  {component.titleText}
                </Heading>
              ) : null}
              {component.subTitle ? (
                <Text mt="4" color="fg.muted" maxW="prose">
                  {component.subTitle}
                </Text>
              ) : null}
              <Box mt="6">
                {howYouCanHelp.length > 0 ? <HowYouCanHelp items={howYouCanHelp} /> : null}
              </Box>

              {component.body ? (
                <Text mt="4" color="fg.muted" maxW="prose">
                  {component.body}
                </Text>
              ) : null}
              {component.ctaHref && component.ctaLabel ? (
                <Box mt="6">
                  <GhostButton href={component.ctaHref} label={component.ctaLabel} />
                </Box>
              ) : null}
            </Box>
          </Stack>
        </Shell>
      )
    }

    case 'cta-band':
    case 'cta': {
      return (
        <Shell py="8">
          <CtaBand
            title={component.titleText}
            body={component.body}
            ctaLabel={component.ctaLabel}
            ctaHref={component.ctaHref}
          />
        </Shell>
      )
    }

    case 'how-you-can-help':
    case 'help': {
      return (
        <Shell py="8">
          <HowYouCanHelp
            eyebrow={component.eyebrow}
            heading={component.titleText}
            items={component.howYouCanHelp}
            footerText={component.footerText}
          />
        </Shell>
      )
    }

    case 'cards':
    case 'cards-grid': {
      return <ItemCards component={component} />
    }

    case 'numbered-steps':
    case 'step-list':
    case 'steps-grid': {
      return (
        <Shell>
          <NumberedStepsSection
            eyebrow={component.eyebrow}
            title={component.titleText}
            lede={component.lede}
            items={component.items}
          />
        </Shell>
      )
    }

    case 'feature-list':
    case 'value-props': {
      return (
        <Shell py="8">
          <FeatureListSection
            title={component.titleText}
            lede={component.lede}
            items={component.items}
          />
        </Shell>
      )
    }

    case 'promotion-banner': {
      return <PromotionBanner banner={component as any} />
    }

    case 'faqAccordion': {
      return <FaqAccordion component={component} />
    }

    case 'footerDisclaimer': {
      return <LegalFooterDisclaimer component={component} />
    }

    case 'video-grid':
    case 'videoGrid': {
      return <VideoGrid component={component} />
    }

    case 'content-blocks': {
      const blocks = Array.isArray(component.blocks) ? component.blocks : []
      return (
        <>
          {blocks.map((block: any, idx: number) => (
            <BlockView key={block._key || `${component._id}-${idx}`} block={block} />
          ))}
        </>
      )
    }

    default: {
      if (Array.isArray(component.blocks) && component.blocks.length > 0) {
        return (
          <>
            {component.blocks.map((block: any, idx: number) => (
              <BlockView key={block._key || `${component._id}-${idx}`} block={block} />
            ))}
          </>
        )
      }
      // Components made in the CMS Components list keep their content in componentDefinition.
      const def =
        (Array.isArray(component.componentDefinition) && component.componentDefinition[0]) || {}
      if (def._type === 'bannerComponent' && (def.bannerTitle || def.bannerSubtitle)) {
        return (
          <Shell py="10">
            <CtaBand title={def.bannerTitle} body={def.bannerSubtitle} />
          </Shell>
        )
      }
      if (def._type === 'linkComponent' && def.text && def.url) {
        return (
          <Shell py="6">
            <GhostButton href={def.url} label={def.text} />
          </Shell>
        )
      }
      return fallback
    }
  }
}
