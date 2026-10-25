import {Badge, Box, Button, Flex, Heading, HStack, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import {SITE_URL} from '@platform/core/site'
import type {BlogPostPageProps} from '@platform/core/types/plugins/blog'
import {BlogCard} from '@platform/plugins/blog/BlogCard'
import {getBlogPost} from '@platform/plugins/blog/data'
import {postDate} from '@platform/plugins/blog/post-utils'
import {PostBody} from '@platform/plugins/blog/PostBody'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import {ArrowRight} from 'lucide-react'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

const absolute = (url?: string) => (url && url.startsWith('/') ? `${SITE_URL}${url}` : url)

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
  const found = await getBlogPost((await params).slug)
  if (!found) return {title: 'Post not found'}
  const p = found.item
  const description = p.seoDescription || p.excerpt || undefined
  const image = absolute(resolveCmsImageUrl(p.coverImage))
  return {
    title: p.seoTitle || p.title,
    description,
    alternates: {canonical: `/blog/${p.slug}`},
    openGraph: {
      type: 'article',
      title: p.seoTitle || p.title,
      description,
      url: `/blog/${p.slug}`,
      ...(p.publishedAt ? {publishedTime: p.publishedAt} : {}),
      ...(p.updatedAt ? {modifiedTime: p.updatedAt} : {}),
      ...(p.author ? {authors: [p.author]} : {}),
      ...(p.tags.length ? {tags: p.tags} : {}),
      ...(image ? {images: [image]} : {})
    },
    twitter: {card: image ? 'summary_large_image' : 'summary'}
  }
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
  const found = await getBlogPost((await params).slug)
  if (!found) notFound()
  const {item: post, related} = found
  const hasArticle = Boolean(post.body.trim()) && post.body.trim() !== post.excerpt.trim()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    ...(post.publishedAt ? {datePublished: post.publishedAt} : {}),
    ...(post.updatedAt ? {dateModified: post.updatedAt} : {}),
    ...(post.author ? {author: {'@type': 'Person', name: post.author}} : {}),
    ...(resolveCmsImageUrl(post.coverImage)
      ? {image: absolute(resolveCmsImageUrl(post.coverImage))}
      : {}),
    ...(post.tags.length ? {keywords: post.tags.join(', ')} : {})
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
      <PageHero
        compact
        breadcrumbs={[{label: 'Blog', href: '/blog'}, {label: post.title}]}
        title={post.title}
        lede={post.excerpt}
        imageUrl={resolveCmsImageUrl(post.coverImage)}
        imageAlt=""
        actions={
          <HStack gap="2" wrap="wrap" fontSize="sm" color="fg.subtle">
            {post.category && (
              <Badge variant="subtle" colorPalette="green" borderRadius="full" px="2.5">
                {post.category}
              </Badge>
            )}
            {[postDate(post), post.author && `By ${post.author}`, `${post.readingMinutes} min read`]
              .filter(Boolean)
              .map((m, i) => (
                <Text as="span" key={i}>
                  {i > 0 && (
                    <Text as="span" aria-hidden me="2">
                      ·
                    </Text>
                  )}
                  {m}
                </Text>
              ))}
          </HStack>
        }
      />
      <Shell py={{base: '8', md: '10'}}>
        <Stack as="article" gap="8">
          {hasArticle && <PostBody body={post.body} />}
          {post.href && (
            <Flex
              align={{base: 'flex-start', sm: 'center'}}
              justify="space-between"
              direction={{base: 'column', sm: 'row'}}
              gap="4"
              bg="surface"
              borderWidth="1px"
              borderColor="border"
              borderStartWidth="4px"
              borderStartColor="brand.solid"
              borderRadius="xl"
              p="5"
            >
              <Box>
                <Text fontWeight="medium">Want to know more?</Text>
                <Text fontSize="sm" color="fg.muted">
                  The full details are on their own page.
                </Text>
              </Box>
              <Button asChild bg="brand.solid" color="brand.contrast" flexShrink={0}>
                <SiteLink href={post.href} _hover={{textDecoration: 'none'}}>
                  Find out more <ArrowRight size={16} aria-hidden />
                </SiteLink>
              </Button>
            </Flex>
          )}
          {post.tags.length > 0 && (
            <HStack gap="2" wrap="wrap" aria-label="Tags">
              {post.tags.map((t) => (
                <Button key={t} asChild size="xs" variant="outline" borderRadius="full">
                  <SiteLink
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    _hover={{textDecoration: 'none'}}
                  >
                    #{t}
                  </SiteLink>
                </Button>
              ))}
            </HStack>
          )}
        </Stack>
        {related.length > 0 && (
          <Box as="aside" mt="12" pt="10" borderTopWidth="1px" borderColor="border">
            <Heading as="h2" fontFamily="heading" fontSize="2xl" fontWeight="medium" mb="6">
              More in {post.category}
            </Heading>
            <SimpleGrid columns={{base: 1, md: 3}} gap="5">
              {related.map((r) => (
                <BlogCard key={r.slug} post={r} />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Shell>
    </>
  )
}
