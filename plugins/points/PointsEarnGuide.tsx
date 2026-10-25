import {Box, Heading, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import type {CmsComponent} from '@platform/core/types/cms'
import type {PointsEarnRule} from '@platform/core/types/plugins/points'
import {Shell} from '@platform/ui/primitives'

const CATEGORY_LABELS: Record<string, string> = {
  daily: 'Daily',
  account: 'Account',
  content: 'Learning & Content',
  ecommerce: 'Shopping',
  referral: 'Referrals'
}

export function PointsEarnGuide({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const items: PointsEarnRule[] = Array.isArray(component.items) ? component.items : []
  if (items.length === 0) return null

  const groups = items.reduce<Record<string, PointsEarnRule[]>>((acc, rule) => {
    const key = rule.category || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(rule)
    return acc
  }, {})

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

      <SimpleGrid columns={{base: 1, md: 2}} gap="8">
        {Object.entries(groups).map(([category, rules]) => (
          <Box key={category}>
            <Text
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
              color="brand.fg"
              mb="3"
            >
              {CATEGORY_LABELS[category] || category}
            </Text>
            <Stack gap="3">
              {rules.map((rule) => (
                <Box
                  key={rule.action}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="lg"
                  px="4"
                  py="3"
                >
                  <Box display="flex" alignItems="center" gap="3">
                    <Text fontSize="lg">{rule.icon}</Text>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {rule.label}
                      </Text>
                      <Text fontSize="xs" color="fg.subtle">
                        {rule.limit}
                      </Text>
                    </Box>
                  </Box>
                  <Text fontWeight="semibold" color="brand.fg" fontSize="sm" flexShrink={0}>
                    +{rule.pts}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Shell>
  )
}
