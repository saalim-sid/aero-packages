import type {ReactNode} from 'react'

export interface BlogSummary {
  slug: string
  title: string
  excerpt: string
  coverImage: unknown
  category: string | null
  tags: string[]
  publishedAt: string | null
  date: string | null
  author: string | null
  readingMinutes: number
  href: string | null
}

export interface BlogPost extends BlogSummary {
  body: string
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string | null
}

export interface BlogListPage {
  items: BlogSummary[]
  nextCursor: string | null
  categories: string[]
}

export interface BlogListQuery {
  category?: string
  tag?: string
  cursor?: string
  limit?: number
}

export interface BlogPostPage {
  item: BlogPost
  related: BlogSummary[]
}

export interface BlogCardProps {
  post: BlogSummary
}

export interface BlogPageProps {
  searchParams: Promise<{category?: string; tag?: string; after?: string}>
}

export interface BlogPostPageProps {
  params: Promise<{slug: string}>
}

export interface PostBodyProps {
  body: string
}

export type InlineNode = string | ReactNode
