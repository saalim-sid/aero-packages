'use client'

import {Box, chakra, type HTMLChakraProps} from '@chakra-ui/react'
import {useEffect, useRef, useState} from 'react'

export function Avatar({src, alt, ...rest}: {src: string; alt: string} & HTMLChakraProps<'div'>) {
  const [broken, setBroken] = useState(false)
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth === 0) setBroken(true)
  }, [])
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      borderRadius="full"
      overflow="hidden"
      userSelect="none"
      fontFamily="body"
      textStyle="avatar"
      color="white"
      bg={broken ? '#9e9e9e' : undefined}
      {...rest}
    >
      {broken ? (
        alt.charAt(0)
      ) : (
        <chakra.img
          ref={img}
          src={src}
          alt={alt}
          w="100%"
          h="100%"
          textAlign="center"
          objectFit="cover"
          color="transparent"
          textIndent="10000px"
          onError={() => setBroken(true)}
        />
      )}
    </Box>
  )
}
