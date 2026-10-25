import {Heading, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {getCmsOrg, getCmsPage} from '@platform/core/cms-client'
import {sectionsFor} from '@platform/core/site-config'
import {ContactForm} from '@platform/ui/forms/ContactForm'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/contact')
  if (!page) return {title: 'Contact'}
  return {title: page.title}
}

export default async function ContactPage() {
  const [page, org, office] = await Promise.all([
    getCmsPage('/contact'),
    getCmsOrg(),
    sectionsFor('contact.office')
  ])

  if (!page || !org) notFound()

  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
      />
      <Shell py="16">
        <SimpleGrid columns={{base: 1, md: 2}} gap="12">
          <Stack gap="5">
            <Heading as="h2" fontFamily="heading" fontWeight="medium" fontSize="3xl">
              The office
            </Heading>
            <Text color="fg.muted">{org.address}</Text>
            <Text>
              Telephone{' '}
              <SiteLink href={`tel:${org.phone.replace(/\s/g, '')}`} color="brand.fg">
                {org.phone}
              </SiteLink>
            </Text>
            <Text>
              Email{' '}
              <SiteLink href={`mailto:${org.email}`} color="brand.fg">
                {org.email}
              </SiteLink>
            </Text>
            {office.map((Section, i) => (
              <Section key={i} />
            ))}
          </Stack>
          <ContactForm />
        </SimpleGrid>
      </Shell>
    </>
  )
}
