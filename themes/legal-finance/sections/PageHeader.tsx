'use client'

import type {PageHeaderSection} from '@platform/core/types/sections'
import {PageHeading} from '@platform/themes/legal-finance/PageHeader'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Container} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

export function PageHeader({component: c}: {component: PageHeaderSection}) {
  return (
    <Box {...frame(c)}>
      <Container>
        <PageHeading data={{title: c.title || '', lede: c.lede || '', ledeWidth: c.ledeWidth}} />
      </Container>
    </Box>
  )
}
