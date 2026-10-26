'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {TestimonialsSection} from '@platform/core/types/sections'
import {Avatar} from '@platform/themes/legal-finance/Avatar'
import {MotionCard} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {StatsBand} from '@platform/themes/legal-finance/sections/Stats'
import {Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'
import {AnimatePresence} from 'framer-motion'
import {useState, useSyncExternalStore} from 'react'

const MOBILE = '(max-width: 899.95px)'
const subscribe = (fn: () => void) => {
  const m = window.matchMedia(MOBILE)
  m.addEventListener('change', fn)
  return () => m.removeEventListener('change', fn)
}

const navButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: '2',
  border: '0',
  borderRadius: 'full',
  bg: 'primary',
  color: 'white',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {bg: 'primary.dark'}
} as const

export function Testimonials({component: c}: {component: TestimonialsSection}) {
  const items = c.items || []
  const ed = useEditable()
  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE).matches,
    () => false
  )
  const [current, setCurrent] = useState(0)

  const visible = isMobile ? 1 : 2
  const shown = items.slice(current, current + visible)
  if (shown.length < visible) shown.push(...items.slice(0, visible - shown.length))

  return (
    <Box {...frame(c, {bg: 'white'})}>
      <Container>
        <Heading c={c} />

        <Box position="relative">
          <Box display="flex" justifyContent="center" gap="4" mb="8">
            <chakra.button
              aria-label="Previous"
              {...navButton}
              onClick={() => setCurrent((i) => (i - 1 + items.length) % items.length)}
            >
              <Icon name="arrowBackIos" />
            </chakra.button>
            <chakra.button
              aria-label="Next"
              {...navButton}
              onClick={() => setCurrent((i) => (i + 1) % items.length)}
            >
              <Icon name="arrowForwardIos" />
            </chakra.button>
          </Box>

          <AnimatePresence mode="wait">
            <Row gutter={4} key={current}>
              {shown.map((t, index) => {
                const at = (key: string, kind?: 'line') =>
                  ed(`items.${(current + index) % items.length}.${key}`, kind)
                return (
                  <Col xs={12} md={6} key={`${t.name}-${index}`}>
                    <MotionCard
                      initial={{opacity: 0, x: 50}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: -50}}
                      transition={{duration: 0.5, delay: index * 0.1}}
                      h="100%"
                      position="relative"
                      overflow="visible"
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: '-2.5',
                        left: '5',
                        boxSize: '10',
                        bg: 'primary',
                        borderRadius: 'full',
                        zIndex: 1
                      }}
                    >
                      <Icon
                        name="formatQuote"
                        position="absolute"
                        top="-1.25"
                        left="8"
                        color="white"
                        zIndex={2}
                      />
                      <Box p="8" pt="10" pb="6">
                        <Box
                          display="inline-flex"
                          position="relative"
                          fontSize="1.5rem"
                          color="#faaf00"
                          mb="4"
                          aria-label={`${t.rating ?? 5} Stars`}
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Box
                              as="span"
                              key={n}
                              display="flex"
                              color={n <= (t.rating ?? 5) ? '#faaf00' : 'rgba(0, 0, 0, 0.26)'}
                            >
                              <Icon name={n <= (t.rating ?? 5) ? 'star' : 'starBorder'} />
                            </Box>
                          ))}
                        </Box>
                        <T
                          variant="body1"
                          fontStyle="italic"
                          lineHeight={1.6}
                          mb="6"
                          color="fg.muted"
                        >
                          &quot;
                          <EditableText
                            field={`items.${(current + index) % items.length}.quote`}
                            kind="text"
                          >
                            {t.quote}
                          </EditableText>
                          &quot;
                        </T>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            src={t.imageUrl || ''}
                            alt={t.name}
                            boxSize="avatar"
                            mr="4"
                            border="2px solid"
                            borderColor="primary.light"
                          />
                          <Box>
                            <T variant="h6" fontWeight={600} {...at('name', 'line')}>
                              {t.name}
                            </T>
                            <T variant="body2" color="fg.muted" {...at('role', 'line')}>
                              {t.role}
                            </T>
                            <T
                              variant="body2"
                              color="primary"
                              fontWeight={500}
                              {...at('company', 'line')}
                            >
                              {t.company}
                            </T>
                          </Box>
                        </Box>
                      </Box>
                    </MotionCard>
                  </Col>
                )
              })}
            </Row>
          </AnimatePresence>

          <Box display="flex" justifyContent="center" gap="2" mt="8">
            {items.map((t, index) => (
              <Box
                key={t.name}
                onClick={() => setCurrent(index)}
                w="3"
                h="3"
                borderRadius="full"
                bg={index === current ? 'primary' : 'grey.300'}
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{bg: 'primary.light'}}
              />
            ))}
          </Box>
        </Box>

        {c.stats?.length ? <StatsBand items={c.stats} mt="16" path="stats" /> : null}
      </Container>
    </Box>
  )
}
