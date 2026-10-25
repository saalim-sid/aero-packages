import {Badge, Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import type {CmsComponent} from '@platform/core/types/cms'
import type {ShoppingTierItem} from '@platform/core/types/plugins/points'
import {Shell} from '@platform/ui/primitives'

export function ShoppingTiersGrid({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const items: ShoppingTierItem[] = Array.isArray(component.items) ? component.items : []
  if (items.length === 0) return null

  return (
    <Box bg="bg.canvas" py="16">
      <Shell>
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

        <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} gap="5">
          {items.map((tier) => (
            <Box
              key={tier.name}
              bg="surface"
              borderWidth="1px"
              borderColor={tier.isLegend ? 'brand.solid' : 'border'}
              borderRadius="xl"
              p="6"
            >
              <Text fontSize="2xl">{tier.emoji}</Text>
              <Heading as="h3" fontFamily="heading" fontSize="lg" fontWeight="medium" mt="1">
                {tier.name}
              </Heading>
              <Text fontWeight="semibold" color="brand.fg" mt="1">
                {tier.ptsPerPurchase} pts / purchase
              </Text>
              {tier.benefit ? (
                <Text mt="2" color="fg.muted" fontSize="sm">
                  {tier.benefit}
                </Text>
              ) : null}
              {tier.hasLottery ? (
                <Badge mt="3" colorPalette="purple" size="sm">
                  Weekly lottery access
                </Badge>
              ) : null}
            </Box>
          ))}
        </SimpleGrid>
      </Shell>
    </Box>
  )
}
