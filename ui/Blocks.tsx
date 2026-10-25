import {Box, Heading, Image, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {Block} from '@platform/core/types/cms'
import {CtaBand, GhostButton, HowYouCanHelp} from '@platform/ui/Ctas'
import {Eyebrow, SiteLink} from '@platform/ui/primitives'

export function BlockView({block}: {block: Block}) {
  switch (block.type) {
    case 'prose':
      return (
        <Stack gap="4" maxW="prose">
          {block.kicker ? <Eyebrow>{block.kicker}</Eyebrow> : null}
          {block.title ? (
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '2xl', md: '4xl'}}
            >
              {block.title}
            </Heading>
          ) : null}
          {block.body.map((paragraph, i) => (
            <Text key={i} color="fg.muted" fontSize="md">
              {paragraph}
            </Text>
          ))}
        </Stack>
      )
    case 'list':
      return (
        <Stack gap="3" maxW="prose">
          {block.title ? (
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '2xl', md: '3xl'}}
            >
              {block.title}
            </Heading>
          ) : null}
          <Stack as="ul" gap="2" pl="5">
            {block.items.map((item, i) => (
              <Box as="li" key={i} color="fg.muted">
                {item}
              </Box>
            ))}
          </Stack>
        </Stack>
      )
    case 'numbered':
      return (
        <Stack gap="6">
          {block.title ? (
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '2xl', md: '4xl'}}
            >
              {block.title}
            </Heading>
          ) : null}
          <SimpleGrid columns={{base: 1, md: 2}} gap="4">
            {block.items.map((item, index) => (
              <Box
                key={index}
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="xl"
                p="6"
              >
                <Text fontFamily="heading" fontSize="2xl" color="brand.fg">
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Heading as="h3" fontSize="xl" fontFamily="heading" fontWeight="medium" mt="2">
                  {item.title}
                </Heading>
                <Text mt="2" color="fg.muted">
                  {item.body}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      )
    case 'stats':
      return (
        <SimpleGrid columns={{base: 2, md: 4}} gap="4">
          {block.items.map((item, i) => (
            <Box
              key={i}
              bg="surface"
              borderRadius="xl"
              p="5"
              borderWidth="1px"
              borderColor="border"
            >
              <Text fontFamily="heading" fontSize="3xl">
                {item.value}
              </Text>
              <Text fontSize="sm" color="fg.muted" mt="1">
                {item.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )
    case 'cards':
      return (
        <Stack gap="6">
          {block.title ? (
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '2xl', md: '4xl'}}
            >
              {block.title}
            </Heading>
          ) : null}
          <SimpleGrid columns={{base: 1, md: 3}} gap="4">
            {block.items.map((item, i) => (
              <Box
                key={i}
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="xl"
                p="6"
              >
                <Heading as="h3" fontSize="xl" fontFamily="heading" fontWeight="medium">
                  {item.title}
                </Heading>
                <Text mt="3" color="fg.muted">
                  {item.body}
                </Text>
                {item.href ? (
                  <SiteLink
                    href={item.href}
                    mt="4"
                    display="inline-block"
                    color="brand.fg"
                    fontWeight="medium"
                  >
                    {item.cta ?? 'Learn more'}
                  </SiteLink>
                ) : null}
              </Box>
            ))}
          </SimpleGrid>
        </Stack>
      )
    case 'quote':
      return (
        <Box borderLeftWidth="4px" borderColor="brand.solid" pl="6" py="2" maxW="prose">
          <Text fontFamily="heading" fontSize={{base: 'xl', md: '2xl'}} fontStyle="italic">
            {block.text}
          </Text>
          {block.cite ? (
            <Text mt="3" color="fg.subtle" fontSize="sm">
              {block.cite}
            </Text>
          ) : null}
        </Box>
      )
    case 'split':
      return (
        <SimpleGrid columns={{base: 1, md: 2}} gap="8" alignItems="center">
          <Image
            src={resolveCmsImageUrl(block.imageUrl)}
            alt={block.alt}
            w="full"
            borderRadius="2xl"
            objectFit="cover"
          />
          <Stack gap="4">
            <Heading
              as="h2"
              fontFamily="heading"
              fontWeight="medium"
              fontSize={{base: '2xl', md: '4xl'}}
            >
              {block.title}
            </Heading>
            {block.body.map((paragraph, i) => (
              <Text key={i} color="fg.muted">
                {paragraph}
              </Text>
            ))}
            {block.href ? (
              <GhostButton href={block.href} label={block.cta ?? 'Learn more'} />
            ) : null}
          </Stack>
        </SimpleGrid>
      )
    case 'help':
      return <HowYouCanHelp />
    case 'cta':
      return <CtaBand title={block.title} body={block.body} />
    default:
      return null
  }
}
