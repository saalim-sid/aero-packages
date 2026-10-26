'use client'

import {useEditable} from '@platform/builder/editable-context'
import type {ContactSection} from '@platform/core/types/sections'
import {MotionBox, MotionCard} from '@platform/themes/legal-finance/motion'
import {TheForm} from '@platform/themes/legal-finance/sections/Form'
import {frame, icon} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

export function Contact({component: c}: {component: ContactSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c)}>
      <Container>
        <Heading c={c} />

        <Row gutter={6}>
          <Col xs={12} lg={5}>
            <MotionBox
              initial={{opacity: 0, x: -30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.6, delay: 0.2}}
            >
              {c.infoTitle ? (
                <T variant="h4" fontWeight={600} mb="8" {...ed('infoTitle', 'line')}>
                  {c.infoTitle}
                </T>
              ) : null}
              <Row gutter={3}>
                {c.info?.map((info, index) => (
                  <Col xs={12} sm={6} lg={12} key={info.title}>
                    <MotionCard
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.6, delay: 0.3 + index * 0.1}}
                      h="100%"
                    >
                      <Box p="6">
                        <Box display="flex" alignItems="flex-start" mb="4">
                          <Box p="3" borderRadius="lg" bg="primary" color="white" mr="4" mt="1">
                            <Icon name={icon(info.icon, 'infoOutlined')} />
                          </Box>
                          <Box flexGrow={1}>
                            <T
                              variant="h6"
                              fontWeight={600}
                              mb="2"
                              {...ed(`info.${index}.title`, 'line')}
                            >
                              {info.title}
                            </T>
                            {info.details.map((detail, d) => (
                              <T
                                key={detail}
                                variant="body2"
                                color="fg"
                                mb="1"
                                {...ed(`info.${index}.details.${d}`, 'line')}
                              >
                                {detail}
                              </T>
                            ))}
                            <T variant="caption" color="fg.muted" {...ed(`info.${index}.body`)}>
                              {info.body}
                            </T>
                          </Box>
                        </Box>
                      </Box>
                    </MotionCard>
                  </Col>
                ))}
              </Row>

              {c.mapUrl ? (
                <MotionBox
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: 0.7}}
                  mt="8"
                >
                  <T variant="h6" fontWeight={600} mb="4" {...ed('mapTitle', 'line')}>
                    {c.mapTitle}
                  </T>
                  <Box w="100%" h="map" borderRadius="lg" overflow="hidden" boxShadow="map">
                    <iframe
                      src={c.mapUrl}
                      width="100%"
                      height="100%"
                      style={{border: 0}}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={c.mapTitle || 'Office Location'}
                    />
                  </Box>
                </MotionBox>
              ) : null}
            </MotionBox>
          </Col>

          <Col xs={12} lg={7}>
            {c.form ? (
              <MotionBox
                initial={{opacity: 0, x: 30}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.6, delay: 0.4}}
              >
                <TheForm f={c.form} />
              </MotionBox>
            ) : null}
          </Col>
        </Row>
      </Container>
    </Box>
  )
}
