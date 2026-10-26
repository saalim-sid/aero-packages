'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {MediaSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Heading} from '@platform/themes/legal-finance/sections/Heading'
import {Button, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'

const embed = (url = '') => {
  const id = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/.exec(url)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : ''
}

export function Media({component: c}: {component: MediaSection}) {
  const ed = useEditable()
  if (c.variant === 'video')
    return (
      <Box {...frame(c)}>
        <Container>
          <Heading c={c} />
          <Row gutter={4}>
            {c.videos?.map((v, i) => (
              <Col xs={12} md={6} key={v._key || v.youtubeUrl || i}>
                <Box borderRadius="xl" overflow="hidden" boxShadow="image" aspectRatio="16 / 9">
                  {embed(v.youtubeUrl) ? (
                    <iframe
                      src={embed(v.youtubeUrl)}
                      title={v.title || 'Video'}
                      width="100%"
                      height="100%"
                      style={{border: 0}}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : null}
                </Box>
                {v.title ? (
                  <T variant="h6" fontWeight={600} mt="3" {...ed(`videos.${i}.title`, 'line')}>
                    {v.title}
                  </T>
                ) : null}
                {v.description ? (
                  <T variant="body2" color="fg.muted" {...ed(`videos.${i}.description`)}>
                    {v.description}
                  </T>
                ) : null}
              </Col>
            ))}
          </Row>
        </Container>
      </Box>
    )

  const image = c.images?.[0]
  return (
    <Box {...frame(c)}>
      <Container>
        <MotionBox
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="image"
          minH="sm"
          display="flex"
          alignItems="center"
        >
          {image ? (
            <chakra.img
              src={image.imageUrl}
              alt={image.imageAlt || ''}
              position="absolute"
              inset="0"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : null}
          {c.title || c.lede ? (
            <Box position="relative" p={{base: '8', md: '12'}} maxW="lede" color="white">
              <Box position="absolute" inset="0" bgImage="brand" opacity={0.85} zIndex={-1} />
              <T variant="h3" fontWeight={700} mb="4" {...ed('title', 'line')}>
                {c.title}
              </T>
              <T variant="body1" mb={c.cta?.label ? '6' : '0'} {...ed('lede')}>
                {c.lede}
              </T>
              {c.cta?.label ? (
                <Button
                  variant="contained"
                  href={c.cta.href}
                  bg="white"
                  color="primary"
                  endIcon={<Icon name="arrowForward" />}
                >
                  <EditableText field="cta.label">{c.cta.label}</EditableText>
                </Button>
              ) : null}
            </Box>
          ) : null}
        </MotionBox>
      </Container>
    </Box>
  )
}
