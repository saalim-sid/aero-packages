import {cmsGetJson} from '@platform/core/cms-client'
import type {
  StoreCategory,
  StoreProduct,
  StoreProductPage,
  StoreSearch
} from '@platform/core/types/plugins/commerce'

const NEXT = {revalidate: 60, tags: ['cms', 'cms:collection:product']}

export async function getStoreProducts(search: StoreSearch): Promise<StoreProductPage | null> {
  const qs = new URLSearchParams(
    Object.entries(search).filter(
      (e): e is [string, string] => typeof e[1] === 'string' && e[1] !== ''
    )
  )
  return (await cmsGetJson<StoreProductPage>(`/p/commerce/catalog/products?${qs}`, NEXT)).data
}

export async function getStoreProduct(slug: string, currency?: string) {
  const qs = currency ? `?currency=${encodeURIComponent(currency)}` : ''
  return (
    await cmsGetJson<{
      product: StoreProduct
      rating: {count: number; average: number | null} | null
    }>(`/p/commerce/catalog/products/${encodeURIComponent(slug)}${qs}`, NEXT)
  ).data
}

export async function getStoreCategories(): Promise<StoreCategory[]> {
  return (
    (await cmsGetJson<{categories: StoreCategory[]}>('/p/commerce/catalog/categories', NEXT)).data
      ?.categories || []
  )
}
