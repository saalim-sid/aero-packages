'use client'

import {Button, HStack, Text} from '@chakra-ui/react'
import type {PaginationProps} from '@platform/core/types/ui'

/** Page numbers around the current one: 1 … 4 5 [6] 7 8 … 22 */
function pageList(page: number, pages: number): Array<number | 'gap'> {
  const wanted = new Set([1, pages, page - 2, page - 1, page, page + 1, page + 2])
  const list: Array<number | 'gap'> = []
  let last = 0
  for (let p = 1; p <= pages; p++) {
    if (!wanted.has(p)) continue
    if (p - last > 1) list.push('gap')
    list.push(p)
    last = p
  }
  return list
}

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  disabled,
  label = 'results'
}: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (total <= pageSize) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  return (
    <HStack
      as="nav"
      aria-label={`${label} pages`}
      mt="8"
      gap="2"
      wrap="wrap"
      justify="space-between"
    >
      <Text fontSize="sm" color="fg.muted">
        Showing {from}–{to} of {total}
      </Text>
      <HStack gap="1" wrap="wrap">
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </Button>
        {pageList(page, pages).map((p, i) =>
          p === 'gap' ? (
            <Text key={`gap-${i}`} px="1" color="fg.muted" aria-hidden>
              …
            </Text>
          ) : (
            <Button
              key={p}
              size="sm"
              minW="9"
              variant={p === page ? 'solid' : 'ghost'}
              bg={p === page ? 'brand.solid' : undefined}
              color={p === page ? 'brand.contrast' : undefined}
              aria-current={p === page ? 'page' : undefined}
              aria-label={`Page ${p}`}
              disabled={disabled}
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </HStack>
    </HStack>
  )
}
