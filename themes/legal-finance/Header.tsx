'use client'

import {Logo} from '@platform/themes/legal-finance/Logo'
import {Button, Container, Icon, T} from '@platform/themes/legal-finance/ui'
import type {HeaderProps} from '@platform/core/types/platform'
import type {SiteHeaderData} from '@platform/core/types/theme-ui'
import {Box, chakra} from '@chakra-ui/react'
import NextLink from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

export function Header({cmsData}: HeaderProps) {
  const data = (cmsData || {}) as SiteHeaderData
  const nav = data.primaryNav || []
  const cta = data.cta
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex={1100}
        display="flex"
        flexDirection="column"
        w="100%"
        boxSizing="border-box"
        flexShrink={0}
        bg="white"
        color="fg"
        boxShadow="header"
      >
        <Container>
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            minH={{base: '14', sm: '16'}}
            px={{base: '4', sm: '6'}}
            py="2"
          >
            <NextLink href="/" style={{textDecoration: 'none', color: 'inherit'}}>
              <Logo isDarkMode={false} color="primary" />
            </NextLink>

            <Box display={{base: 'none', md: 'flex'}} alignItems="center" gap="2">
              {nav.map((item) => (
                <Button
                  key={item.href}
                  href={item.href}
                  py="2"
                  px="2.5"
                  mx="2"
                  color={active(item.href) ? 'primary' : 'fg'}
                  _hover={{bg: 'primary.light', color: 'white'}}
                >
                  {item.label}
                </Button>
              ))}
              {cta ? (
                <Button
                  variant="contained"
                  href={cta.href}
                  startIcon={<Icon name="phone" />}
                  ml="4"
                >
                  {cta.label}
                </Button>
              ) : null}
            </Box>

            <chakra.button
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              display={{base: 'inline-flex', md: 'none'}}
              alignItems="center"
              justifyContent="center"
              p="2"
              ml="-3"
              borderRadius="full"
              border="0"
              bg="transparent"
              color="fg"
              cursor="pointer"
              fontSize="1.5rem"
            >
              <Icon name="menu" />
            </chakra.button>
          </Box>
        </Container>
      </Box>

      {open ? (
        <Box position="fixed" inset="0" zIndex={1200}>
          <Box position="fixed" inset="0" bg="rgba(0, 0, 0, 0.5)" onClick={() => setOpen(false)} />
          <Box
            position="fixed"
            top="0"
            right="0"
            h="100%"
            w="drawer"
            bg="white"
            color="fg"
            boxShadow="0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)"
            overflowY="auto"
          >
            <Box p="4" display="flex" justifyContent="space-between" alignItems="center">
              <T variant="h6" fontWeight={600}>
                Menu
              </T>
              <chakra.button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                display="inline-flex"
                p="2"
                borderRadius="full"
                border="0"
                bg="transparent"
                color="rgba(0, 0, 0, 0.54)"
                cursor="pointer"
                fontSize="1.5rem"
              >
                <Icon name="close" />
              </chakra.button>
            </Box>
            <Box as="ul" listStyleType="none" m="0" py="2" px="0">
              {nav.map((item) => (
                <Box as="li" key={item.href}>
                  <chakra.a
                    asChild
                    display="flex"
                    alignItems="center"
                    textDecoration="none"
                    py="2"
                    px="4"
                    bg={active(item.href) ? 'primary.light' : 'transparent'}
                    _hover={{bg: 'primary.light'}}
                  >
                    <NextLink href={item.href} onClick={() => setOpen(false)}>
                      <T
                        variant="body1"
                        as="span"
                        my="1"
                        color={active(item.href) ? 'primary' : 'fg'}
                      >
                        {item.label}
                      </T>
                    </NextLink>
                  </chakra.a>
                </Box>
              ))}
              {cta ? (
                <Box as="li" mt="4" py="2" px="4">
                  <Button
                    variant="contained"
                    fullWidth
                    href={cta.href}
                    startIcon={<Icon name="phone" />}
                  >
                    {cta.label}
                  </Button>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  )
}
