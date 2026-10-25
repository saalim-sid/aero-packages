'use client'

import {Box, Button, Heading, Stack, Text} from '@chakra-ui/react'
import {postToCms} from '@platform/core/cms-auth'
import {getSlugString} from '@platform/core/cms-client'
import {useMemberStore} from '@platform/core/member-store'
import type {CmsQuiz} from '@platform/core/types/plugins/learn'
import {SiteLink} from '@platform/ui/primitives'
import {useEffect, useState} from 'react'

export function QuizPlayer({quiz}: {quiz: CmsQuiz}) {
  const {member, api} = useMemberStore()
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<{pointsAwarded: number; alreadyCompleted: boolean} | null>(
    null
  )
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const questions = quiz.questions || []
  const [order, setOrder] = useState<number[] | null>(null)
  useEffect(() => {
    const all = (quiz.questions || []).map((_, i) => i)
    const n = quiz.questionsPerAttempt
    if (!n || n >= all.length) return setOrder(all)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[all[i], all[j]] = [all[j], all[i]]
    }
    setOrder(all.slice(0, n))
  }, [quiz.questions, quiz.questionsPerAttempt])
  const total = order?.length ?? 0
  const qIndex = order ? order[index] : -1
  const question = qIndex >= 0 ? questions[qIndex] : undefined
  const prompt = question?.prompt
  const choices = question?.choices || []
  const answer = question?.answer

  function choose(choice: number) {
    if (picked !== null) return
    setPicked(choice)
    setAnswers((prev) => {
      // One slot per question in the quiz; -1 = not asked in this attempt.
      const nextAnswers = prev.length ? [...prev] : questions.map(() => -1)
      nextAnswers[qIndex] = choice
      return nextAnswers
    })
    if (choice === answer) setCorrect((value) => value + 1)
  }

  async function next() {
    if (index + 1 >= total) {
      setDone(true)
      if (!member) return
      // The server re-scores the answers and awards points (once per quiz).
      setSaving(true)
      const res = await postToCms<{
        correct: number
        pointsAwarded: number
        alreadyCompleted: boolean
      }>('/quiz/attempt', {quizSlug: getSlugString(quiz.slug), answers})
      setSaving(false)
      if (!res.ok) {
        setSaveError(res.data.error || 'Your score could not be saved.')
        return
      }
      setCorrect(res.data.correct)
      setResult({
        pointsAwarded: res.data.pointsAwarded,
        alreadyCompleted: res.data.alreadyCompleted
      })
      api.refresh()
      return
    }
    setIndex((value) => value + 1)
    setPicked(null)
  }

  if (done) {
    return (
      <Box bg="surface" borderWidth="1px" borderColor="border" borderRadius="2xl" p="8">
        <Heading as="h2" fontFamily="heading" fontWeight="medium" fontSize="3xl">
          {correct} of {total} correct
        </Heading>
        <Text mt="3" color="fg.muted" role="status">
          {!member
            ? 'Join free to earn points for quizzes.'
            : saving
              ? 'Saving your score…'
              : saveError
                ? saveError
                : result?.alreadyCompleted
                  ? 'You have already earned points for this quiz.'
                  : result && result.pointsAwarded > 0
                    ? `${result.pointsAwarded} points added.`
                    : 'Score saved.'}
        </Text>
        <Stack direction="row" gap="3" mt="6">
          <Button asChild bg="brand.solid" color="brand.contrast">
            <SiteLink
              href="/learn/quizzes"
              color="brand.contrast"
              _hover={{textDecoration: 'none'}}
            >
              More quizzes
            </SiteLink>
          </Button>
          {!member ? (
            <Button asChild variant="outline" borderColor="border.strong">
              <SiteLink href="/register" _hover={{textDecoration: 'none'}}>
                Join free
              </SiteLink>
            </Button>
          ) : null}
        </Stack>
      </Box>
    )
  }

  if (!question) {
    return null
  }

  return (
    <Box
      bg="surface"
      borderWidth="1px"
      borderColor="border"
      borderRadius="2xl"
      p={{base: '6', md: '8'}}
    >
      <Text fontSize="sm" color="fg.subtle">
        Question {index + 1} of {total}
      </Text>
      <Heading
        as="h2"
        fontFamily="heading"
        fontWeight="medium"
        fontSize={{base: 'xl', md: '2xl'}}
        mt="3"
      >
        {prompt}
      </Heading>
      <Stack gap="3" mt="6">
        {choices.map((choice, choiceIndex) => {
          const isPicked = picked === choiceIndex
          const isAnswer = answer === choiceIndex
          const show = picked !== null
          return (
            <Button
              key={choice}
              type="button"
              justifyContent="flex-start"
              h="auto"
              whiteSpace="normal"
              py="4"
              px="4"
              borderWidth="1px"
              borderColor={show && isAnswer ? 'brand.solid' : 'border'}
              bg={show && isAnswer ? 'brand.muted' : isPicked ? 'bg.muted' : 'bg.canvas'}
              color="fg"
              onClick={() => choose(choiceIndex)}
            >
              {choice}
            </Button>
          )
        })}
      </Stack>
      {picked !== null ? (
        <Box mt="6">
          <Text color="fg.muted">{question.fact}</Text>
          <Button mt="4" bg="brand.solid" color="brand.contrast" onClick={next}>
            {index + 1 === total ? 'See score' : 'Next question'}
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}
