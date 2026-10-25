export interface CmsLibrarySection {
  slug: string | {current: string}
  title: string
  kicker?: string
  lede: string
  imageUrl?: string
  tips: Array<{title: string; body: string}>
}

export interface CmsQuizQuestion {
  prompt: string
  choices: string[]
  answer: number
  fact: string
}

export interface CmsQuiz {
  slug: string | {current: string}
  title: string
  kicker?: string
  blurb?: string
  questionsPerAttempt?: number
  questions: CmsQuizQuestion[]
  questionsCount?: number
}
