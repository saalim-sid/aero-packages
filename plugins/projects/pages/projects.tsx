import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsProjects} from '@platform/plugins/projects/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/projects')
  if (!page) return {title: 'Projects'}
  return {title: page.title}
}

export default async function ProjectsPage() {
  const [page, projects] = await Promise.all([getCmsPage('/projects'), getCmsProjects()])

  if (!page) notFound()

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
        <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap="4">
          {projects.map((project) => {
            const slug = getSlugString(project.slug)
            return (
              <SiteLink key={slug} href={`/projects/${slug}`} _hover={{textDecoration: 'none'}}>
                <Box
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  p="6"
                  h="full"
                >
                  <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium">
                    {project.title}
                  </Heading>
                  <Text mt="3" color="fg.muted">
                    {project.lede}
                  </Text>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
      </Shell>
    </>
  )
}
