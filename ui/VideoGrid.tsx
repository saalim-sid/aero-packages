'use client'

import {Box, Heading, SimpleGrid, Text} from '@chakra-ui/react'
import type {VideoItem} from '@platform/core/types/sections'
import {SiteLink} from '@platform/ui/primitives'
import {useState} from 'react'

function videoId(value?: string): string | null {
  if (!value) return null
  if (/^[\w-]{11}$/.test(value)) return value
  const m = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : null
}

function Player({id, title}: {id: string; title: string}) {
  const [play, setPlay] = useState(false)
  return (
    <Box position="relative" pt="56.25%" bg="black" borderRadius="lg" overflow="hidden">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0}}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label={`Play video: ${title}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            background: `center / cover no-repeat url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)`
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 68,
              height: 48,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              fontSize: 22
            }}
          >
            ▶
          </span>
        </button>
      )}
    </Box>
  )
}

export function VideoGrid({component}: {component: Record<string, unknown>}) {
  const items = (Array.isArray(component.items) ? component.items : []) as VideoItem[]
  if (!items.length) return null
  return (
    <Box>
      {component.titleText ? (
        <Heading as="h2" fontFamily="heading" fontSize="3xl" fontWeight="medium" mb="6">
          {String(component.titleText)}
        </Heading>
      ) : null}
      <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap="6">
        {items.map((item, i) => {
          const link = item.youtubeUrl
          const id = videoId(link)
          const title = item.title || 'Video'
          return (
            <Box key={item._key || i}>
              {id ? <Player id={id} title={title} /> : null}
              <Heading as="h3" fontSize="lg" fontWeight="medium" mt="3">
                {id || !link ? (
                  title
                ) : (
                  <SiteLink href={link} target="_blank" rel="noopener noreferrer">
                    {title}
                  </SiteLink>
                )}
              </Heading>
              {item.description ? (
                <Text color="fg.muted" fontSize="sm" mt="1">
                  {item.description}
                </Text>
              ) : null}
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
