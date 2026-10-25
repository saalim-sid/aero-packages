import type {PlatformPlugin} from '@platform/core/types/platform'

export const learn: PlatformPlugin = {
  id: 'learn',
  accountAction: {href: '/learn/quizzes', labelField: 'quizActionLabel'},
  sitemap: async () => {
    const [{getCmsLibrary, getCmsQuizzes}, {getSlugString}] = await Promise.all([
      import('@platform/plugins/learn/data'),
      import('@platform/core/cms-client')
    ])
    const [library, quizzes] = await Promise.all([getCmsLibrary(), getCmsQuizzes(true)])
    return [
      '/learn',
      '/learn/library',
      '/learn/quizzes',
      ...library.map((l) => `/learn/library/${getSlugString(l.slug)}`),
      ...quizzes.map((q) => `/learn/quiz/${getSlugString(q.slug)}`)
    ]
  }
}
