'use client'

import {Box, chakra} from '@chakra-ui/react'
import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {DetailSection} from '@platform/core/types/sections'
import {FaqList} from '@platform/themes/legal-finance/FaqList'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {CtaCard, CtaPanel} from '@platform/themes/legal-finance/sections/Cta'
import {frame, icon} from '@platform/themes/legal-finance/sections/frame'
import {StepCards} from '@platform/themes/legal-finance/StepCards'
import {Card, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import NextLink from 'next/link'

const inView = {
  initial: {opacity: 0, y: 30},
  whileInView: {opacity: 1, y: 0},
  viewport: {once: true},
  transition: {duration: 0.6}
}

export function Detail({component: c}: {component: DetailSection}) {
  const ed = useEditable()
  const overview = c.overview || []
  const checklist = c.checklist || []
  const main = [
    overview.length ? 'overview' : null,
    checklist.length ? 'checklist' : null,
    c.steps?.length ? 'steps' : null,
    c.faqs?.length ? 'faqs' : null
  ].filter(Boolean)
  const gap = (part: string) => (part === main[main.length - 1] ? undefined : '12')

  return (
    <Box {...frame(c)}>
      <Container>
        {c.breadcrumb?.length ? (
          <Box
            as="nav"
            aria-label="Breadcrumb"
            mb="6"
            textStyle="body2"
            fontFamily="body"
            color="fg.muted"
          >
            {c.breadcrumb.map((link, b) => (
              <Box as="span" key={link.href}>
                <chakra.a
                  asChild
                  color="primary"
                  textDecoration="none"
                  _hover={{textDecoration: 'underline'}}
                >
                  <NextLink href={link.href}>
                    <EditableText field={`breadcrumb.${b}.label`}>{link.label}</EditableText>
                  </NextLink>
                </chakra.a>
                <Box as="span" mx="2">
                  /
                </Box>
              </Box>
            ))}
            <Box as="span">{c.title}</Box>
          </Box>
        ) : null}

        <MotionBox
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
          mb="12"
        >
          <Box display="flex" alignItems="center" gap="4" mb="4">
            <Box p="3" borderRadius="lg" bg="primary" color="white">
              <Icon name={icon(c.icon, 'business')} size="lg" />
            </Box>
            <T
              variant="caption"
              textTransform="uppercase"
              fontWeight={600}
              color="primary"
              {...ed('eyebrow', 'line')}
            >
              {c.eyebrow}
            </T>
          </Box>
          <T
            variant="h1"
            fontWeight={700}
            mb="4"
            layerStyle="gradientText"
            {...ed('title', 'line')}
          >
            {c.title}
          </T>
          <T variant="h6" color="fg.muted" maxW="lede.wide" lineHeight={1.6} {...ed('lede')}>
            {c.lede}
          </T>
        </MotionBox>

        <Row gutter={6}>
          <Col xs={12} md={8}>
            {overview.length ? (
              <MotionBox {...inView} mb={gap('overview')}>
                <T variant="h3" fontWeight={600} mb="4" {...ed('overviewTitle', 'line')}>
                  {c.overviewTitle}
                </T>
                {overview.map((paragraph, i) => (
                  <T
                    key={paragraph}
                    variant="body1"
                    color="fg.muted"
                    lineHeight={1.8}
                    mb={i < overview.length - 1 ? '4' : '0'}
                    {...ed(`overview.${i}`)}
                  >
                    {paragraph}
                  </T>
                ))}
              </MotionBox>
            ) : null}

            {checklist.length ? (
              <MotionBox {...inView} mb={gap('checklist')}>
                <T variant="h4" fontWeight={600} mb="6" {...ed('checklistTitle', 'line')}>
                  {c.checklistTitle}
                </T>
                <Card p="6">
                  <Box as="ul" listStyleType="none" m="0" p="0">
                    {checklist.map((item, i) => (
                      <Box
                        as="li"
                        key={item}
                        display="flex"
                        alignItems="flex-start"
                        gap="3"
                        mb={i < checklist.length - 1 ? '3' : '0'}
                      >
                        <Icon name="checkCircle" size="sm" color="success" mt="0.5" />
                        <T variant="body1" color="fg" {...ed(`checklist.${i}`, 'line')}>
                          {item}
                        </T>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </MotionBox>
            ) : null}

            {c.steps?.length ? (
              <MotionBox {...inView} mb={gap('steps')}>
                <T variant="h4" fontWeight={600} mb="6" {...ed('stepsTitle', 'line')}>
                  {c.stepsTitle}
                </T>
                <StepCards steps={c.steps} path="steps" />
              </MotionBox>
            ) : null}

            {c.faqs?.length ? (
              <MotionBox {...inView} mb={gap('faqs')}>
                <T variant="h4" fontWeight={600} mb="6" {...ed('faqTitle', 'line')}>
                  {c.faqTitle}
                </T>
                <FaqList faqs={c.faqs} delay={0} path="faqs" />
              </MotionBox>
            ) : null}
          </Col>

          <Col xs={12} md={4}>
            <Box position={{md: 'sticky'}} top={{md: '24'}}>
              {c.contact?.title ? <CtaCard c={c.contact} path="contact" /> : null}

              {c.related?.length ? (
                <Card p="6">
                  <T variant="h6" fontWeight={600} mb="3" {...ed('relatedTitle', 'line')}>
                    {c.relatedTitle}
                  </T>
                  {c.related.map((link, r) => (
                    <chakra.a
                      key={link.href}
                      asChild
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      py="2"
                      borderTop="1px solid"
                      borderTopColor="border"
                      color="fg"
                      textDecoration="none"
                      textStyle="body2"
                      fontFamily="body"
                      _hover={{color: 'primary'}}
                    >
                      <NextLink href={link.href}>
                        <EditableText field={`related.${r}.label`}>{link.label}</EditableText>
                        <Icon name="arrowForward" size="xs" />
                      </NextLink>
                    </chakra.a>
                  ))}
                </Card>
              ) : null}
            </Box>
          </Col>
        </Row>

        {c.cta?.title ? <CtaPanel c={c.cta} mt="16" path="cta" /> : null}
      </Container>
    </Box>
  )
}
