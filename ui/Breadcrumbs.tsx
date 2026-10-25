import {HStack, Text} from '@chakra-ui/react'
import {SITE_URL} from '@platform/core/site'
import type {BreadcrumbsProps} from '@platform/core/types/ui'
import {SiteLink} from '@platform/ui/primitives'
import {ChevronRight, Home} from 'lucide-react'
import {Fragment} from 'react'

export function Breadcrumbs({items, inverse}: BreadcrumbsProps) {
  const trail = [{label: 'Home', href: '/'}, ...items]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? {item: `${SITE_URL}${c.href === '/' ? '' : c.href}`} : {})
    }))
  }
  const muted = inverse ? 'fg.inverse.muted' : 'fg.muted'
  return (
    <HStack as="nav" aria-label="Breadcrumb" gap="1.5" fontSize="sm" color={muted} wrap="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}
      />
      {trail.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <ChevronRight size={14} aria-hidden />}
          {c.href && i < trail.length - 1 ? (
            <SiteLink
              href={c.href}
              color={muted}
              _hover={{color: inverse ? 'fg.inverse' : 'brand.fg'}}
              display="inline-flex"
              alignItems="center"
              gap="1.5"
            >
              {i === 0 && <Home size={14} aria-hidden />}
              {c.label}
            </SiteLink>
          ) : (
            <Text
              as="span"
              aria-current="page"
              color={inverse ? 'fg.inverse' : 'fg'}
              fontWeight="medium"
              lineClamp={1}
            >
              {c.label}
            </Text>
          )}
        </Fragment>
      ))}
    </HStack>
  )
}
