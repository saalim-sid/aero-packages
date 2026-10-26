'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import {SITE_LOCALE} from '@platform/core/site-meta'
import type {RichTextSection} from '@platform/core/types/sections'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Container, Icon, T} from '@platform/themes/legal-finance/ui'
import {Box, chakra} from '@chakra-ui/react'

const date = new Intl.DateTimeFormat(SITE_LOCALE, {dateStyle: 'long', timeZone: 'UTC'})

const iconFor = (href: string) => (href.startsWith('tel:') ? 'phone' : 'email')

export function RichText({component: c}: {component: RichTextSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c)}>
      <Container size="md">
        {c.title ? (
          <T variant="h1" layerStyle="gradientText" mb="4" {...ed('title', 'line')}>
            {c.title}
          </T>
        ) : null}
        {c.lede ? (
          <T variant="h6" color="fg.muted" lineHeight={1.6} mb="3" {...ed('lede')}>
            {c.lede}
          </T>
        ) : null}
        {c.updated ? (
          <T variant="body2" color="fg.subtle">
            Last updated: {date.format(new Date(c.updated))}
          </T>
        ) : null}

        {c.title || c.lede || c.updated ? (
          <Box as="hr" my="10" border="0" borderTop="1px solid" borderColor="divider" />
        ) : null}

        <Box display="flex" flexDirection="column" gap="10">
          {c.blocks.map((b, i) =>
            b.highlight ? (
              <Box as="section" key={b.heading || i} bg="bg.muted" borderRadius="md" p="8">
                <T variant="h4" fontWeight={600} mb="3" {...ed(`blocks.${i}.heading`, 'line')}>
                  {b.heading}
                </T>
                <T variant="body1" color="fg.muted" mb="5" {...ed(`blocks.${i}.intro`)}>
                  {b.intro}
                </T>
                {b.links?.map((link, l) => (
                  <Box
                    key={link.href}
                    display="flex"
                    alignItems="center"
                    gap="3"
                    mb="2"
                    _last={{mb: 0}}
                  >
                    <Icon name={iconFor(link.href)} size="sm" color="primary" />
                    <chakra.a
                      href={link.href}
                      color="primary"
                      textDecoration="none"
                      textStyle="body1"
                      _hover={{textDecoration: 'underline'}}
                    >
                      <EditableText field={`blocks.${i}.links.${l}.label`}>
                        {link.label}
                      </EditableText>
                    </chakra.a>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box as="section" key={b.heading || i} display="flex" flexDirection="column" gap="3">
                {b.heading ? (
                  <T variant="h4" fontWeight={600} {...ed(`blocks.${i}.heading`, 'line')}>
                    {b.heading}
                  </T>
                ) : null}
                {b.intro ? (
                  <T variant="body1" color="fg.muted" {...ed(`blocks.${i}.intro`)}>
                    {b.intro}
                  </T>
                ) : null}
                {b.body?.map((p, j) => (
                  <T key={p} variant="body1" color="fg.muted" {...ed(`blocks.${i}.body.${j}`)}>
                    {p}
                  </T>
                ))}
                {b.list ? (
                  <chakra.ul m="0" pl="6" color="fg.muted" textStyle="body1">
                    {b.list.map((item, j) => (
                      <chakra.li key={item} mb="2" _last={{mb: 0}}>
                        <EditableText field={`blocks.${i}.list.${j}`} kind="text">
                          {item}
                        </EditableText>
                      </chakra.li>
                    ))}
                  </chakra.ul>
                ) : null}
                {b.links?.map((link, l) => (
                  <chakra.a key={link.href} href={link.href} color="primary" textStyle="body1">
                    <EditableText field={`blocks.${i}.links.${l}.label`}>{link.label}</EditableText>
                  </chakra.a>
                ))}
              </Box>
            )
          )}
        </Box>
      </Container>
    </Box>
  )
}
