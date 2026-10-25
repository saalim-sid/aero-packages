export interface StoreVariant {
  sku: string
  title: string
  price: number
  compareAtPrice: number | null
  available: number | null
}

export interface StoreProduct {
  sku: string | null
  slug: string
  title: string
  description: string | null
  images: unknown[]
  currency: string
  price: number
  compareAtPrice: number | null
  available: number | null
  attributes: Record<string, string | number | boolean>
  categories: Array<{slug: string; title: string}>
  variants: StoreVariant[]
}

export interface StoreCategory {
  slug: string
  title: string
  description: string | null
  image: unknown
  children: StoreCategory[]
}

export interface StoreFacets {
  categories: Array<{slug: string; title: string; count: number}>
  price: {min: number; max: number} | null
  attributes: Record<string, Record<string, number>>
}

export interface StoreProductPage {
  total: number
  page: number
  pages: number
  products: StoreProduct[]
  facets: StoreFacets
}

export interface StoreSearch {
  q?: string
  category?: string
  sort?: string
  page?: string
  currency?: string
  min?: string
  max?: string
  [attr: `attr.${string}`]: string | undefined
}

export interface StorePageProps {
  searchParams: Promise<StoreSearch>
}

export interface StoreProductPageProps {
  params: Promise<{slug: string}>
  searchParams: Promise<{currency?: string}>
}

export interface MarketInfo {
  country: string | null
  currencies: Array<{code: string; name: string}>
  default: string
  countries: Array<{value: string; label: string}>
}

export interface StoreAddress {
  name: string
  company?: string
  line1: string
  line2?: string
  city: string
  region?: string
  postcode?: string
  country: string
  phone?: string
}

export interface CartLine {
  sku: string
  title: string
  variantTitle: string | null
  image: unknown
  qty: number
  unitPrice: number
  compareAt: number | null
  lineTotal: number
  discount: number
  tax: number
  available: number | null
  gift?: boolean
}

export interface CartTotals {
  currency: string
  lines: CartLine[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  pricesIncludeTax: boolean
  shippingOptions: Array<{id: string; label: string; amount: number}>
  shippingRate: {id: string; label: string; amount: number} | null
  promotions: Array<{id: string; title: string; code?: string}>
  problems: string[]
}

export interface Cart {
  id: string
  country: string | null
  currency: string
  coupon: string | null
  email: string | null
  address: StoreAddress | null
  totals: CartTotals
}

export interface CheckoutMethod {
  id: string
  label: string
  offline: boolean
  fee: number
}

export type PaymentStart =
  | {kind: 'redirect'; url: string}
  | {kind: 'client'; data: Record<string, unknown>}
  | {kind: 'offline'; instructions?: string}

export interface CheckoutResult {
  orderId: string
  number: string
  status: string
  token: string
  payment: PaymentStart
}

export interface StoreOrder {
  id: string
  number: string
  email: string
  status: string
  paymentStatus: string
  paymentMethod: string
  currency: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  credit: number
  total: number
  paid: number
  refunded: number
  pricesIncludeTax: boolean
  shippingAddress: StoreAddress | null
  createdAt: string
}

export interface StoreOrderView {
  order: StoreOrder
  items: Array<{
    sku: string
    title: string
    variantTitle: string | null
    qty: number
    unitPrice: number
    total: number
    shipped: number
  }>
  shipments: Array<{
    id: string
    carrier: string | null
    tracking: string | null
    trackingUrl: string | null
    status: string
    createdAt: string
  }>
  invoices: Array<{id: string; number: string; kind: string; amount: number; createdAt: string}>
}

export interface ProductCardProps {
  product: StoreProduct
}

export interface AddToCartProps {
  product: StoreProduct
}

export interface OrderViewProps {
  orderId: string
  token?: string
}

export interface CartState {
  cart: Cart | null
  busy: boolean
  error: string
}

export interface OrderPageProps {
  params: Promise<{id: string}>
}

export interface CompletePageProps {
  searchParams: Promise<{order?: string; token?: string; cancelled?: string}>
}
