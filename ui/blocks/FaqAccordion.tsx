'use client'

import {Box, Heading, Stack, Text} from '@chakra-ui/react'
import type {CmsComponent} from '@platform/core/types/cms'
import type {FaqItem} from '@platform/core/types/ui'
import {Shell} from '@platform/ui/primitives'
import {ChevronDown} from 'lucide-react'
import {useState} from 'react'

export function FaqAccordion({component}: {component: CmsComponent}) {
  const def = Array.isArray(component.componentDefinition) ? component.componentDefinition[0] : null
  const items: FaqItem[] = Array.isArray(component.items) ? component.items : []
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  if (items.length === 0) return null

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

      <Stack gap="3" maxW="prose">
        {items.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <Box
              key={i}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              overflow="hidden"
            >
              <Box
                as="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                w="full"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px="5"
                py="4"
                textAlign="left"
                cursor="pointer"
              >
                <Text fontWeight="medium" fontSize="sm">
                  {faq.question}
                </Text>
                <Box
                  color="fg.muted"
                  transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                  transition="transform 0.2s"
                  flexShrink={0}
                >
                  <ChevronDown size={16} />
                </Box>
              </Box>
              {isOpen ? (
                <Text px="5" pb="4" color="fg.muted" fontSize="sm">
                  {faq.answer}
                </Text>
              ) : null}
            </Box>
          )
        })}
      </Stack>
    </Shell>
  )
}
