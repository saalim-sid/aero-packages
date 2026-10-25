'use client'

import {CMS_API_URL, cmsFetch} from '@platform/core/cms-auth'
import {useMemberStore} from '@platform/core/member-store'
import type {
  Cart,
  CartState,
  CheckoutResult,
  PaymentStart
} from '@platform/core/types/plugins/commerce'
import {useEffect, useSyncExternalStore} from 'react'

const CART_KEY = 'wt_cart'
const COUNTRY_KEY = 'wt_country'

export async function commerce<T = Record<string, unknown>>(
  path: string,
  method = 'GET',
  body?: unknown
) {
  try {
    const res = await cmsFetch(`${CMS_API_URL}/p/commerce/${path}`, {
      method,
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      ...(body === undefined ? {} : {body: JSON.stringify(body)})
    })
    const data = await res.json().catch(() => ({}))
    return {ok: res.ok && data.success !== false, data: data as T & {error?: string}}
  } catch {
    return {
      ok: false,
      data: {error: 'Could not reach the store. Please try again.'} as T & {error?: string}
    }
  }
}

const read = (key: string) => {
  try {
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}
const savedId = () => read(CART_KEY)
export const savedCountry = () => read(COUNTRY_KEY)
const saveId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(CART_KEY, id)
    else localStorage.removeItem(CART_KEY)
  } catch {
    return
  }
}

let state: CartState = {cart: null, busy: false, error: ''}
const listeners = new Set<() => void>()
const SERVER: CartState = {cart: null, busy: false, error: ''}
const set = (next: Partial<CartState>) => {
  state = {...state, ...next}
  listeners.forEach((l) => l())
}

async function apply(path: string, method: string, body?: Record<string, unknown>) {
  set({busy: true, error: ''})
  const r = await commerce<{cart: Cart | null}>(path, method, body)
  if (r.ok) {
    saveId(r.data.cart?.id || null)
    set({cart: r.data.cart, busy: false})
  } else set({busy: false, error: r.data.error || 'Something went wrong.'})
  return r.ok
}

const withId = (body: Record<string, unknown> = {}) => ({
  ...body,
  cartId: state.cart?.id || savedId() || undefined
})

export const cartActions = {
  load: () => apply(`cart?cartId=${encodeURIComponent(savedId())}`, 'GET'),
  merge: () => apply('cart/merge', 'POST', {guestCartId: savedId()}),
  add: (sku: string, qty = 1) => apply('cart/items', 'POST', withId({sku, qty})),
  setQty: (sku: string, qty: number) =>
    apply(`cart/items/${encodeURIComponent(sku)}`, 'PUT', withId({qty})),
  remove: (sku: string) =>
    apply(
      `cart/items/${encodeURIComponent(sku)}?cartId=${encodeURIComponent(state.cart?.id || '')}`,
      'DELETE',
      withId()
    ),
  update: (patch: Record<string, unknown>) => apply('cart', 'PUT', withId(patch)),
  /** The shopper's country decides which currencies they can pay in; the cart moves to an allowed one. */
  setCountry: (country: string) => {
    try {
      localStorage.setItem(COUNTRY_KEY, country)
    } catch {
      return Promise.resolve(false)
    }
    return state.cart ? apply('cart', 'PUT', withId({country})) : apply('cart', 'POST', {country})
  },
  forget: () => {
    saveId(null)
    set({cart: null})
  }
}

let loadedFor: string | null | undefined
/** The shopper's cart, shared by every store component. Sign-in merges the guest cart; sign-out forgets the member's. */
export function useCart(): CartState {
  const {member, hydrated} = useMemberStore()
  const who = member?.email ?? null
  useEffect(() => {
    if (!hydrated || loadedFor === who) return
    const before = loadedFor
    loadedFor = who
    if (who && savedId()) void cartActions.merge()
    else if (!who && before) {
      cartActions.forget()
      void cartActions.load()
    } else void cartActions.load()
  }, [hydrated, who])
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
    () => SERVER
  )
}

function loadScript(src: string) {
  return new Promise<void>((done, fail) => {
    if (document.querySelector(`script[src="${src}"]`)) return done()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => done()
    s.onerror = () => fail(new Error('Payment page could not load.'))
    document.head.appendChild(s)
  })
}

/** Where a guest's order is shown; the token is kept for this tab and dropped from the address bar there. */
export const orderPage = (orderId: string, token: string) =>
  `/checkout/complete?order=${orderId}&token=${encodeURIComponent(token)}`

/** Sends the shopper on to pay: a gateway page, a gateway widget, or the order page (always the fallback). */
export async function pay(
  result: Pick<CheckoutResult, 'orderId' | 'token'>,
  payment: PaymentStart
) {
  const done = orderPage(result.orderId, result.token)
  try {
    sessionStorage.setItem(
      `wt_order_note_${result.orderId}`,
      payment.kind === 'offline' ? payment.instructions || '' : ''
    )
  } catch {
    // the note is a convenience only
  }
  if (payment.kind === 'redirect' && /^https:\/\//.test(payment.url))
    return window.location.assign(payment.url)
  if (payment.kind !== 'client') return window.location.assign(done)
  const d = payment.data
  try {
    if (d.razorpayOrderId) {
      await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      const Razorpay = (
        window as unknown as {Razorpay: new (o: Record<string, unknown>) => {open: () => void}}
      ).Razorpay
      return new Razorpay({
        key: d.keyId,
        order_id: d.razorpayOrderId,
        amount: d.amount,
        currency: d.currency,
        prefill: {email: d.email},
        handler: () => window.location.assign(done),
        modal: {ondismiss: () => window.location.assign(done)}
      }).open()
    }
    if (d.paymentSessionId) {
      await loadScript('https://sdk.cashfree.com/js/v3/cashfree.js')
      const Cashfree = (
        window as unknown as {
          Cashfree: (o: {mode: string}) => {checkout: (o: Record<string, unknown>) => void}
        }
      ).Cashfree
      return Cashfree({mode: String(d.mode)}).checkout({
        paymentSessionId: d.paymentSessionId,
        redirectTarget: '_self'
      })
    }
  } catch {
    // a blocked payment script still lands the shopper on their order, where they can pay again
  }
  window.location.assign(done)
}
