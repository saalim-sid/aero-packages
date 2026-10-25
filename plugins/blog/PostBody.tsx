import {Box, Heading, List, Stack, Text} from '@chakra-ui/react'
import type {InlineNode, PostBodyProps} from '@platform/core/types/plugins/blog'
import {SiteLink} from '@platform/ui/primitives'

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/
const SAFE_LINK = /^(https?:\/\/|\/(?!\/)|mailto:|#)/i

const PARK = 0xe000
const hide = (t: string) =>
  t.replace(/\\([\\`*_{}[\]()#+\-.!>~|<])/g, (_, c: string) =>
    String.fromCharCode(PARK + c.charCodeAt(0))
  )
const show = (t: string) =>
  Array.from(t, (ch) => {
    const c = ch.charCodeAt(0)
    return c >= PARK && c < PARK + 128 ? String.fromCharCode(c - PARK) : ch
  }).join('')

function inline(text: string): InlineNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={i}>{inline(part.slice(2, -2))}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i}>{inline(part.slice(1, -1))}</em>
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link)
      return SAFE_LINK.test(show(link[2]!)) ? (
        <SiteLink key={i} href={show(link[2]!)} color="brand.fg" textDecoration="underline">
          {inline(link[1]!)}
        </SiteLink>
      ) : (
        show(link[1]!)
      )
    return show(part)
  })
}

const lines = (block: string, re: RegExp) => block.split('\n').map((l) => l.replace(re, ''))

export function PostBody({body}: PostBodyProps) {
  const blocks = hide(body)
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  return (
    <Stack gap="5" color="fg.muted" fontSize="md" lineHeight="tall">
      {blocks.map((b, i) => {
        if (b.startsWith('### '))
          return (
            <Heading
              key={i}
              as="h3"
              fontFamily="heading"
              fontSize="xl"
              fontWeight="medium"
              color="fg"
              mt="2"
            >
              {inline(b.slice(4))}
            </Heading>
          )
        if (b.startsWith('## '))
          return (
            <Heading
              key={i}
              as="h2"
              fontFamily="heading"
              fontSize="2xl"
              fontWeight="medium"
              color="fg"
              mt="4"
            >
              {inline(b.slice(3))}
            </Heading>
          )
        if (b.split('\n').every((l) => /^\s*[-*] /.test(l)))
          return (
            <List.Root key={i} ps="5">
              {lines(b, /^\s*[-*] /).map((l, j) => (
                <List.Item key={j}>{inline(l)}</List.Item>
              ))}
            </List.Root>
          )
        if (b.split('\n').every((l) => /^\d+[.)] /.test(l)))
          return (
            <List.Root key={i} as="ol" ps="5">
              {lines(b, /^\d+[.)] /).map((l, j) => (
                <List.Item key={j}>{inline(l)}</List.Item>
              ))}
            </List.Root>
          )
        if (b.startsWith('>'))
          return (
            <Box
              key={i}
              as="blockquote"
              borderStartWidth="3px"
              borderColor="brand.solid"
              ps="4"
              fontStyle="italic"
            >
              {lines(b, /^>\s?/).map((l, j) => (
                <Text key={j}>{inline(l)}</Text>
              ))}
            </Box>
          )
        return (
          <Text key={i}>
            {b.split('\n').map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </span>
            ))}
          </Text>
        )
      })}
    </Stack>
  )
}
