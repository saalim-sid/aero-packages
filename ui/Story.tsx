import {Box, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {CtaBand, GhostButton, HowYouCanHelp, JoinButton} from '@platform/ui/Ctas'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'

export function StoryPage({
  kicker,
  title,
  lede,
  imageUrl,
  imageAlt,
  body,
  facts,
  quotes,
  secondaryLabel,
  secondaryHref
}: {
  kicker?: string
  title: string
  lede: string
  imageUrl?: string
  imageAlt?: string
  body: string[]
  facts?: {value: string; label: string}[]
  quotes?: {text: string; cite?: string}[]
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <>
      <PageHero
        kicker={kicker}
        title={title}
        lede={lede}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        actions={
          <Stack direction={{base: 'column', sm: 'row'}} gap="3">
            <JoinButton />
            <GhostButton href={secondaryHref || ''} label={secondaryLabel || ''} />
          </Stack>
        }
      />
      <Shell py="16">
        <Stack gap="10" maxW="prose">
          {body.map((paragraph) => (
            <Text key={paragraph.slice(0, 32)} color="fg.muted" fontSize="md">
              {paragraph}
            </Text>
          ))}
        </Stack>
        {facts?.length ? (
          <SimpleGrid columns={{base: 1, md: 3}} gap="4" mt="12">
            {facts.map((item) => (
              <Box
                key={item.label}
                bg="surface"
                borderWidth="1px"
                borderColor="border"
                borderRadius="xl"
                p="5"
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
        ) : null}
        {quotes?.length ? (
          <Stack gap="8" mt="12">
            {quotes.map((quote) => (
              <Box
                key={quote.text.slice(0, 20)}
                borderLeftWidth="4px"
                borderColor="brand.solid"
                pl="6"
              >
                <Text fontFamily="heading" fontSize="xl" fontStyle="italic">
                  {quote.text}
                </Text>
                {quote.cite ? (
                  <Text mt="2" fontSize="sm" color="fg.subtle">
                    {quote.cite}
                  </Text>
                ) : null}
              </Box>
            ))}
          </Stack>
        ) : null}
      </Shell>
      <Shell pb="16">
        <Stack gap="16">
          <HowYouCanHelp />
          <CtaBand />
        </Stack>
      </Shell>
    </>
  )
}
