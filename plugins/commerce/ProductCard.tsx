import {Box, Heading, HStack, Image, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {ProductCardProps} from '@platform/core/types/plugins/commerce'
import {money} from '@platform/plugins/commerce/money'
import {SiteLink} from '@platform/ui/primitives'

export function ProductCard({product: p}: ProductCardProps) {
  const img = resolveCmsImageUrl(p.images[0])
  const from = p.variants.length ? Math.min(...p.variants.map((v) => v.price)) : p.price
  return (
    <SiteLink
      href={`/store/${p.slug}?currency=${p.currency}`}
      display="block"
      h="full"
      _hover={{textDecoration: 'none', borderColor: 'brand.solid'}}
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
        {img && (
          <Image src={img} alt="" aspectRatio={4 / 3} objectFit="cover" w="full" loading="lazy" />
        )}
        <Box p="4">
          <Heading as="h2" fontFamily="heading" fontSize="lg" fontWeight="medium">
            {p.title}
          </Heading>
          <HStack mt="2" gap="2">
            <Text fontWeight="semibold">
              {p.variants.length > 1 ? 'From ' : ''}
              {money(from, p.currency)}
            </Text>
            {p.compareAtPrice != null && p.compareAtPrice > p.price && (
              <Text color="fg.muted" textDecoration="line-through" fontSize="sm">
                {money(p.compareAtPrice, p.currency)}
              </Text>
            )}
          </HStack>
          {p.available === 0 && (
            <Text fontSize="sm" color="fg.muted" mt="1">
              Out of stock
            </Text>
          )}
        </Box>
      </Box>
    </SiteLink>
  )
}
