import {Box, Heading, HStack, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import type {
  CardItem,
  CardsGridSectionProps,
  FeatureListSectionProps,
  NumberedStepsSectionProps,
  StepItem
} from '@platform/core/types/sections'
import {Eyebrow, SiteLink} from '@platform/ui/primitives'
import {Award, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Users} from 'lucide-react'

export function CardsGridSection({
  eyebrow,
  title,
  lede,
  items,
  columns = {base: 1, md: 2, lg: 3}
}: CardsGridSectionProps) {
  const rawItems = Array.isArray(items) ? items : []

  if (rawItems.length === 0 && !title) return null

  return (
    <Box py={{base: '8', md: '12'}}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '4xl'}}
          mb="3"
        >
          {title}
        </Heading>
      ) : null}
      {lede ? (
        <Text color="fg.muted" maxW="prose" mb="8">
          {lede}
        </Text>
      ) : null}

      <SimpleGrid columns={columns} gap="5">
        {rawItems.map((item: CardItem, idx: number) => {
          return (
            <Box
              key={idx}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="6"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              transition="all 0.2s ease"
              _hover={{borderColor: 'brand.fg', shadow: 'sm'}}
            >
              <Box>
                {item.badge ? (
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    color="brand.fg"
                    mb="2"
                  >
                    {item.badge}
                  </Text>
                ) : null}
                {item.title ? (
                  <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
                    {item.title}
                  </Heading>
                ) : null}
                {item.body ? (
                  <Text mt="3" color="fg.muted" fontSize="sm" lineHeight="relaxed">
                    {item.body}
                  </Text>
                ) : null}
              </Box>

              {item.href && item.cta ? (
                <SiteLink
                  href={item.href}
                  mt="4"
                  display="inline-block"
                  color="brand.fg"
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {item.cta} →
                </SiteLink>
              ) : null}
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

export function NumberedStepsSection({
  eyebrow,
  title,
  lede,
  items,
  columns = {base: 1, md: 2}
}: NumberedStepsSectionProps) {
  const rawItems = Array.isArray(items) ? items : []

  if (rawItems.length === 0 && !title) return null

  return (
    <Box py={{base: '6', md: '10'}}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <Heading
          as="h2"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '2xl', md: '3xl'}}
          mb="2"
        >
          {title}
        </Heading>
      ) : null}
      {lede ? (
        <Text color="fg.muted" maxW="prose" mb="6">
          {lede}
        </Text>
      ) : null}

      <SimpleGrid columns={columns} gap="4">
        {rawItems.map((item: StepItem, index: number) => (
          <Box
            key={index}
            bg="surface"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            p="5"
          >
            <Text color="brand.fg" fontFamily="heading" fontSize="xl" fontWeight="semibold">
              {String(index + 1).padStart(2, '0')}
            </Text>
            {item.title ? (
              <Heading as="h3" fontSize="lg" fontFamily="heading" fontWeight="medium" mt="1">
                {item.title}
              </Heading>
            ) : null}
            {item.body ? (
              <Text mt="2" color="fg.muted" fontSize="sm">
                {item.body}
              </Text>
            ) : null}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

const iconMap: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  check: CheckCircle2,
  shield: ShieldCheck,
  award: Award,
  heart: HeartHandshake,
  users: Users
}

export function FeatureListSection({title, lede, items}: FeatureListSectionProps) {
  const rawItems = Array.isArray(items) ? items : []

  if (rawItems.length === 0 && !title) return null

  return (
    <Stack gap="6">
      {title ? (
        <Box>
          <Heading as="h2" fontFamily="heading" fontWeight="semibold" fontSize="2xl" mb="3">
            {title}
          </Heading>
          {lede ? <Text color="fg.muted">{lede}</Text> : null}
        </Box>
      ) : null}

      <Stack gap="4">
        {rawItems.map((item, idx) => {
          const IconComp = (item.icon && iconMap[item.icon.toLowerCase()]) || CheckCircle2
          return (
            <HStack key={idx} align="start" gap="3">
              <Box color="brand.fg" mt="1">
                <IconComp size={18} />
              </Box>
              <Box>
                {item.title ? (
                  <Text fontWeight="semibold" fontSize="sm">
                    {item.title}
                  </Text>
                ) : null}
                {item.body ? (
                  <Text color="fg.muted" fontSize="sm">
                    {item.body}
                  </Text>
                ) : null}
              </Box>
            </HStack>
          )
        })}
      </Stack>
    </Stack>
  )
}
