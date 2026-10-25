'use client'

import createCache from '@emotion/cache'
import {CacheProvider, type EmotionCache} from '@emotion/react'
import {useServerInsertedHTML} from 'next/navigation'
import {useState} from 'react'

/**
 * Chakra's `css`/style props resolve through Emotion, which assigns each
 * distinct style its class name in first-seen order. Without this, the App
 * Router's SSR pass and the browser's hydration pass each start that
 * numbering from zero independently, and rarely walk the tree in the exact
 * same order (streaming, client components, list rendering) — so the same
 * props end up with two different class names and React flags a hydration
 * mismatch on `className`. Sharing one cache and flushing every style it
 * inserted server-side into the initial HTML (via `useServerInsertedHTML`)
 * lets the client resume that same numbering instead of restarting it.
 */
function createEmotionCache() {
  const cache = createCache({key: 'wt'})
  cache.compat = true
  const originalInsert = cache.insert
  let inserted: string[] = []
  cache.insert = (...args) => {
    const serialized = args[1]
    if (cache.inserted[serialized.name] === undefined) {
      inserted.push(serialized.name)
    }
    return originalInsert(...args)
  }
  const flush = () => {
    const names = inserted
    inserted = []
    return names
  }
  return {cache, flush}
}

export function EmotionCacheProvider({children}: {children: React.ReactNode}) {
  const [{cache, flush}] = useState<{cache: EmotionCache; flush: () => string[]}>(
    createEmotionCache
  )

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null
    let styles = ''
    for (const name of names) {
      styles += cache.inserted[name]
    }
    return (
      <style
        key="emotion-cache"
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{__html: styles}}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
