'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {HeroSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {Button, Col, Container, Icon, Row, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'
import {motion} from 'framer-motion'

const MotionT = motion.create(T)
const MotionButton = motion.create(Button)

const fadeInUp = {
  initial: {opacity: 0, y: 60},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.6}
}
const stagger = {animate: {transition: {staggerChildren: 0.2}}}

const badge = {
  position: 'absolute',
  bg: 'white',
  borderRadius: 'lg',
  p: '4',
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
} as const

export function Hero({component: c}: {component: HeroSection}) {
  const [first, second] = c.badges || []
  const ed = useEditable()

  return (
    <Box
      position="relative"
      minH={{base: '70vh', md: '80vh'}}
      display="flex"
      alignItems="center"
      overflow="hidden"
      bgImage="heroWash"
      _before={{
        content: '""',
        position: 'absolute',
        inset: '0',
        bgImage: `url("${c.backgroundImageUrl}")`,
        bgSize: 'cover',
        bgPos: 'center',
        opacity: 0.1,
        zIndex: -1
      }}
    >
      <Container>
        <MotionBox initial="initial" animate="animate" variants={stagger}>
          <Row gutter={4} alignItems="center">
            <Col xs={12} md={7}>
              <MotionT
                variant="h1"
                variants={fadeInUp}
                fontWeight={700}
                fontSize={{base: '2.5rem', md: '3.5rem', lg: '4rem'}}
                lineHeight={1.2}
                mb="6"
                layerStyle="gradientText"
                {...ed('title', 'line')}
              >
                {c.title}
              </MotionT>

              <MotionT
                variant="h5"
                variants={fadeInUp}
                color="fg.muted"
                mb="8"
                fontSize={{base: '1.1rem', md: '1.3rem'}}
                lineHeight={1.6}
                maxW="lede"
                {...ed('lede')}
              >
                {c.lede}
              </MotionT>

              <MotionBox
                variants={fadeInUp}
                display="flex"
                flexDirection={{base: 'column', sm: 'row'}}
                gap="4"
                mb="8"
              >
                {c.primaryCta?.label ? (
                  <MotionButton
                    variant="contained"
                    size="large"
                    startIcon={<Icon name="phone" />}
                    href={c.primaryCta.href}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    px="8"
                    py="3"
                    fontSize="1.1rem"
                    fontWeight={600}
                    bgImage="brand"
                    boxShadow="heroButton"
                    _hover={{boxShadow: 'heroButtonHover'}}
                  >
                    <EditableText field="primaryCta.label">{c.primaryCta.label}</EditableText>
                  </MotionButton>
                ) : null}

                {c.secondaryCta?.label ? (
                  <MotionButton
                    variant="outlined"
                    size="large"
                    endIcon={<Icon name="arrowForward" />}
                    href={c.secondaryCta.href}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    px="8"
                    py="3"
                    fontSize="1.1rem"
                    fontWeight={600}
                    borderWidth="2px"
                    _hover={{borderWidth: '2px', bg: 'primary', color: 'white'}}
                  >
                    <EditableText field="secondaryCta.label">{c.secondaryCta.label}</EditableText>
                  </MotionButton>
                ) : null}
              </MotionBox>

              {c.stats?.length ? (
                <MotionBox
                  variants={fadeInUp}
                  display="flex"
                  flexDirection={{base: 'column', sm: 'row'}}
                  alignItems={{base: 'flex-start', sm: 'center'}}
                  gap="6"
                  pt="4"
                  borderTop="1px solid"
                  borderTopColor="grey.300"
                >
                  {c.stats.map((stat, i) => (
                    <Box key={stat.label} display="flex" alignItems="center" gap="2">
                      <T
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                        {...ed(`stats.${i}.value`, 'line')}
                      >
                        {stat.value}
                      </T>
                      <T variant="body2" color="fg.muted" {...ed(`stats.${i}.label`, 'line')}>
                        {stat.label}
                      </T>
                    </Box>
                  ))}
                </MotionBox>
              ) : null}
            </Col>

            <Col xs={12} md={5}>
              {c.imageUrl ? (
                <MotionBox
                  variants={fadeInUp}
                  position="relative"
                  display={{base: 'none', md: 'block'}}
                >
                  <chakra.img
                    src={c.imageUrl}
                    alt={c.imageAlt || ''}
                    w="100%"
                    h="auto"
                    borderRadius="xl"
                    boxShadow="image"
                  />
                  {first ? (
                    <Box {...badge} top="20%" right="-10%" transform="rotate(5deg)">
                      <T
                        variant="body2"
                        fontWeight={600}
                        color="primary"
                        {...ed('badges.0.title', 'line')}
                      >
                        {first.title}
                      </T>
                      <T variant="caption" color="fg.muted" {...ed('badges.0.caption', 'line')}>
                        {first.caption}
                      </T>
                    </Box>
                  ) : null}
                  {second ? (
                    <Box {...badge} bottom="20%" left="-10%" transform="rotate(-5deg)">
                      <T
                        variant="body2"
                        fontWeight={600}
                        color="secondary"
                        {...ed('badges.1.title', 'line')}
                      >
                        {second.title}
                      </T>
                      <T variant="caption" color="fg.muted" {...ed('badges.1.caption', 'line')}>
                        {second.caption}
                      </T>
                    </Box>
                  ) : null}
                </MotionBox>
              ) : null}
            </Col>
          </Row>
        </MotionBox>
      </Container>
    </Box>
  )
}
