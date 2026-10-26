'use client'

import {useEditable} from '@platform/builder/editable-context'
import {Card, Col, Row, T} from '@platform/themes/legal-finance/ui'
import type {StepItem} from '@platform/core/types/sections'
import {Box} from '@chakra-ui/react'

export function StepCards({steps, md, path}: {steps: StepItem[]; md?: number; path?: string}) {
  const ed = useEditable()
  const at = (i: number, key: string, kind?: 'line') =>
    path ? ed(`${path}.${i}.${key}`, kind) : {}
  return (
    <Row gutter={3}>
      {steps.map((step, i) => (
        <Col xs={12} sm={6} md={md} key={step.title}>
          <Card h="100%" p="6">
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              boxSize="10"
              borderRadius="full"
              bg="primary"
              color="white"
              fontWeight={700}
              fontFamily="body"
              mb="4"
            >
              {i + 1}
            </Box>
            <T variant="h6" fontWeight={600} mb="2" {...at(i, 'title', 'line')}>
              {step.title}
            </T>
            <T variant="body2" color="fg.muted" lineHeight={1.6} {...at(i, 'body')}>
              {step.body}
            </T>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
