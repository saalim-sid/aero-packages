'use client'

import {Box, Flex, HStack, IconButton, Text} from '@chakra-ui/react'
import type {CmsPromotionBanner} from '@platform/core/types/cms'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {ArrowRight, Sparkles, X} from 'lucide-react'
import {useState} from 'react'

export function PromotionBanner({banner}: {banner?: CmsPromotionBanner | null}) {
  const [dismissed, setDismissed] = useState(false)

  if (!banner || banner.enabled === false || dismissed) {
    return null
  }

  const {badge, text, linkText, linkHref, dismissible = true} = banner

  return (
    <Box
      bg="bg.inverse"
      color="fg.inverse"
      borderBottomWidth="1px"
      borderColor="border.strong"
      position="relative"
      zIndex="30"
      py={{base: '2.5', md: '2'}}
      px="4"
    >
      <Shell>
        <Flex
          align="center"
          justify="space-between"
          gap="3"
          direction={{base: 'column', sm: 'row'}}
          textAlign={{base: 'center', sm: 'left'}}
        >
          <HStack gap="3" flex="1" justify={{base: 'center', sm: 'flex-start'}} flexWrap="wrap">
            {badge ? (
              <HStack
                bg="brand.contrast"
                color="brand.solid"
                px="2.5"
                py="0.5"
                borderRadius="full"
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wide"
                gap="1"
              >
                <Sparkles size={12} />
                <Text>{badge}</Text>
              </HStack>
            ) : null}
            <Text fontSize="sm" color="fg.inverse" fontWeight="medium">
              {text}
            </Text>
            {linkText && linkHref ? (
              <SiteLink
                href={linkHref}
                fontSize="sm"
                fontWeight="semibold"
                color="white"
                display="inline-flex"
                alignItems="center"
                gap="1"
                _hover={{textDecoration: 'underline', color: 'fg.inverse.muted'}}
              >
                {linkText}
                <ArrowRight size={14} />
              </SiteLink>
            ) : null}
          </HStack>

          {dismissible ? (
            <IconButton
              aria-label="Dismiss banner"
              variant="ghost"
              size="xs"
              color="fg.inverse.muted"
              _hover={{bg: 'whiteAlpha.200', color: 'white'}}
              onClick={() => setDismissed(true)}
            >
              <X size={14} />
            </IconButton>
          ) : null}
        </Flex>
      </Shell>
    </Box>
  )
}
