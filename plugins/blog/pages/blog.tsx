import {Button, HStack, SimpleGrid, Text} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import type {BlogPageProps} from '@platform/core/types/plugins/blog'
import {BlogCard} from '@platform/plugins/blog/BlogCard'
import {getBlogPosts} from '@platform/plugins/blog/data'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({searchParams}: BlogPageProps): Promise<Metadata> {
  const [page, sp] = await Promise.all([getCmsPage('/blog'), searchParams])
  const filtered = Boolean(sp.category || sp.tag || sp.after)
  return {
    title: page?.title || 'Blog',
    description: page?.lede,
    alternates: {canonical: '/blog', types: {'application/rss+xml': '/blog/rss.xml'}},
    ...(filtered ? {robots: {index: false, follow: true}} : {})
  }
}

const query = (q: Record<string, string | undefined>) => {
  const s = new URLSearchParams(
    Object.entries(q).filter((e): e is [string, string] => Boolean(e[1]))
  ).toString()
  return s ? `/blog?${s}` : '/blog'
}

export default async function BlogPage({searchParams}: BlogPageProps) {
  const {category, tag, after} = await searchParams
  const [page, posts] = await Promise.all([
    getCmsPage('/blog'),
    getBlogPosts({category, tag, cursor: after, limit: 12})
  ])
  if (!page) notFound()

  const chip = (label: string, href: string, active: boolean) => (
    <Button
      key={label}
      asChild
      size="sm"
      variant={active ? 'solid' : 'outline'}
      borderRadius="full"
    >
      <SiteLink href={href} _hover={{textDecoration: 'none'}}>
        {label}
      </SiteLink>
    </Button>
  )

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Blog'}]}
        title={page.title}
        lede={page.lede}
        imageUrl={page.imageUrl}
        imageAlt={page.imageAlt}
      />
      <Shell py={{base: '8', md: '10'}}>
        {posts.categories.length > 1 && (
          <HStack as="nav" aria-label="Blog categories" gap="2" wrap="wrap" mb="6">
            {chip('All', '/blog', !category && !tag)}
            {posts.categories.map((c) => chip(c, query({category: c}), c === category))}
          </HStack>
        )}
        {tag && (
          <Text mb="6" color="fg.muted">
            Posts tagged “{tag}” · <SiteLink href="/blog">show all</SiteLink>
          </Text>
        )}
        {posts.items.length ? (
          <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap="5">
            {posts.items.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </SimpleGrid>
        ) : (
          <Text color="fg.muted">No posts here yet. Please check back soon.</Text>
        )}
        <HStack justify="center" gap="3" mt="10">
          {after && (
            <Button asChild variant="outline">
              <SiteLink href={query({category, tag})} _hover={{textDecoration: 'none'}}>
                Newest posts
              </SiteLink>
            </Button>
          )}
          {posts.nextCursor && (
            <Button asChild variant="outline">
              <SiteLink
                href={query({category, tag, after: posts.nextCursor})}
                _hover={{textDecoration: 'none'}}
              >
                Older posts
              </SiteLink>
            </Button>
          )}
        </HStack>
      </Shell>
    </>
  )
}
