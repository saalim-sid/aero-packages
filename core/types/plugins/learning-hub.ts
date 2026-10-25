export type ItemType = 'quizQuestion' | 'fact' | 'tip' | 'quotation'

export interface LearningItem {
  _id: string
  itemType: ItemType
  category: string
  title: string
  question?: string
  options?: string[]
  content?: string
  quoteAuthor?: string
  submitterName: string
}

export interface AnswerResult {
  chosen: number
  correct: boolean
  correctIndex: number
  explanation?: string
  contributorPoints: number
}
