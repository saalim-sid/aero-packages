import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage, getSlugString} from '@platform/core/cms-client'
import {getCmsQuizzes} from '@platform/plugins/learn/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/learn/quizzes')
  if (!page) return {title: 'Quizzes'}
  return {title: page.title}
}

export default async function QuizzesPage() {
  const [page, quizzes] = await Promise.all([getCmsPage('/learn/quizzes'), getCmsQuizzes()])

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
        <SimpleGrid columns={{base: 1, md: 2}} gap="4">
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
                  flex={1}
                  h="full"
                >
                  <Text fontSize="sm" color="fg.subtle">
                    {quiz.questionsPerAttempt ?? quiz.questionsCount} questions · {quiz.kicker}
                  </Text>
                  <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium" mt="1">
                    {quiz.title}
                  </Heading>
                  <Text mt="2" color="fg.muted">
                    {quiz.blurb}
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
