import {Box, Heading, Stack, Text} from '@chakra-ui/react'
import {getCmsPage, getCmsPages} from '@platform/core/cms-client'
import {CmsLayout} from '@platform/ui/cms/CmsPage'
import {GhostButton, JoinButton} from '@platform/ui/Ctas'
import {Eyebrow, Shell, SiteLink} from '@platform/ui/primitives'

export default async function NotFound() {
  const pages = await getCmsPages()
  const slug = ['/404', '/not-found'].find((s) =>
    pages.some((p) => p.slug === s || p.slug === s.slice(1))
  )
  const page = slug ? await getCmsPage(slug) : null

  return (
    <Shell py={{base: '16', md: '24'}}>
      <Stack gap="5" maxW="prose">
        {page?.kicker ? <Eyebrow>{page.kicker}</Eyebrow> : <Eyebrow>404</Eyebrow>}
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="medium"
          fontSize={{base: '3xl', md: '5xl'}}
        >
          {page?.title || 'Page Not Found'}
        </Heading>
        {page?.lede ? (
          <Text color="fg.muted" fontSize="lg" lineHeight="relaxed">
            {page.lede}
          </Text>
        ) : null}

        {page?.joinLabel || (page?.secondaryLabel && page?.secondaryHref) ? (
          <Stack direction={{base: 'column', sm: 'row'}} gap="3" pt="4">
            {page?.joinLabel ? <JoinButton label={page.joinLabel} href="/register" /> : null}
            {page?.secondaryLabel && page?.secondaryHref ? (
              <GhostButton href={page.secondaryHref} label={page.secondaryLabel} />
            ) : null}
          </Stack>
        ) : (
          <Box pt="2">
            <SiteLink href="/" color="brand.fg">
              Return to home
            </SiteLink>
          </Box>
        )}

        {page?.layout?.length ? (
          <Box mt="12">
            <CmsLayout page={page} />
          </Box>
        ) : null}
      </Stack>
    </Shell>
  )
}
