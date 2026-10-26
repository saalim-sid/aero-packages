'use client'

import {Box} from '@chakra-ui/react'
import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {TeamSection} from '@platform/core/types/sections'
import {Avatar} from '@platform/themes/legal-finance/Avatar'
import {MotionBox, MotionCard} from '@platform/themes/legal-finance/motion'
import {frame, icon} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'

export function Team({component: c}: {component: TeamSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          {c.heading === 'sub' ? (
            <T variant="h3" fontWeight={600} textAlign="center" mb="12" {...ed('title', 'line')}>
              {c.title}
            </T>
          ) : (
            <Heading c={c} />
          )}
          <Row gutter={4}>
            {c.items.map((member, index) => (
              <Col xs={12} md={6} lg={4} key={member.name}>
                <MotionCard
                  initial={{opacity: 0, y: 30}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: index * 0.1}}
                  whileHover={{y: -5}}
                  h="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Box p="8" pb="6" textAlign="center">
                    <Avatar
                      src={member.imageUrl || ''}
                      alt={member.name}
                      boxSize="avatar.lg"
                      mx="auto"
                      mb="6"
                      border="4px solid"
                      borderColor="primary"
                    />
                    <T variant="h5" fontWeight={600} mb="2" {...ed(`items.${index}.name`, 'line')}>
                      {member.name}
                    </T>
                    <T variant="h6" color="primary" mb="4" {...ed(`items.${index}.role`, 'line')}>
                      {member.role}
                    </T>
                    <T
                      variant="body2"
                      color="fg.muted"
                      mb="6"
                      lineHeight={1.6}
                      {...ed(`items.${index}.bio`)}
                    >
                      {member.bio}
                    </T>

                    {member.tags?.length ? (
                      <Box mb="6">
                        <T variant="subtitle2" fontWeight={600} mb="2" {...ed('tagsLabel', 'line')}>
                          {c.tagsLabel}
                        </T>
                        <Box display="flex" flexWrap="wrap" gap="2" justifyContent="center">
                          {member.tags.map((tag, t) => (
                            <Box
                              key={tag}
                              display="inline-flex"
                              alignItems="center"
                              justifyContent="center"
                              h="6"
                              borderRadius="lg"
                              bg="primary"
                              color="white"
                              fontFamily="body"
                              textStyle="chip"
                              whiteSpace="nowrap"
                            >
                              <Box as="span" px="2" overflow="hidden" textOverflow="ellipsis">
                                <EditableText field={`items.${index}.tags.${t}`}>
                                  {tag}
                                </EditableText>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    ) : null}

                    {member.experience ? (
                      <Box display="flex" alignItems="center" justifyContent="center" mb="4">
                        <Icon name="verified" mr="2" size="sm" color="success" />
                        <T
                          variant="body2"
                          fontWeight={600}
                          {...ed(`items.${index}.experience`, 'line')}
                        >
                          {member.experience}
                        </T>
                      </Box>
                    ) : null}

                    {member.details?.map((group, g) => (
                      <Box mb="6" key={group.label}>
                        {group.icon ? (
                          <Box display="flex" alignItems="center" justifyContent="center" mb="2">
                            <Icon
                              name={icon(group.icon, 'checkCircle')}
                              mr="2"
                              size="sm"
                              color="primary"
                            />
                            <T
                              variant="subtitle2"
                              fontWeight={600}
                              {...ed(`items.${index}.details.${g}.label`, 'line')}
                            >
                              {group.label}
                            </T>
                          </Box>
                        ) : (
                          <T
                            variant="subtitle2"
                            fontWeight={600}
                            mb="2"
                            {...ed(`items.${index}.details.${g}.label`, 'line')}
                          >
                            {group.label}
                          </T>
                        )}
                        {group.values.map((value, v) => (
                          <T key={value} variant="body2" color="fg.muted" fontSize="0.875rem">
                            {group.bullet ? (
                              <>
                                {'• '}
                                <EditableText field={`items.${index}.details.${g}.values.${v}`}>
                                  {value}
                                </EditableText>
                              </>
                            ) : (
                              <EditableText field={`items.${index}.details.${g}.values.${v}`}>
                                {value}
                              </EditableText>
                            )}
                          </T>
                        ))}
                      </Box>
                    ))}

                    {member.email || member.phone ? (
                      <Box pt="4" borderTop="1px solid" borderTopColor="grey.200">
                        {member.email ? (
                          <Box display="flex" alignItems="center" justifyContent="center" mb="2">
                            <Icon name="email" mr="2" size="xs" color="primary" />
                            <T
                              variant="body2"
                              fontSize="0.875rem"
                              {...ed(`items.${index}.email`, 'line')}
                            >
                              {member.email}
                            </T>
                          </Box>
                        ) : null}
                        {member.phone ? (
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <Icon name="phone" mr="2" size="xs" color="primary" />
                            <T
                              variant="body2"
                              fontSize="0.875rem"
                              {...ed(`items.${index}.phone`, 'line')}
                            >
                              {member.phone}
                            </T>
                          </Box>
                        ) : null}
                      </Box>
                    ) : null}
                  </Box>
                </MotionCard>
              </Col>
            ))}
          </Row>
        </MotionBox>
      </Container>
    </Box>
  )
}
