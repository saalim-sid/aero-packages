'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {SplitSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Button, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'

export function Split({component: c}: {component: SplitSection}) {
  const body = c.body || []
  const ed = useEditable()
  const text = (
    <Col xs={12} md={6}>
      {c.eyebrow ? (
        <T
          variant="caption"
          textTransform="uppercase"
          fontWeight={600}
          color="primary"
          mb="2"
          {...ed('eyebrow', 'line')}
        >
          {c.eyebrow}
        </T>
      ) : null}
      {c.title ? (
        <T variant="h3" fontWeight={600} mb="6" {...ed('title', 'line')}>
          {c.title}
        </T>
      ) : null}
      {body.map((paragraph, i) => (
        <T
          key={paragraph}
          variant="body1"
          color="fg.muted"
          mb={i < body.length - 1 ? '6' : '0'}
          lineHeight={1.8}
          {...ed(`body.${i}`)}
        >
          {paragraph}
        </T>
      ))}
      {c.quote ? (
        <T variant="h6" fontStyle="italic" color="fg.muted" mt="6" lineHeight={1.6}>
          &quot;
          <EditableText field="quote" kind="text">
            {c.quote}
          </EditableText>
          &quot;
        </T>
      ) : null}
      {c.cite ? (
        <T variant="body2" color="fg.subtle" mt="2" {...ed('cite', 'line')}>
          {c.cite}
        </T>
      ) : null}
      {c.bullets?.map((bullet, b) => (
        <Box key={bullet} display="flex" alignItems="flex-start" gap="3" mt="3">
          <Icon name="checkCircle" size="sm" color="success" mt="0.5" />
          <T variant="body1" {...ed(`bullets.${b}`, 'line')}>
            {bullet}
          </T>
        </Box>
      ))}
      {c.cta?.label ? (
        <Button variant="outlined" href={c.cta.href} endIcon={<Icon name="arrowForward" />} mt="6">
          <EditableText field="cta.label">{c.cta.label}</EditableText>
        </Button>
      ) : null}
    </Col>
  )
  const image = c.imageUrl ? (
    <Col xs={12} md={6}>
      <chakra.img
        src={c.imageUrl}
        alt={c.imageAlt || ''}
        w="100%"
        h="auto"
        borderRadius="xl"
        boxShadow="image"
      />
    </Col>
  ) : null

  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          <Row gutter={6} alignItems="center">
            {c.imageSide === 'left' ? image : text}
            {c.imageSide === 'left' ? text : image}
          </Row>
        </MotionBox>
      </Container>
    </Box>
  )
}
