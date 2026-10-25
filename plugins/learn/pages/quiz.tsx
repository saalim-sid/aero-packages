import {getCmsQuiz} from '@platform/plugins/learn/data'
import {QuizPlayer} from '@platform/plugins/learn/QuizPlayer'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({
  params
}: {
  params: Promise<{slug: string}>
}): Promise<Metadata> {
  const {slug} = await params
  const quiz = await getCmsQuiz(slug)
  if (!quiz) return {title: 'Quiz'}
  return {title: quiz.title}
}

export default async function QuizPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  const quiz = await getCmsQuiz(slug)
  if (!quiz) notFound()
  return (
    <>
      <PageHero kicker={quiz.kicker} title={quiz.title} lede={quiz.blurb} />
      <Shell py="16">
        <QuizPlayer quiz={quiz} />
      </Shell>
    </>
  )
}
