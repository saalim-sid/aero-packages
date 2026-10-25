import {
  getCmsCollection,
  getCmsCollectionItem,
  getCmsCollectionPage
} from '@platform/core/cms-client'
import type {CmsLibrarySection, CmsQuiz} from '@platform/core/types/plugins/learn'

export const getCmsLibrary = () => getCmsCollection<CmsLibrarySection>('librarySection')

export const getCmsLibrarySection = (slug: string) =>
  getCmsCollectionItem<CmsLibrarySection>('librarySection', slug)

export const getCmsQuizzes = (all = false) =>
  all
    ? getCmsCollection<CmsQuiz>('quiz', {omit: ['questions']})
    : getCmsCollectionPage<CmsQuiz>('quiz', {omit: ['questions'], limit: 100}).then(
        (page) => page.items
      )
export const getCmsQuiz = (slug: string) => getCmsCollectionItem<CmsQuiz>('quiz', slug)
