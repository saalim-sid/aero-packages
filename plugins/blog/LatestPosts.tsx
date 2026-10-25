import {Heading, SimpleGrid} from '@chakra-ui/react'
import {BlogCard} from '@platform/plugins/blog/BlogCard'
import {getBlogPosts} from '@platform/plugins/blog/data'

/** The three newest posts, shown under other pages' content (e.g. Events). */
export async function LatestPosts() {
  const posts = await getBlogPosts({limit: 3})
  if (!posts.items.length) return null
  return (
    <>
      <Heading as="h2" fontFamily="heading" fontSize="3xl" fontWeight="medium" mt="16">
        From the desk
      </Heading>
      <SimpleGrid columns={{base: 1, md: 3}} gap="4" mt="6">
        {posts.items.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </SimpleGrid>
    </>
  )
}
