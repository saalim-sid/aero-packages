'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {FeatureItem, FeaturesSection} from '@platform/core/types/sections'
import {MotionBox, MotionCard} from '@platform/themes/legal-finance/motion'
import {frame, icon} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Button, Card, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'
import NextLink from 'next/link'

const inView = {
  initial: {opacity: 0, y: 30},
  whileInView: {opacity: 1, y: 0},
  transition: {duration: 0.6}
}

function IconRow({items, path}: {items: FeatureItem[]; path: string}) {
  const ed = useEditable()
  return (
    <Row gutter={4}>
      {items.map((item, i) => (
        <Col xs={12} md={4} key={item.title}>
          <Box textAlign="center" p="6">
            <Box display="inline-flex" p="4" borderRadius="full" bg="primary" color="white" mb="4">
              <Icon name={icon(item.icon, 'checkCircle')} />
            </Box>
            <T variant="h6" fontWeight={600} mb="2" {...ed(`${path}.${i}.title`, 'line')}>
              {item.title}
            </T>
            <T variant="body2" color="fg.muted" {...ed(`${path}.${i}.body`)}>
              {item.body}
            </T>
          </Box>
        </Col>
      ))}
    </Row>
  )
}

function Cards({c}: {c: FeaturesSection}) {
  const ed = useEditable()
  const more = Boolean(c.highlights?.items.length || c.cta?.title)
  return (
    <Box {...frame(c, {bg: 'bg.muted'})}>
      <Container>
        <Heading c={c} />
        <Row gutter={4} mb={more ? '16' : undefined}>
          {c.items.map((item, index) => {
            const color = item.tone || 'primary'
            return (
              <Col xs={12} md={4} key={item.title}>
                <MotionCard
                  initial={{opacity: 0, y: 50}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: index * 0.2}}
                  whileHover={{y: -8, transition: {duration: 0.2}}}
                  h="100%"
                  display="flex"
                  flexDirection="column"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    w: '100%',
                    h: '1',
                    bgImage: `linear-gradient(90deg, {colors.${color}}, {colors.primary})`
                  }}
                >
                  <Box flexGrow={1} p="6">
                    <Box display="flex" alignItems="center" mb="4">
                      <Box p="3" borderRadius="lg" bg={`${color}/8.24`} color={color} mr="4">
                        <Icon name={icon(item.icon, 'checkCircle')} size="lg" />
                      </Box>
                      <T
                        variant="h5"
                        as="h3"
                        fontWeight={600}
                        {...ed(`items.${index}.title`, 'line')}
                      >
                        {item.title}
                      </T>
                    </Box>
                    <T
                      variant="body1"
                      color="fg.muted"
                      mb="6"
                      lineHeight={1.6}
                      {...ed(`items.${index}.body`)}
                    >
                      {item.body}
                    </T>
                    <Box as="ul" pl="0" listStyleType="none" m="0">
                      {item.bullets?.map((bullet, b) => (
                        <Box
                          as="li"
                          key={bullet}
                          display="flex"
                          alignItems="center"
                          mb="2"
                          _before={{content: '"✓"', color, fontWeight: 'bold', mr: '2'}}
                        >
                          <T
                            variant="body2"
                            color="fg.muted"
                            {...ed(`items.${index}.bullets.${b}`, 'line')}
                          >
                            {bullet}
                          </T>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {item.href ? (
                    <Box display="flex" alignItems="center" p="6" pt="0">
                      <Button
                        href={item.href}
                        endIcon={<Icon name="arrowForward" />}
                        color={color}
                        fontWeight={600}
                        _hover={{bg: `${color}/6.27`}}
                      >
                        <EditableText
                          field={item.linkLabel ? `items.${index}.linkLabel` : 'linkLabel'}
                        >
                          {item.linkLabel || c.linkLabel}
                        </EditableText>
                      </Button>
                    </Box>
                  ) : null}
                </MotionCard>
              </Col>
            )
          })}
        </Row>

        {c.highlights?.items.length ? (
          <MotionBox
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
          >
            <T
              variant="h4"
              as="h3"
              textAlign="center"
              fontWeight={600}
              mb="8"
              {...ed('highlights.title', 'line')}
            >
              {c.highlights.title}
            </T>
            <IconRow items={c.highlights.items} path="highlights.items" />
          </MotionBox>
        ) : null}

        {c.cta?.title ? (
          <MotionBox
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.4}}
            textAlign="center"
            mt="12"
            p="8"
            bg="white"
            borderRadius="xl"
            boxShadow="panel"
          >
            <T variant="h5" fontWeight={600} mb="4" {...ed('cta.title', 'line')}>
              {c.cta.title}
            </T>
            <T variant="body1" color="fg.muted" mb="6" {...ed('cta.body')}>
              {c.cta.body}
            </T>
            {c.cta.primary?.label ? (
              <Button
                variant="contained"
                size="large"
                href={c.cta.primary.href}
                px="8"
                py="3"
                fontSize="1.1rem"
                fontWeight={600}
              >
                <EditableText field="cta.primary.label">{c.cta.primary.label}</EditableText>
              </Button>
            ) : null}
          </MotionBox>
        ) : null}
      </Container>
    </Box>
  )
}

function Compact({c}: {c: FeaturesSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c, {bg: 'white'})}>
      <Container>
        <Heading c={c} />
        <Row gutter={3}>
          {c.items.map((item, i) => (
            <Col xs={6} md={12 / 5} key={item.href || item.title}>
              <MotionBox
                h="100%"
                initial={{opacity: 0, y: 30}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: (i % 5) * 0.08}}
              >
                <Card
                  asChild
                  h="100%"
                  p={{base: '4', sm: '6'}}
                  display="flex"
                  flexDirection="column"
                  textDecoration="none"
                  _hover={{'& [data-more]': {gap: '2'}}}
                >
                  <NextLink href={item.href || '#'}>
                    <Box
                      display="inline-flex"
                      alignSelf="flex-start"
                      p="3"
                      mb="4"
                      borderRadius="lg"
                      bg="primary/10"
                      color="primary"
                    >
                      <Icon name={icon(item.icon, 'checkCircle')} />
                    </Box>
                    <T variant="h6" fontWeight={600} mb="2" {...ed(`items.${i}.title`, 'line')}>
                      {item.title}
                    </T>
                    <T
                      variant="body2"
                      color="fg.muted"
                      lineHeight={1.6}
                      mb="4"
                      flexGrow={1}
                      {...ed(`items.${i}.body`)}
                    >
                      {item.body}
                    </T>
                    <Box
                      data-more=""
                      display="inline-flex"
                      alignItems="center"
                      gap="1"
                      color="primary"
                      fontWeight={600}
                      textStyle="body2"
                      fontFamily="body"
                      transitionProperty="gap"
                      transitionDuration="200ms"
                    >
                      <EditableText field={item.linkLabel ? `items.${i}.linkLabel` : 'linkLabel'}>
                        {item.linkLabel || c.linkLabel}
                      </EditableText>
                      <Icon name="arrowForward" size="xs" />
                    </Box>
                  </NextLink>
                </Card>
              </MotionBox>
            </Col>
          ))}
        </Row>
      </Container>
    </Box>
  )
}

function SubTitle({c}: {c: FeaturesSection}) {
  const ed = useEditable()
  return c.heading === 'sub' ? (
    <T variant="h3" fontWeight={600} textAlign="center" mb="12" {...ed('title', 'line')}>
      {c.title}
    </T>
  ) : (
    <Heading c={c} />
  )
}

function Centered({c}: {c: FeaturesSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox {...inView}>
          <SubTitle c={c} />
          <Row gutter={4}>
            {c.items.map((item, i) => (
              <Col xs={12} md={4} key={item.title}>
                <Card h="100%" textAlign="center" p="6">
                  <T
                    variant="h5"
                    fontWeight={600}
                    mb="4"
                    color="primary"
                    {...ed(`items.${i}.title`, 'line')}
                  >
                    {item.title}
                  </T>
                  <T variant="body1" color="fg.muted" lineHeight={1.6} {...ed(`items.${i}.body`)}>
                    {item.body}
                  </T>
                </Card>
              </Col>
            ))}
          </Row>
        </MotionBox>
      </Container>
    </Box>
  )
}

function Icons({c}: {c: FeaturesSection}) {
  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox {...inView}>
          <SubTitle c={c} />
          <IconRow items={c.items} path="items" />
        </MotionBox>
      </Container>
    </Box>
  )
}

function List({c, numbered}: {c: FeaturesSection; numbered?: boolean}) {
  const ed = useEditable()
  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox {...inView}>
          <SubTitle c={c} />
          <Row gutter={4}>
            {c.items.map((item, i) => (
              <Col xs={12} md={numbered ? 4 : 6} key={item.title}>
                <Card h="100%" p="6">
                  <Box display="flex" alignItems="flex-start" gap="3">
                    {numbered ? (
                      <T variant="h4" fontWeight={700} color="primary">
                        {item.number || String(i + 1).padStart(2, '0')}
                      </T>
                    ) : (
                      <Icon
                        name={icon(item.icon, 'checkCircle')}
                        size="sm"
                        color="success"
                        mt="0.5"
                      />
                    )}
                    <Box>
                      <T variant="h6" fontWeight={600} mb="2" {...ed(`items.${i}.title`, 'line')}>
                        {item.title}
                      </T>
                      <T
                        variant="body2"
                        color="fg.muted"
                        lineHeight={1.6}
                        {...ed(`items.${i}.body`)}
                      >
                        {item.body}
                      </T>
                      {item.href ? (
                        <Box
                          asChild
                          display="inline-flex"
                          alignItems="center"
                          gap="1"
                          mt="3"
                          color="primary"
                          fontWeight={600}
                          textStyle="body2"
                          fontFamily="body"
                        >
                          <NextLink href={item.href}>
                            <EditableText
                              field={item.linkLabel ? `items.${i}.linkLabel` : 'linkLabel'}
                            >
                              {item.linkLabel || c.linkLabel}
                            </EditableText>
                            <Icon name="arrowForward" size="xs" />
                          </NextLink>
                        </Box>
                      ) : null}
                    </Box>
                  </Box>
                </Card>
              </Col>
            ))}
          </Row>
        </MotionBox>
      </Container>
    </Box>
  )
}

export function Features({component: c}: {component: FeaturesSection}) {
  switch (c.variant) {
    case 'compact':
      return <Compact c={c} />
    case 'centered':
      return <Centered c={c} />
    case 'icons':
      return <Icons c={c} />
    case 'list':
      return <List c={c} />
    case 'numbered':
      return <List c={c} numbered />
    default:
      return <Cards c={c} />
  }
}
