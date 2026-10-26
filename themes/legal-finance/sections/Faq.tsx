'use client'

import {EditableText} from '@platform/builder/Editable'
import type {FaqSection} from '@platform/core/types/sections'
import {FaqList} from '@platform/themes/legal-finance/FaqList'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Button, Container, Icon} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

export function Faq({component: c}: {component: FaqSection}) {
  return (
    <Box {...frame(c, {bg: 'bg.muted'})}>
      <Container size="md">
        <Heading c={c} />
        <FaqList faqs={c.items} delay={0} path="items" />
        {c.cta?.label ? (
          <Box textAlign="center" mt="8">
            <Button
              variant="outlined"
              size="large"
              href={c.cta.href}
              endIcon={<Icon name="arrowForward" />}
            >
              <EditableText field="cta.label">{c.cta.label}</EditableText>
            </Button>
          </Box>
        ) : null}
      </Container>
    </Box>
  )
}
