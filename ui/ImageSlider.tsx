'use client'

import {Box, HStack, IconButton, Image} from '@chakra-ui/react'
import type {ImageSliderProps} from '@platform/core/types/ui'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import {useEffect, useState} from 'react'

export function ImageSlider({slides, interval = 6, label}: ImageSliderProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % count), interval * 1000)
    return () => clearInterval(t)
  }, [paused, count, interval])

  const go = (i: number) => setCurrent((i + count) % count)

  return (
    <Box
      position="absolute"
      inset="0"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === current ? slide.alt : ''}
          aria-hidden={i !== current}
          position="absolute"
          inset="0"
          w="full"
          h="full"
          objectFit="cover"
          opacity={i === current ? 1 : 0}
          transition="opacity 0.9s ease"
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      {count > 1 ? (
        <HStack position="absolute" bottom="4" right="4" zIndex="1" gap="1">
          <IconButton
            aria-label="Previous image"
            size="xs"
            variant="subtle"
            borderRadius="full"
            onClick={() => go(current - 1)}
          >
            <ChevronLeft size={14} />
          </IconButton>
          {slides.map((slide, i) => (
            <Box
              key={slide.src}
              as="button"
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === current ? 'true' : undefined}
              w="2.5"
              h="2.5"
              borderRadius="full"
              bg={i === current ? 'surface' : 'whiteAlpha.500'}
              onClick={() => go(i)}
            />
          ))}
          <IconButton
            aria-label="Next image"
            size="xs"
            variant="subtle"
            borderRadius="full"
            onClick={() => go(current + 1)}
          >
            <ChevronRight size={14} />
          </IconButton>
        </HStack>
      ) : null}
    </Box>
  )
}
