import {Box, Heading, Image, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {BlogCardProps} from '@platform/core/types/plugins/blog'
import {postDate, postHref} from '@platform/plugins/blog/post-utils'
import {SiteLink} from '@platform/ui/primitives'

export function BlogCard({post}: BlogCardProps) {
  const cover = resolveCmsImageUrl(post.coverImage)
  return (
    <SiteLink
      href={postHref(post)}
      _hover={{textDecoration: 'none', borderColor: 'brand.solid'}}
      h="full"
      display="block"
    >
      <Box
        as="article"
        bg="surface"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        overflow="hidden"
        h="full"
      >
        {cover && (
          <Image
            src={cover}
            alt=""
            aspectRatio={16 / 9}
            objectFit="cover"
            w="full"
            loading="lazy"
          />
        )}
        <Box p="5">
          <Text fontSize="sm" color="fg.subtle">
            {[post.category, postDate(post)].filter(Boolean).join(' · ')}
          </Text>
          <Heading as="h2" fontFamily="heading" fontSize="xl" fontWeight="medium" mt="1.5">
            {post.title}
          </Heading>
          {post.excerpt && (
            <Text mt="2" color="fg.muted" lineClamp={3}>
              {post.excerpt}
            </Text>
          )}
          <Text mt="3" fontSize="xs" color="fg.subtle">
            {[post.author, `${post.readingMinutes} min read`].filter(Boolean).join(' · ')}
          </Text>
        </Box>
      </Box>
    </SiteLink>
  )
}
