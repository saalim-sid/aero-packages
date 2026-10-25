import {Button, HStack, Input, NativeSelect, SimpleGrid, Stack, Text} from '@chakra-ui/react'
import {getCmsPage} from '@platform/core/cms-client'
import type {StorePageProps, StoreSearch} from '@platform/core/types/plugins/commerce'
import {getStoreProducts} from '@platform/plugins/commerce/api'
import {CartLink} from '@platform/plugins/commerce/CartLink'
import {MarketPicker} from '@platform/plugins/commerce/MarketPicker'
import {money, toMinor} from '@platform/plugins/commerce/money'
import {ProductCard} from '@platform/plugins/commerce/ProductCard'
import {PageHero} from '@platform/ui/PageHero'
import {Shell, SiteLink} from '@platform/ui/primitives'
import type {Metadata} from 'next'
import {Suspense} from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPage('/store')
  return {title: page?.title || 'Store', description: page?.lede, alternates: {canonical: '/store'}}
}

const href = (s: StoreSearch, patch: Partial<StoreSearch>) => {
  const qs = new URLSearchParams(
    Object.entries({...s, page: undefined, ...patch}).filter(
      (e): e is [string, string] => typeof e[1] === 'string' && e[1] !== ''
    )
  ).toString()
  return qs ? `/store?${qs}` : '/store'
}

export default async function StorePage({searchParams}: StorePageProps) {
  const sp = await searchParams
  const [page, result] = await Promise.all([
    getCmsPage('/store'),
    getStoreProducts({
      ...sp,
      min: sp.min ? String(toMinor(Number(sp.min), sp.currency || 'USD')) : undefined,
      max: sp.max ? String(toMinor(Number(sp.max), sp.currency || 'USD')) : undefined,
      limit: '24'
    } as StoreSearch)
  ])
  const facets = result?.facets
  const currency = result?.products[0]?.currency || sp.currency || 'USD'

  return (
    <>
      <PageHero
        compact
        breadcrumbs={[{label: 'Store'}]}
        title={page?.title || 'Store'}
        lede={page?.lede}
        imageUrl={page?.imageUrl}
      />
      <Shell py={{base: '8', md: '10'}}>
        <Stack gap="6">
          <form action="/store">
            <HStack gap="3" wrap="wrap">
              {sp.category && <input type="hidden" name="category" value={sp.category} />}
              <Input
                name="q"
                defaultValue={sp.q}
                placeholder="Search products"
                aria-label="Search products"
                maxW="sm"
              />
              <Input
                name="min"
                defaultValue={sp.min}
                placeholder="Min price"
                aria-label="Minimum price"
                type="number"
                maxW="40"
              />
              <Input
                name="max"
                defaultValue={sp.max}
                placeholder="Max price"
                aria-label="Maximum price"
                type="number"
                maxW="40"
              />
              <NativeSelect.Root maxW="48">
                <NativeSelect.Field name="sort" aria-label="Sort" defaultValue={sp.sort || ''}>
                  <option value="">Name</option>
                  <option value="price_asc">Price, low to high</option>
                  <option value="price_desc">Price, high to low</option>
                  <option value="newest">Newest</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Button type="submit">Search</Button>
              {sp.currency && <input type="hidden" name="currency" value={sp.currency} />}
              <Suspense>
                <MarketPicker />
              </Suspense>
              <CartLink />
            </HStack>
          </form>

          {facets?.categories.length ? (
            <HStack as="nav" aria-label="Categories" gap="2" wrap="wrap">
              <Button
                asChild
                size="sm"
                borderRadius="full"
                variant={sp.category ? 'outline' : 'solid'}
              >
                <SiteLink href={href(sp, {category: undefined})} _hover={{textDecoration: 'none'}}>
                  All
                </SiteLink>
              </Button>
              {facets.categories.map((c) => (
                <Button
                  key={c.slug}
                  asChild
                  size="sm"
                  borderRadius="full"
                  variant={sp.category === c.slug ? 'solid' : 'outline'}
                >
                  <SiteLink href={href(sp, {category: c.slug})} _hover={{textDecoration: 'none'}}>
                    {c.title} ({c.count})
                  </SiteLink>
                </Button>
              ))}
            </HStack>
          ) : null}

          {facets && Object.keys(facets.attributes).length > 0 && (
            <HStack gap="4" wrap="wrap" fontSize="sm">
              {Object.entries(facets.attributes).map(([key, values]) => (
                <HStack key={key} gap="2" wrap="wrap">
                  <Text fontWeight="medium">{key}:</Text>
                  {Object.entries(values).map(([v, n]) => (
                    <SiteLink
                      key={v}
                      href={href(sp, {[`attr.${key}`]: sp[`attr.${key}`] === v ? undefined : v})}
                      fontWeight={sp[`attr.${key}`] === v ? 'semibold' : 'normal'}
                    >
                      {v} ({n})
                    </SiteLink>
                  ))}
                </HStack>
              ))}
            </HStack>
          )}

          {!result ? (
            <Text color="fg.muted">
              The store is not available right now. Please try again soon.
            </Text>
          ) : result.products.length ? (
            <>
              {facets?.price && (
                <Text fontSize="sm" color="fg.muted">
                  {result.total} {result.total === 1 ? 'product' : 'products'} ·{' '}
                  {money(facets.price.min, currency)} to {money(facets.price.max, currency)}
                </Text>
              )}
              <SimpleGrid columns={{base: 1, sm: 2, lg: 4}} gap="5">
                {result.products.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </SimpleGrid>
              {result.pages > 1 && (
                <HStack justify="center" gap="4">
                  {result.page > 1 && (
                    <SiteLink
                      href={`${href(sp, {})}${href(sp, {}).includes('?') ? '&' : '?'}page=${result.page - 1}`}
                    >
                      Previous
                    </SiteLink>
                  )}
                  <Text fontSize="sm">
                    Page {result.page} of {result.pages}
                  </Text>
                  {result.page < result.pages && (
                    <SiteLink
                      href={`${href(sp, {})}${href(sp, {}).includes('?') ? '&' : '?'}page=${result.page + 1}`}
                    >
                      Next
                    </SiteLink>
                  )}
                </HStack>
              )}
            </>
          ) : (
            <Text color="fg.muted">No products match. Try another search.</Text>
          )}
        </Stack>
      </Shell>
    </>
  )
}
