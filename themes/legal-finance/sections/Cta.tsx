'use client'

import {EditableText} from '@platform/builder/Editable'
import {useEditable} from '@platform/builder/editable-context'
import type {CtaSection} from '@platform/core/types/sections'
import {MotionBox} from '@platform/themes/legal-finance/motion'
import {frame} from '@platform/themes/legal-finance/sections/frame'
import {Button, Card, Container, Icon, T} from '@platform/themes/legal-finance/ui'
import {Box} from '@chakra-ui/react'

const inView = {
  initial: {opacity: 0, y: 30},
  whileInView: {opacity: 1, y: 0},
  viewport: {once: true},
  transition: {duration: 0.6}
}

/** Grey rounded panel with up to two buttons (end of the services and detail pages). */
export function CtaPanel({c, mt, path = ''}: {c: CtaSection; mt?: string; path?: string}) {
  const ed = useEditable()
  const f = (key: string) => (path ? `${path}.${key}` : key)
  return (
    <MotionBox {...inView} mt={mt} p="12" bg="bg.muted" borderRadius="xl" textAlign="center">
      <T variant="h4" fontWeight={600} mb="4" {...ed(f('title'), 'line')}>
        {c.title}
      </T>
      <T variant="body1" color="fg.muted" mb="8" maxW="lede" mx="auto" {...ed(f('body'))}>
        {c.body}
      </T>
      <Box display="flex" gap="4" justifyContent="center" flexWrap="wrap">
        {[c.primary, c.secondary].map((link, i) =>
          link?.label ? (
            <Button
              key={link.href}
              variant={i === 0 ? 'contained' : 'outlined'}
              size="large"
              href={link.href}
              px="8"
              py="3"
            >
              <EditableText field={f(i === 0 ? 'primary.label' : 'secondary.label')}>
                {link.label}
              </EditableText>
            </Button>
          ) : null
        )}
      </Box>
    </MotionBox>
  )
}

/** Contact card with phone, email and two buttons (detail page sidebar). */
export function CtaCard({c, path = ''}: {c: CtaSection; path?: string}) {
  const ed = useEditable()
  const f = (key: string) => (path ? `${path}.${key}` : key)
  return (
    <Card p="6" mb="6" boxShadow="form">
      <T variant="h5" fontWeight={600} mb="2" {...ed(f('title'), 'line')}>
        {c.title}
      </T>
      <T variant="body2" color="fg.muted" mb="4" lineHeight={1.6} {...ed(f('body'))}>
        {c.body}
      </T>
      {c.phone ? (
        <Box display="flex" alignItems="center" gap="2" mb="2">
          <Icon name="phone" size="sm" color="primary" />
          <T variant="body2" {...ed(f('phone'), 'line')}>
            {c.phone}
          </T>
        </Box>
      ) : null}
      {c.email ? (
        <Box display="flex" alignItems="center" gap="2" mb="6">
          <Icon name="email" size="sm" color="primary" />
          <T variant="body2" {...ed(f('email'), 'line')}>
            {c.email}
          </T>
        </Box>
      ) : null}
      {c.primary?.label ? (
        <Button
          variant="contained"
          fullWidth
          href={c.primary.href}
          startIcon={<Icon name="phone" />}
          mb="3"
        >
          <EditableText field={f('primary.label')}>{c.primary.label}</EditableText>
        </Button>
      ) : null}
      {c.secondary?.label ? (
        <Button variant="outlined" fullWidth href={c.secondary.href}>
          <EditableText field={f('secondary.label')}>{c.secondary.label}</EditableText>
        </Button>
      ) : null}
    </Card>
  )
}

function Band({c}: {c: CtaSection}) {
  const ed = useEditable()
  return (
    <Box {...frame(c, {bgImage: 'brand', color: 'white'})}>
      <Container>
        <MotionBox {...inView} textAlign="center">
          <T variant="h3" fontWeight={700} mb="4" {...ed('title', 'line')}>
            {c.title}
          </T>
          <T
            variant="h6"
            fontWeight={400}
            opacity={0.9}
            maxW="lede"
            mx="auto"
            lineHeight={1.6}
            mb="8"
            {...ed('body')}
          >
            {c.body}
          </T>
          <Box display="flex" gap="4" justifyContent="center" flexWrap="wrap">
            {c.primary?.label ? (
              <Button
                variant="contained"
                size="large"
                href={c.primary.href}
                startIcon={<Icon name="phone" />}
                bg="white"
                color="primary"
                _hover={{bg: 'grey.100'}}
              >
                <EditableText field="primary.label">{c.primary.label}</EditableText>
              </Button>
            ) : null}
            {c.secondary?.label ? (
              <Button
                variant="outlined"
                size="large"
                href={c.secondary.href}
                color="white"
                borderColor="white/60"
                _hover={{borderColor: 'white', bg: 'white/10'}}
              >
                <EditableText field="secondary.label">{c.secondary.label}</EditableText>
              </Button>
            ) : null}
          </Box>
        </MotionBox>
      </Container>
    </Box>
  )
}

export function Cta({component: c}: {component: CtaSection}) {
  if (c.variant === 'panel')
    return (
      <Box {...frame(c)}>
        <Container>
          <CtaPanel c={c} />
        </Container>
      </Box>
    )
  if (c.variant === 'card')
    return (
      <Box {...frame(c)}>
        <Container size="md">
          <CtaCard c={c} />
        </Container>
      </Box>
    )
  return <Band c={c} />
}
