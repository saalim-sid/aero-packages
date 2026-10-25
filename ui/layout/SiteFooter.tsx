import {Box, Flex, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import type {FooterProps} from '@platform/core/types/platform'
import {Logo} from '@platform/ui/layout/Logo'
import {Shell, SiteLink} from '@platform/ui/primitives'

export function SiteFooter({cmsData, logoAfter}: FooterProps) {
  const org = cmsData?.org
  const footerColumns: Array<{
    title: string
    links: Array<{label: string; href: string}>
  }> = cmsData?.footerColumns || []

  return (
    <Box as="footer" bg="bg.inverse" color="fg.inverse" mt="16">
      <Shell py="16">
        <SimpleGrid columns={{base: 1, md: 2, lg: 4}} gap="10">
          <Stack gap="4">
            <Logo tone="inverse" strapline={org?.logoStrapline} after={logoAfter} />
            {org ? (
              <>
                <Text color="fg.inverse" fontSize="sm" maxW="prose">
                  {org.tagline}
                </Text>
                <Text fontSize="sm" color="fg.inverse.subtle">
                  {org.address}
                  <br />
                  {org.phone}
                  <br />
                  {org.email}
                </Text>
              </>
            ) : null}
          </Stack>
          {footerColumns.map((column) => (
            <Stack key={column.title} gap="3">
              <Text fontFamily="heading" fontSize="lg">
                {column.title}
              </Text>
              {column.links.map((link) => (
                <SiteLink key={link.href} href={link.href} color="fg.inverse.link" fontSize="sm">
                  {link.label}
                </SiteLink>
              ))}
            </Stack>
          ))}
        </SimpleGrid>
        <Box borderTopWidth="1px" borderColor="border.inverse.muted" mt="12" pt="6">
          <Flex
            justify="space-between"
            gap="4"
            direction={{base: 'column', md: 'row'}}
            fontSize="sm"
            color="fg.inverse.subtle"
          >
            {org ? (
              <Text>
                © {org.founded ? `${org.founded}–` : ''}
                {new Date().getFullYear()} {org.name}
              </Text>
            ) : null}
            <SiteLink href="/privacy" color="fg.inverse.link">
              Privacy policy
            </SiteLink>
          </Flex>
        </Box>
      </Shell>
    </Box>
  )
}
