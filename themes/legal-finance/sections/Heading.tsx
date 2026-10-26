'use client'

import type {SectionBase} from '@platform/core/types/sections'
import {FahaaPageHeader} from '@platform/themes/legal-finance/PageHeader'
import {SectionHeading} from '@platform/themes/legal-finance/SectionHeading'

/** Page heading (h1) or section heading (h2); `sub` headings are drawn by each section. */
export function Heading({c, pageMb}: {c: SectionBase; pageMb?: number}) {
  if (!c.title && !c.lede) return null
  if (c.heading === 'page')
    return (
      <FahaaPageHeader
        data={{title: c.title || '', lede: c.lede || '', ledeWidth: c.ledeWidth}}
        mb={pageMb}
      />
    )
  return <SectionHeading title={c.title || ''} lede={c.lede || ''} />
}
