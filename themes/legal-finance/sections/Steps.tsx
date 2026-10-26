'use client'

import type {StepsSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {StepCards} from '@platform/themes/legal-finance/StepCards'
import {Container} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

export function Steps({component: c}: {component: StepsSection}) {
  return (
    <Box {...frame(c, {bg: 'bg.muted'})}>
      <Container>
        <Heading c={c} />
        <MotionBox
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
        >
          <StepCards steps={c.items} md={12 / Math.max(c.items.length, 1)} path="items" />
        </MotionBox>
      </Container>
    </Box>
  )
}
