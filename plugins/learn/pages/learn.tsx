import {Box, Heading, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsLibrary, getCmsQuizzes} from '@platform/plugins/learn/data'
import {GhostButton, JoinButton} from '@platform/ui/Ctas'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/learn')
  if (!page) return {title: 'Learn'}
  return {title: page.title}
}

export default async function LearnPage() {
  const [page, quizzes, library] = await Promise.all([
    getCmsPage('/learn'),
    getCmsQuizzes(),
    getCmsLibrary()
  ])

  if (!page) notFound()

  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
        actions={
          <Stack direction={{base: 'column', sm: 'row'}} gap="3">
            <JoinButton />
            <GhostButton
              href={page.secondaryHref || '/learn/quizzes'}
              label={page.secondaryLabel || ''}
            />
          </Stack>
        }
      />
      <Shell py="16">
        <Heading as="h2" fontFamily="heading" fontSize="3xl" fontWeight="medium">
          Quizzes
        </Heading>
        <SimpleGrid columns={{base: 1, md: 3}} gap="4" mt="6">
          {quizzes.map((quiz) => {
            const slug = getSlugString(quiz.slug)
            return (
              <SiteLink key={slug} href={`/learn/quiz/${slug}`} _hover={{textDecoration: 'none'}}>
                <Box
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  p="6"
                  h="full"
                  flex={1}
                >
                  <Text fontSize="sm" color="fg.subtle">
                    {quiz.kicker}
                  </Text>
                  <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="1">
                    {quiz.title}
                  </Heading>
                  <Text mt="2" color="fg.muted" fontSize="sm">
                    {quiz.blurb}
                  </Text>
                </Box>
              </SiteLink>
            )
          })}
        </SimpleGrid>
        <Heading as="h2" fontFamily="heading" fontSize="3xl" fontWeight="medium" mt="16">
          {page.libraryTitle || 'Library'}
        </Heading>
        <SimpleGrid columns={{base: 1, md: 3}} gap="4" mt="6">
          {library.map((section) => {
            const slug = getSlugString(section.slug)
            return (
              <SiteLink
                key={slug}
                href={`/learn/library/${slug}`}
                _hover={{textDecoration: 'none'}}
              >
                <Box
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  borderRadius="xl"
                  p="6"
                  h="full"
                  flex={1}
                >
                  <Heading as="h3" fontFamily="heading" fontSize="xl" fontWeight="medium">
                    {section.title}
                  </Heading>
                  <Text mt="2" color="fg.muted" fontSize="sm">
                    {section.lede}
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
