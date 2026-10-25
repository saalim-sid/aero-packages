import {Box, Heading, Image, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {formatSiteMoney, siteMeta} from '@platform/core/site-meta'
import type {CharityProjectItem} from '@platform/core/types/plugins/charity-registration'
import {getCmsCharityById, getCmsDonations} from '@platform/plugins/charity-registration/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{id: string}>
}): Promise<Metadata> {
  const charity = await getCmsCharityById(decodeURIComponent((await params).id))
  return charity
    ? {title: charity.name, description: charity.summary?.slice(0, 160)}
    : {title: 'Charity not found'}
}

function Items({title, items}: {title: string; items: CharityProjectItem[]}) {
  if (!items.length) return null
  return (
    <Box>
      <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium" mb="4">
        {title}
      </Heading>
      <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap="4">
        {items.map((it, i) => (
          <Box
            key={it._key || i}
            bg="surface"
            borderWidth="1px"
            borderColor="border"
            borderRadius="xl"
            overflow="hidden"
          >
            {it.image?.url ? (
              <Image
                src={`${it.image.url}?w=600&h=340&fit=crop&auto=format`}
                alt={it.image.alt || ''}
                w="full"
              />
            ) : null}
            <Box p="5">
              {it.description ? <Text>{it.description}</Text> : null}
              {it.link ? (
                <SiteLink
                  href={it.link}
                  color="brand.fg"
                  mt="3"
                  display="inline-block"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Find out more
                </SiteLink>
              ) : null}
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default async function CharityProfilePage({params}: {params: Promise<{id: string}>}) {
  const id = decodeURIComponent((await params).id)
  const [charity, donations] = await Promise.all([getCmsCharityById(id), getCmsDonations()])
  if (!charity) notFound()

  const received = donations
    .filter((d) => d.charity?._ref === id)
    .reduce((sum, d) => sum + (Number(d.amountGBP) || 0), 0)
  const logo = charity.logo as {url?: string} | null | undefined
  const projects = (charity.projects as CharityProjectItem[] | undefined) || []
  const campaigns = (charity.campaigns as CharityProjectItem[] | undefined) || []

  return (
    <>
      <PageHero
        kicker={charity.location || 'Charity'}
        title={charity.name}
        lede={charity.summary}
      />
      <Shell py="16">
        <Stack gap="12">
          <Stack direction={{base: 'column', md: 'row'}} gap="8" align={{md: 'center'}}>
            {logo?.url ? (
              <Image
                src={`${logo.url}?w=240&auto=format`}
                alt={`${charity.name} logo`}
                maxW="160px"
              />
            ) : null}
            <Stack gap="2">
              {charity.reg ? <Text>Registration number: {charity.reg}</Text> : null}
              {charity.websiteUrl ? (
                <SiteLink
                  href={charity.websiteUrl}
                  color="brand.fg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit website
                </SiteLink>
              ) : null}
              <Text fontWeight="medium">
                {received
                  ? `${formatSiteMoney(received)} received through ${siteMeta.shortName} so far`
                  : 'No donations received yet'}
              </Text>
              <SiteLink href="/vote" color="brand.fg" fontWeight="medium">
                Vote for {charity.name}
              </SiteLink>
            </Stack>
          </Stack>
          <Items title="Projects" items={projects} />
          <Items title="Campaigns" items={campaigns} />
        </Stack>
      </Shell>
    </>
  )
}
