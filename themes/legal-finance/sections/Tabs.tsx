'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {TabsSection} from '@platform/core/types/sections'
import {MotionBox, MotionCard} from '@platform/themes/legal-finance/motion'
import {CtaPanel} from '@platform/themes/legal-finance/sections/Cta'
import {frame, icon} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Button, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'
import {useLayoutEffect, useRef, useState} from 'react'

export function Tabs({component: c}: {component: TabsSection}) {
  const ed = useEditable()
  const [tab, setTab] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [indicator, setIndicator] = useState({left: 0, width: 0})

  useLayoutEffect(() => {
    const el = tabRefs.current[tab]
    if (el) setIndicator({left: el.offsetLeft, width: el.offsetWidth})
  }, [tab])

  return (
    <Box {...frame(c)}>
      <Container>
        <Heading c={c} pageMb={6} />

        <Box borderBottom="1px solid" borderBottomColor="divider" mb="8">
          <Box position="relative" display="flex" overflow="hidden" minH="12">
            <Box
              display="flex"
              justifyContent="center"
              flex="1 1 auto"
              minW="0"
              position="relative"
              role="tablist"
            >
              {c.tabs.map((t, i) => (
                <chakra.button
                  key={t.id}
                  id={t.id}
                  role="tab"
                  aria-selected={tab === i}
                  ref={(el: HTMLButtonElement | null) => {
                    tabRefs.current[i] = el
                  }}
                  onClick={() => setTab(i)}
                  display="inline-flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  minH="12"
                  minW="tab.min"
                  maxW="tab.max"
                  py="9px"
                  px="8"
                  border="0"
                  bg="transparent"
                  cursor="pointer"
                  flexShrink={0}
                  overflow="hidden"
                  whiteSpace="normal"
                  textAlign="center"
                  fontFamily="body"
                  color={tab === i ? 'primary' : 'fg.muted'}
                  textStyle="tab"
                  textTransform="none"
                >
                  <Icon name={icon(t.icon, 'business')} mr="2" />
                  <EditableText field={`tabs.${i}.label`}>{t.label}</EditableText>
                </chakra.button>
              ))}
              <Box
                position="absolute"
                bottom="0"
                h="0.5"
                bg="primary"
                left={`${indicator.left}px`}
                w={`${indicator.width}px`}
                transition="all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms"
              />
            </Box>
          </Box>
        </Box>

        {c.tabs.map((t, i) => (
          <div
            key={t.id}
            role="tabpanel"
            hidden={tab !== i}
            id={`services-tabpanel-${i}`}
            aria-labelledby={`services-tab-${i}`}
          >
            {tab === i && (
              <Box py="6">
                <MotionBox
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{duration: 0.5}}
                >
                  <T
                    variant="h4"
                    fontWeight={600}
                    mb="8"
                    textAlign="center"
                    {...ed(`tabs.${i}.title`, 'line')}
                  >
                    {t.title}
                  </T>
                  <Row gutter={4}>
                    {t.items.map((item, index) => (
                      <Col xs={12} md={6} lg={4} key={item.title}>
                        <MotionCard
                          initial={{opacity: 0, y: 30}}
                          whileInView={{opacity: 1, y: 0}}
                          transition={{duration: 0.6, delay: index * 0.1}}
                          whileHover={{y: -5}}
                          h="100%"
                          display="flex"
                          flexDirection="column"
                        >
                          <Box flexGrow={1} p="6">
                            <Box display="flex" alignItems="center" mb="4">
                              <Box p="3" borderRadius="lg" bg="primary" color="white" mr="4">
                                <Icon name={icon(item.icon || t.icon, 'business')} />
                              </Box>
                              <T
                                variant="h5"
                                fontWeight={600}
                                {...ed(`tabs.${i}.items.${index}.title`, 'line')}
                              >
                                {item.title}
                              </T>
                            </Box>
                            <T
                              variant="body1"
                              color="fg.muted"
                              mb="6"
                              lineHeight={1.6}
                              {...ed(`tabs.${i}.items.${index}.body`)}
                            >
                              {item.body}
                            </T>
                            {item.bullets?.length ? (
                              <>
                                <T
                                  variant="h6"
                                  fontWeight={600}
                                  mb="4"
                                  {...ed('bulletsLabel', 'line')}
                                >
                                  {c.bulletsLabel}
                                </T>
                                <Box
                                  as="ul"
                                  listStyleType="none"
                                  m="0"
                                  py="2"
                                  px="0"
                                  position="relative"
                                >
                                  {item.bullets.map((bullet, b) => (
                                    <Box
                                      as="li"
                                      key={bullet}
                                      display="flex"
                                      alignItems="center"
                                      position="relative"
                                      py="1"
                                      px="0"
                                    >
                                      <Box
                                        display="inline-flex"
                                        flexShrink={0}
                                        minW="8"
                                        color="rgba(0, 0, 0, 0.54)"
                                      >
                                        <Icon name="checkCircle" color="success" size="sm" />
                                      </Box>
                                      <Box flex="1 1 auto" minW="0" my="1">
                                        <T
                                          variant="body2"
                                          as="span"
                                          display="block"
                                          color="fg.muted"
                                          {...ed(`tabs.${i}.items.${index}.bullets.${b}`, 'line')}
                                        >
                                          {bullet}
                                        </T>
                                      </Box>
                                    </Box>
                                  ))}
                                </Box>
                              </>
                            ) : null}
                          </Box>
                          {item.href ? (
                            <Box display="flex" alignItems="center" p="6" pt="0">
                              <Button
                                variant="contained"
                                endIcon={<Icon name="arrowForward" />}
                                href={item.href}
                                fullWidth
                                fontWeight={600}
                              >
                                <EditableText field={`tabs.${i}.items.${index}.linkLabel`}>
                                  {item.linkLabel}
                                </EditableText>
                              </Button>
                            </Box>
                          ) : null}
                        </MotionCard>
                      </Col>
                    ))}
                  </Row>
                </MotionBox>
              </Box>
            )}
          </div>
        ))}

        {c.cta?.title ? <CtaPanel c={c.cta} mt="16" path="cta" /> : null}
      </Container>
    </Box>
  )
}
