'use client'

import {Box} from '@chakra-ui/react'
import {useEditable} from '@platform/builder/editable-context'
import type {Stat, StatsSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Col, Container, Row, T} from '@platform/themes/legal-finance/ui'

export function StatsBand({items, mt, path}: {items: Stat[]; mt?: string; path: string}) {
  const ed = useEditable()
  return (
    <MotionBox
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 0.6, delay: 0.2}}
      mt={mt}
      p="8"
      bg="bg.muted"
      borderRadius="xl"
    >
      <Row gutter={4} textAlign="center">
        {items.map((stat, i) => (
          <Col xs={12} sm={12 / Math.min(Math.max(items.length, 1), 4)} key={stat.label}>
            <T
              variant="h3"
              fontWeight={700}
              color="primary"
              mb="2"
              {...ed(`${path}.${i}.value`, 'line')}
            >
              {stat.value}
            </T>
            <T variant="body1" color="fg.muted" {...ed(`${path}.${i}.label`, 'line')}>
              {stat.label}
            </T>
          </Col>
        ))}
      </Row>
    </MotionBox>
  )
}

export function Stats({component: c}: {component: StatsSection}) {
  return (
    <Box {...frame(c, {bg: 'white'})}>
      <Container>
        <Heading c={c} />
        <StatsBand items={c.items} path="items" />
      </Container>
    </Box>
  )
}
