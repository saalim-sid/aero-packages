'use client'

import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react'
import {CMS_API_URL, cmsFetch, postToCms} from '@platform/core/cms-auth'
import {useFormValidation} from '@platform/core/form-validation'
import {useMemberStore} from '@platform/core/member-store'
import type {AnswerResult, ItemType, LearningItem} from '@platform/core/types/plugins/learning-hub'
import {FieldError} from '@platform/ui/forms/FieldError'
import {BookOpen, CheckCircle2, GraduationCap, PlusCircle, Send, XCircle} from 'lucide-react'
import {useCallback, useEffect, useState} from 'react'

const LEARNING_HUB_PATH = '/p/learning-hub'

const PAGE_SIZE = 12
const TYPES: Array<{id: '' | ItemType; label: string}> = [
  {id: '', label: 'Everything'},
  {id: 'quizQuestion', label: 'Quizzes'},
  {id: 'fact', label: 'Facts'},
  {id: 'tip', label: 'Tips'},
  {id: 'quotation', label: 'Quotations'}
]
const TYPE_LABEL: Record<string, string> = {
  quizQuestion: 'Quizzes',
  fact: 'Facts',
  tip: 'Tips',
  quotation: 'Quotations'
}
// Learning Zone topics are snake_case ids; a few read better with '&'.
const TOPIC_LABEL: Record<string, string> = {
  music_entertainment: 'Music & Entertainment',
  art_literature: 'Art & Literature',
  science_nature: 'Science & Nature',
  friendship_peace: 'Friendship & Peace',
  fun_with_numbers: 'Fun with Numbers'
}
const titleCase = (s = '') =>
  TOPIC_LABEL[s] || s.replace(/_/g, ' ').replace(/(^|[\s-])\w/g, (m) => m.toUpperCase())
const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid var(--chakra-colors-border)',
  backgroundColor: 'var(--chakra-colors-bg-canvas)',
  fontSize: 14
} as const

function QuizCard({item}: {item: LearningItem}) {
  const [chosen, setChosen] = useState<number | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const check = async () => {
    if (chosen === null) return
    setBusy(true)
    setError('')
    const res = await postToCms<Omit<AnswerResult, 'chosen'>>(`${LEARNING_HUB_PATH}/answer`, {
      itemId: item._id,
      optionIndex: chosen
    })
    setBusy(false)
    if (res.ok) setResult({...res.data, chosen})
    else setError(res.data.error || 'Could not check the answer. Please try again.')
  }

  return (
    <>
      <Text fontSize="md" mt="3" fontWeight="medium">
        {item.question}
      </Text>
      <Stack as="ol" gap="2" mt="3">
        {(item.options || []).map((opt, i) => {
          const isCorrect = result?.correctIndex === i
          const isWrongPick = Boolean(result && result.chosen === i && !result.correct)
          return (
            <Box as="li" key={i} listStyleType="none">
              <Button
                w="full"
                size="sm"
                justifyContent="flex-start"
                textAlign="left"
                whiteSpace="normal"
                h="auto"
                py="2"
                borderRadius="lg"
                variant={
                  result
                    ? isCorrect || isWrongPick
                      ? 'solid'
                      : 'outline'
                    : chosen === i
                      ? 'subtle'
                      : 'outline'
                }
                colorPalette={
                  result
                    ? isCorrect
                      ? 'green'
                      : isWrongPick
                        ? 'red'
                        : 'gray'
                    : chosen === i
                      ? 'purple'
                      : 'gray'
                }
                onClick={() => !result && setChosen(i)}
                disabled={Boolean(result)}
                aria-pressed={chosen === i}
              >
                <Text as="span" fontWeight={isCorrect ? 'bold' : 'normal'}>
                  {i + 1}. {opt}
                  {isCorrect ? '  ← correct' : ''}
                </Text>
              </Button>
            </Box>
          )
        })}
      </Stack>
      {result ? (
        <Box
          mt="3"
          p="3"
          borderRadius="lg"
          bg={result.correct ? 'green.subtle' : 'red.subtle'}
          color={result.correct ? 'green.fg' : 'red.fg'}
        >
          <HStack gap="2">
            {result.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <Text fontSize="sm" fontWeight="bold">
              {result.correct ? 'Correct!' : 'Not quite.'}
              {result.contributorPoints
                ? ` ${item.submitterName} earned a point for sharing this question.`
                : ''}
            </Text>
          </HStack>
          {result.explanation ? (
            <Text fontSize="sm" mt="1">
              {result.explanation}
            </Text>
          ) : null}
        </Box>
      ) : (
        <HStack mt="3" gap="3">
          <Button
            size="sm"
            bg="brand.solid"
            color="brand.contrast"
            onClick={check}
            disabled={chosen === null}
            loading={busy}
          >
            Check answer
          </Button>
          {error ? (
            <Text fontSize="sm" color="red.fg">
              {error}
            </Text>
          ) : null}
        </HStack>
      )}
    </>
  )
}

function ContributeForm({categories, onDone}: {categories: string[]; onDone: () => void}) {
  const [itemType, setItemType] = useState<ItemType>('quizQuestion')
  const [category, setCategory] = useState(categories[0] || 'general')
  const [text, setText] = useState('')
  const [quoteAuthor, setQuoteAuthor] = useState('')
  const [options, setOptions] = useState(['', '', '', '', ''])
  const [correct, setCorrect] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ok: boolean; text: string} | null>(null)
  const isQuiz = itemType === 'quizQuestion'
  const v = useFormValidation()

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!v.validate(e.currentTarget)) return
    const filled = options.map((o) => o.trim())
    const used = filled.filter(Boolean)
    if (isQuiz && !filled[correct]) {
      setMessage({ok: false, text: 'Mark the option that is correct (it can’t be an empty one).'})
      return
    }
    if (isQuiz && new Set(used.map((o) => o.toLowerCase())).size !== used.length) {
      setMessage({ok: false, text: 'Each option must be different.'})
      return
    }
    setBusy(true)
    setMessage(null)
    const res = await postToCms<{message?: string}>(`${LEARNING_HUB_PATH}/submit`, {
      itemType,
      category,
      title: text.trim().slice(0, 200),
      ...(isQuiz
        ? {
            quizData: {
              question: text.trim(),
              explanation: explanation.trim(),
              options: filled
                .map((t, i) => ({
                  optionId: String.fromCharCode(97 + i),
                  text: t,
                  isCorrect: i === correct
                }))
                .filter((o) => o.text)
            }
          }
        : {
            content: text.trim(),
            ...(itemType === 'quotation' && quoteAuthor.trim()
              ? {quoteAuthor: quoteAuthor.trim()}
              : {})
          })
    })
    setBusy(false)
    if (res.ok) {
      setMessage({
        ok: true,
        text: 'Thank you! Your contribution will appear once it has been reviewed.'
      })
      setText('')
      setOptions(['', '', '', '', ''])
      setExplanation('')
      setTimeout(onDone, 2500)
    } else {
      setMessage({
        ok: false,
        text: res.data.error || 'Your contribution could not be sent. Please try again.'
      })
    }
  }

  return (
    <Box bg="surface" borderWidth="2px" borderColor="brand.solid" borderRadius="2xl" p="6" mb="6">
      <Heading as="h4" size="sm" mb="4">
        Share with the Learning Hub
      </Heading>
      <form {...v.formProps} onSubmit={submit}>
        <Stack gap="4">
          <Flex gap="4" direction={{base: 'column', sm: 'row'}}>
            <Box flex="1">
              <Text asChild display="block" fontSize="xs" fontWeight="semibold" mb="1">
                <label htmlFor="lh-type">What are you sharing?</label>
              </Text>
              <select
                id="lh-type"
                name="itemType"
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ItemType)}
                style={selectStyle}
              >
                <option value="quizQuestion">A quiz question</option>
                <option value="fact">A fact</option>
                <option value="tip">A tip</option>
                <option value="quotation">A quotation</option>
              </select>
            </Box>
            <Box flex="1">
              <Text asChild display="block" fontSize="xs" fontWeight="semibold" mb="1">
                <label htmlFor="lh-category">Category</label>
              </Text>
              <select
                id="lh-category"
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={selectStyle}
              >
                {[...new Set([...categories, 'general'])].map((c) => (
                  <option key={c} value={c}>
                    {titleCase(c)}
                  </option>
                ))}
              </select>
            </Box>
          </Flex>
          <Box>
            <Text asChild display="block" fontSize="xs" fontWeight="semibold" mb="1">
              <label htmlFor="lh-text">{isQuiz ? 'Question' : 'Text'}</label>
            </Text>
            <Textarea
              id="lh-text"
              name="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              required
              minLength={10}
              maxLength={1000}
            />
            <FieldError v={v} name="text" />
          </Box>
          {isQuiz ? (
            <Stack gap="2">
              <Text fontSize="xs" fontWeight="semibold">
                Options (select the correct one)
              </Text>
              {options.map((o, i) => (
                <HStack key={i} gap="2">
                  <Text fontSize="sm" color="fg.muted" w="18px">
                    {i + 1}.
                  </Text>
                  <input
                    type="radio"
                    name="correct"
                    aria-label={`Option ${i + 1} is correct`}
                    checked={correct === i}
                    onChange={() => setCorrect(i)}
                  />
                  <Input
                    size="sm"
                    name={`option-${i}`}
                    aria-label={i < 2 ? `Option ${i + 1}` : `Option ${i + 1} (optional)`}
                    required={i < 2}
                    maxLength={200}
                    value={o}
                    placeholder={i < 2 ? `Option ${i + 1}` : `Option ${i + 1} (optional)`}
                    onChange={(e) =>
                      setOptions(options.map((x, j) => (j === i ? e.target.value : x)))
                    }
                  />
                </HStack>
              ))}
              {options.map((_, i) => (
                <FieldError key={i} v={v} name={`option-${i}`} />
              ))}
              <Input
                size="sm"
                name="explanation"
                aria-label="Explanation (optional)"
                maxLength={500}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Why is it right? Shown after answering (optional)"
              />
            </Stack>
          ) : null}
          {itemType === 'quotation' ? (
            <Input
              size="sm"
              name="quoteAuthor"
              aria-label="Who said it? (optional)"
              maxLength={120}
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
              placeholder="Who said it? (optional)"
            />
          ) : null}
          <HStack justify="flex-end" gap="3">
            <Button size="sm" variant="ghost" onClick={onDone}>
              Cancel
            </Button>
            <Button size="sm" type="submit" bg="brand.solid" color="brand.contrast" loading={busy}>
              <Send size={14} style={{marginRight: 6}} /> Send for review
            </Button>
          </HStack>
          {message ? (
            <Text fontSize="sm" color={message.ok ? 'green.fg' : 'red.fg'}>
              {message.text}
            </Text>
          ) : null}
        </Stack>
      </form>
    </Box>
  )
}

export function CommunityLearningHub() {
  const [items, setItems] = useState<LearningItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [type, setType] = useState<'' | ItemType>('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [cursors, setCursors] = useState<string[]>([''])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showContribute, setShowContribute] = useState(false)
  const signedIn = !!useMemberStore().member

  const cursor = cursors[page - 1] || ''

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({
        ...(cursor ? {cursor} : {}),
        pageSize: String(PAGE_SIZE),
        ...(type ? {type} : {}),
        ...(category ? {category} : {})
      })
      const res = await cmsFetch(`${CMS_API_URL}${LEARNING_HUB_PATH}/items?${qs}`, {
        headers: {Accept: 'application/json'}
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error()
      setItems(data.items || [])
      if (data.total !== undefined) setTotal(data.total || 0)
      const next: string | null = data.nextCursor || null
      setCursors((cur) => (next && cur.length === page ? [...cur, next] : cur))
      setCategories(data.categories || [])
    } catch {
      setError('The Learning Hub could not be loaded. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }, [page, cursor, type, category])

  useEffect(() => {
    load()
  }, [load])

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <Box>
      <Flex
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="2xl"
        p={{base: '5', md: '6'}}
        mb="6"
        gap="4"
        direction={{base: 'column', md: 'row'}}
        justify="space-between"
        align={{base: 'start', md: 'center'}}
      >
        <Stack gap="1">
          <HStack gap="2">
            <GraduationCap size={22} />
            <Heading as="h3" size="md">
              Learning Hub
            </Heading>
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            Quizzes, facts, tips and quotations shared by our community. Answer a question correctly
            and the member who shared it earns a point.
          </Text>
        </Stack>
        {signedIn ? (
          <Button
            size="sm"
            bg="brand.solid"
            color="brand.contrast"
            borderRadius="lg"
            onClick={() => setShowContribute((v) => !v)}
          >
            <PlusCircle size={15} style={{marginRight: 6}} />{' '}
            {showContribute ? 'Close' : 'Share something'}
          </Button>
        ) : null}
      </Flex>

      {showContribute ? (
        <ContributeForm categories={categories} onDone={() => setShowContribute(false)} />
      ) : null}

      <Flex gap="3" mb="5" wrap="wrap" justify="space-between" align="center">
        <HStack gap="2" wrap="wrap">
          {TYPES.map((t) => (
            <Button
              key={t.id || 'all'}
              size="xs"
              borderRadius="full"
              variant={type === t.id ? 'solid' : 'outline'}
              onClick={() => {
                setType(t.id)
                setPage(1)
                setCursors([''])
              }}
            >
              {t.label}
            </Button>
          ))}
        </HStack>
        <Box minW="200px">
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
              setCursors([''])
            }}
            style={{...selectStyle, padding: '4px 8px', fontSize: 13}}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {titleCase(c)}
              </option>
            ))}
          </select>
        </Box>
      </Flex>

      {loading ? (
        <Stack gap="4" aria-busy="true" aria-label="Loading the Learning Hub">
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="5"
            >
              <Skeleton height="14px" width="40%" />
              <SkeletonText mt="4" noOfLines={2} gap="2" />
              <Stack mt="4" gap="2">
                {[0, 1, 2, 3].map((j) => (
                  <Skeleton key={j} height="36px" borderRadius="lg" />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : error ? (
        <Box
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          p="8"
          textAlign="center"
          borderRadius="2xl"
        >
          <Text fontSize="sm">{error}</Text>
          <Button mt="3" size="sm" variant="outline" onClick={load}>
            Try again
          </Button>
        </Box>
      ) : items.length === 0 ? (
        <Box
          bg="surface"
          borderWidth="1px"
          borderColor="border"
          p="8"
          textAlign="center"
          borderRadius="2xl"
        >
          <BookOpen size={32} style={{margin: '0 auto 8px'}} />
          <Text fontSize="sm" fontWeight="bold">
            Nothing here yet
          </Text>
          <Text fontSize="xs" color="fg.muted" mt="1">
            Try another type or category{signedIn ? ', or share the first one' : ''}.
          </Text>
        </Box>
      ) : (
        <Stack gap="4">
          {items.map((item) => (
            <Box
              key={item._id}
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderRadius="xl"
              p="5"
            >
              <Text fontSize="sm" color="fg.muted">
                <Text as="span" fontWeight="bold" color="fg">
                  {TYPE_LABEL[item.itemType]} → {titleCase(item.category)}
                </Text>
                {` · shared by ${item.submitterName}`}
              </Text>
              {item.itemType === 'quizQuestion' ? (
                <QuizCard item={item} />
              ) : (
                <>
                  <Text
                    fontSize="md"
                    mt="3"
                    fontStyle={item.itemType === 'quotation' ? 'italic' : 'normal'}
                  >
                    {item.itemType === 'quotation' ? `“${item.content}”` : item.content}
                  </Text>
                  {item.quoteAuthor ? (
                    <Text fontSize="sm" color="fg.muted" mt="1">
                      — {item.quoteAuthor}
                    </Text>
                  ) : null}
                </>
              )}
            </Box>
          ))}
        </Stack>
      )}

      {!loading && !error && pages > 1 ? (
        <HStack justify="center" gap="3" mt="6">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Badge variant="subtle">
            Page {page} of {pages}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pages || cursors.length <= page}
          >
            Next
          </Button>
        </HStack>
      ) : null}
    </Box>
  )
}
