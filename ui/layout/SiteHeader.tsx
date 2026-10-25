'use client'

import {Box, Button, Flex, HStack, IconButton, Input, Stack, Text, VStack} from '@chakra-ui/react'
import {useMemberStore} from '@platform/core/member-store'
import {siteMeta} from '@platform/core/site-meta'
import type {SocialLink} from '@platform/core/types/cms'
import type {HeaderProps} from '@platform/core/types/platform'
import {SocialIcon} from '@platform/ui/icon'
import {Logo} from '@platform/ui/layout/Logo'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {ChevronDown, Menu, Search, User, X} from 'lucide-react'
import {useState} from 'react'

const SOCIAL_LABEL: Record<SocialLink['platform'], string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok'
}

export function SiteHeader({cmsData, searchCx, socialLinks = [], logoAfter}: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const {member, api} = useMemberStore()
  const members = siteMeta.members !== false

  const org = cmsData?.org
  const primaryNav: Array<{
    label: string
    href: string
    children?: Array<{label: string; href: string; hint?: string}>
  }> = cmsData?.primaryNav || []

  const firstName = member?.name?.split(' ')[0] || 'Account'

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="20"
      bg="bg.canvas"
      borderBottomWidth="1px"
      borderColor="border"
    >
      {org ? (
        <Box bg="bg.inverse" color="fg.inverse">
          <Shell>
            <Flex
              justify="space-between"
              align="center"
              gap="4"
              py="2"
              fontSize="sm"
              flexWrap="wrap"
            >
              <HStack as="nav" aria-label="Social media" gap="3" flexWrap="wrap">
                {socialLinks.map((l) => {
                  const label = SOCIAL_LABEL[l.platform]
                  return (
                    <SiteLink
                      key={l.platform}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="fg.inverse"
                      aria-label={`${siteMeta.name} on ${label}`}
                      display="inline-flex"
                      alignItems="center"
                      gap="1.5"
                      _hover={{opacity: 0.8, textDecoration: 'none'}}
                    >
                      <SocialIcon platform={l.platform} size={14} />
                    </SiteLink>
                  )
                })}
              </HStack>
              <HStack gap="4" flexWrap="wrap">
                {searchCx ? (
                  <Box asChild display="flex" alignItems="center">
                    <form role="search" action="/search" method="get">
                      <Input
                        name="q"
                        type="search"
                        size="xs"
                        w={{base: '40', md: '52'}}
                        placeholder="Search the site"
                        aria-label="Search the site"
                        bg="whiteAlpha.200"
                        borderColor="whiteAlpha.400"
                        color="fg.inverse"
                        _placeholder={{color: 'whiteAlpha.700'}}
                      />
                      <IconButton
                        type="submit"
                        aria-label="Search"
                        size="xs"
                        variant="ghost"
                        color="fg.inverse"
                        ml="1"
                      >
                        <Search size={14} />
                      </IconButton>
                    </form>
                  </Box>
                ) : null}
                {org.phone ? (
                  <SiteLink href={org.phoneHref} color="fg.inverse">
                    {org.phone}
                  </SiteLink>
                ) : null}
                {org.email ? (
                  <SiteLink href={`mailto:${org.email}`} color="fg.inverse">
                    {org.email}
                  </SiteLink>
                ) : null}
              </HStack>
            </Flex>
          </Shell>
        </Box>
      ) : null}
      <Shell>
        <Flex align="center" justify="space-between" gap="4" py="4">
          <Logo strapline={org?.logoStrapline} after={logoAfter} />
          <HStack display={{base: 'none', lg: 'flex'}} gap="1" as="nav" aria-label="Primary">
            {primaryNav.map((item) => (
              <Box
                key={item.label}
                position="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
                onFocusCapture={() => setOpenMenu(item.label)}
              >
                <SiteLink
                  href={item.href}
                  px="3"
                  py="2"
                  borderRadius="md"
                  color="fg"
                  fontWeight="medium"
                  fontSize="sm"
                  display="inline-flex"
                  alignItems="center"
                  gap="1"
                  _hover={{bg: 'bg.muted', textDecoration: 'none'}}
                >
                  {item.label}
                  {item.children ? <ChevronDown size={14} /> : null}
                </SiteLink>
                {item.children && openMenu === item.label ? (
                  <Box position="absolute" top="100%" left="0" pt="2" minW="72">
                    <Stack
                      bg="surface"
                      borderWidth="1px"
                      borderColor="border"
                      borderRadius="xl"
                      p="3"
                      shadow="lift"
                      gap="1"
                    >
                      {item.children.map((child) => (
                        <SiteLink
                          key={child.href}
                          href={child.href}
                          px="3"
                          py="2"
                          borderRadius="md"
                          color="fg"
                          _hover={{bg: 'brand.muted', textDecoration: 'none'}}
                        >
                          <Text fontWeight="medium" fontSize="sm">
                            {child.label}
                          </Text>
                          {child.hint ? (
                            <Text fontSize="xs" color="fg.subtle">
                              {child.hint}
                            </Text>
                          ) : null}
                        </SiteLink>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
              </Box>
            ))}
          </HStack>
          <HStack gap="2">
            {!members ? null : member ? (
              <Button
                asChild
                size="sm"
                variant="outline"
                borderColor="border.strong"
                borderRadius="md"
              >
                <SiteLink
                  href="/account"
                  _hover={{textDecoration: 'none'}}
                  display="inline-flex"
                  alignItems="center"
                  gap="1.5"
                >
                  <User size={14} />
                  Hi, {firstName}
                </SiteLink>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  display={{base: 'none', md: 'inline-flex'}}
                  colorPalette="gray"
                >
                  <SiteLink href="/login" _hover={{textDecoration: 'none'}}>
                    Log in
                  </SiteLink>
                </Button>
                <Button asChild size="sm" bg="brand.solid" color="brand.contrast" borderRadius="md">
                  <SiteLink
                    href="/register"
                    color="brand.contrast"
                    _hover={{textDecoration: 'none'}}
                  >
                    Join free
                  </SiteLink>
                </Button>
              </>
            )}
            <IconButton
              aria-label={open ? 'Close menu' : 'Open menu'}
              variant="ghost"
              display={{base: 'inline-flex', lg: 'none'}}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </IconButton>
          </HStack>
        </Flex>
      </Shell>
      {open ? (
        <Box
          display={{lg: 'none'}}
          borderTopWidth="1px"
          borderColor="border"
          bg="surface"
          px="4"
          py="4"
        >
          <VStack align="stretch" gap="3">
            {primaryNav.map((item) => (
              <Box key={item.label}>
                <SiteLink
                  href={item.href}
                  fontWeight="medium"
                  color="fg"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </SiteLink>
                {item.children ? (
                  <VStack align="stretch" pl="4" pt="2" gap="2">
                    {item.children.map((child) => (
                      <SiteLink
                        key={child.href}
                        href={child.href}
                        fontSize="sm"
                        color="fg.muted"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </SiteLink>
                    ))}
                  </VStack>
                ) : null}
              </Box>
            ))}

            {members ? (
              <Box pt="2" borderTopWidth="1px" borderColor="border">
                {member ? (
                  <VStack align="stretch" gap="2">
                    <SiteLink
                      href="/account"
                      fontWeight="medium"
                      color="brand.fg"
                      onClick={() => setOpen(false)}
                    >
                      Account ({member.name})
                    </SiteLink>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      justifyContent="flex-start"
                      p="0"
                      onClick={() => {
                        api.logout()
                        setOpen(false)
                      }}
                    >
                      Log out
                    </Button>
                  </VStack>
                ) : (
                  <HStack gap="2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      flex="1"
                      borderColor="border.strong"
                    >
                      <SiteLink href="/login" onClick={() => setOpen(false)}>
                        Log in
                      </SiteLink>
                    </Button>
                    <Button asChild bg="brand.solid" color="brand.contrast" size="sm" flex="1">
                      <SiteLink
                        href="/register"
                        color="brand.contrast"
                        onClick={() => setOpen(false)}
                      >
                        Join free
                      </SiteLink>
                    </Button>
                  </HStack>
                )}
              </Box>
            ) : null}
          </VStack>
        </Box>
      ) : null}
    </Box>
  )
}
