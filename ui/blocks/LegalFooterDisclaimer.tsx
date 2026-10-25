import {Box, Text} from '@chakra-ui/react'
import type {CmsComponent} from '@platform/core/types/cms'
import {Shell} from '@platform/ui/primitives'

export function LegalFooterDisclaimer({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  if (!def?.subheading) return null

  return (
    <Box bg="bg.canvas" borderTopWidth="1px" borderColor="border" py="8">
      <Shell>
        {def.heading ? (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color="fg.subtle"
            mb="2"
          >
            {def.heading}
          </Text>
        ) : null}
        <Text fontSize="xs" color="fg.subtle" maxW="prose">
          {def.subheading}
        </Text>
      </Shell>
    </Box>
  )
}
