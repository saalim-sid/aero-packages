import {Box, Link as ChakraLink, type BoxProps, type LinkProps} from '@chakra-ui/react'
import NextLink from 'next/link'
import type {ReactNode} from 'react'

export function SiteLink({
  href,
  children,
  ...rest
}: {href: string; children: ReactNode} & LinkProps) {
  const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  if (external) {
    return (
      <ChakraLink href={href} {...rest}>
        {children}
      </ChakraLink>
    )
  }
  return (
    <ChakraLink asChild {...rest}>
      <NextLink href={href}>{children}</NextLink>
    </ChakraLink>
  )
}

export function Shell({children, ...rest}: BoxProps) {
  return (
    <Box maxW="wide" mx="auto" px={{base: '4', md: '8'}} {...rest}>
      {children}
    </Box>
  )
}

export function Eyebrow({children}: {children: ReactNode}) {
  return (
    <Box
      as="p"
      fontSize="sm"
      fontWeight="medium"
      letterSpacing="widest"
      textTransform="uppercase"
      color="brand.fg"
      mb="3"
    >
      {children}
    </Box>
  )
}
