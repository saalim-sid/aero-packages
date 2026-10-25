'use client'

import {useCart} from '@platform/plugins/commerce/client'
import {SiteLink} from '@platform/ui/primitives'
import {ShoppingCart} from 'lucide-react'

export function CartLink() {
  const {cart} = useCart()
  const count = cart?.totals.lines.reduce((n, l) => n + l.qty, 0) || 0
  return (
    <SiteLink href="/cart" display="inline-flex" alignItems="center" gap="2" fontWeight="medium">
      <ShoppingCart size={18} aria-hidden /> Cart{count ? ` (${count})` : ''}
    </SiteLink>
  )
}
