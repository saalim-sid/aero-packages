'use client'

import {siteMeta} from '@platform/core/site-meta'
import {T} from '@platform/themes/legal-finance/ui'
import {Box, type HTMLChakraProps} from '@chakra-ui/react'
import Image from 'next/image'

export function Logo({isDarkMode, ...rest}: {isDarkMode: boolean} & HTMLChakraProps<'div'>) {
  return (
    <Box display="flex" alignItems="center" gap="2" {...rest}>
      <Image
        src={isDarkMode ? '/images/fa-icon-white.svg' : '/images/fa-icon.svg'}
        alt="Logo"
        width="40"
        height="40"
      />
      <T variant="h5" as="div" fontWeight={700} cursor="pointer">
        {siteMeta.name}
      </T>
    </Box>
  )
}
