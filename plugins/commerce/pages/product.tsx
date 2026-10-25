import {Box, HStack, Image, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {resolveCmsImageUrl} from '@platform/core/cms-client'
import type {StoreProductPageProps} from '@platform/core/types/plugins/commerce'
import {AddToCart} from '@platform/plugins/commerce/AddToCart'
import {getStoreProduct} from '@platform/plugins/commerce/api'
import {CartLink} from '@platform/plugins/commerce/CartLink'
import {MarketPicker} from '@platform/plugins/commerce/MarketPicker'
import {PageHero} from '@platform/ui/PageHero'
import {Shell} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Suspense} from 'react'

export async function generateMetadata({params}: StoreProductPageProps): Promise<Metadata> {
  const data = await getStoreProduct((await params).slug)
  if (!data) return {title: 'Product'}
  return {
    title: data.product.title,
    description: data.product.description?.slice(0, 160),
    alternates: {canonical: `/store/${data.product.slug}`}
  }
}

export default async function ProductPage({params, searchParams}: StoreProductPageProps) {
  const [{slug}, {currency}] = await Promise.all([params, searchParams])
  const data = await getStoreProduct(slug, currency)
  if (!data) notFound()
  const {product: p, rating} = data
  const images = p.images.map((i) => resolveCmsImageUrl(i)).filter((x): x is string => !!x)
  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Store', href: '/store'}, {label: p.title}]}
        title={p.title}
      />
      <Shell py={{base: '8', md: '10'}}>
        <SimpleGrid
          columns={{base: 1, md: images.length ? 2 : 1}}
          gap="10"
          maxW={images.length ? undefined : '2xl'}
        >
          {images.length > 0 && (
            <Stack gap="3">
              {images.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={i ? '' : p.title}
                  borderRadius="xl"
                  w="full"
                  objectFit="cover"
                />
              ))}
            </Stack>
          )}
          <Stack gap="5">
            <HStack justify="space-between">
              {rating?.count ? (
                <Text color="fg.muted" fontSize="sm">
                  {'★'.repeat(Math.round(rating.average || 0))} {rating.average} ({rating.count}{' '}
                  reviews)
                </Text>
              ) : (
                <span />
              )}
              <HStack gap="3">
                <Suspense>
                  <MarketPicker />
                </Suspense>
                <CartLink />
              </HStack>
            </HStack>
            <AddToCart product={p} />
            {p.description && <Text whiteSpace="pre-line">{p.description}</Text>}
            {Object.keys(p.attributes).length > 0 && (
              <Box as="dl" fontSize="sm">
                {Object.entries(p.attributes).map(([k, v]) => (
                  <HStack key={k} gap="2">
                    <Text as="dt" fontWeight="medium">
                      {k}
                    </Text>
                    <Text as="dd">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</Text>
                  </HStack>
                ))}
              </Box>
            )}
          </Stack>
        </SimpleGrid>
      </Shell>
    </>
  )
}
