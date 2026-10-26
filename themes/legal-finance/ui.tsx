'use client'

import {Box, chakra, type HTMLChakraProps} from '@chakra-ui/react'
import type {
  Breakpoint,
  ButtonProps,
  ColProps,
  IconProps,
  TextProps
} from '@platform/core/types/theme-ui'
import {blueButton} from '@platform/themes/blue-recipes'
import {ICON_PATHS} from '@platform/themes/legal-finance/icon-paths'
import NextLink from 'next/link'
import {createContext, forwardRef, useContext, type ReactNode} from 'react'

const TAG: Record<TextProps['variant'], string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span'
}

export function T({variant, as, children, ...rest}: TextProps & Omit<HTMLChakraProps<'p'>, 'as'>) {
  return (
    <Box as={(as || TAG[variant]) as 'p'} m="0" fontFamily="body" textStyle={variant} {...rest}>
      {children}
    </Box>
  )
}

export function Icon({name, size, ...rest}: IconProps & HTMLChakraProps<'svg'>) {
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      boxSize={size ? `icon.${size}` : 'var(--icon-size, {sizes.icon.md})'}
      display="inline-block"
      flexShrink={0}
      userSelect="none"
      {...rest}
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </chakra.svg>
  )
}

export function Container({
  size = 'lg',
  children,
  ...rest
}: {size?: Breakpoint; children: ReactNode} & HTMLChakraProps<'div'>) {
  return (
    <Box
      w="100%"
      mx="auto"
      px={{base: '4', sm: '6'}}
      maxW={{[size]: `container.${size}`}}
      {...rest}
    >
      {children}
    </Box>
  )
}

const Gutter = createContext('0')

export function Row({
  gutter,
  children,
  ...rest
}: {gutter: number; children: ReactNode} & HTMLChakraProps<'div'>) {
  const space = String(gutter * 2)
  return (
    <Gutter.Provider value={space}>
      <Box
        display="flex"
        flexWrap="wrap"
        mt={`-${space}`}
        ml={`-${space}`}
        w={`calc(100% + {spacing.${space}})`}
        {...rest}
      >
        {children}
      </Box>
    </Gutter.Provider>
  )
}

const width = (n: number) => `${(n / 12) * 100}%`

export function Col({
  xs = 12,
  sm,
  md,
  lg,
  children,
  ...rest
}: ColProps & Omit<HTMLChakraProps<'div'>, 'xs' | 'sm' | 'md' | 'lg'>) {
  const space = useContext(Gutter)
  const w = {
    base: width(xs),
    ...(sm ? {sm: width(sm)} : {}),
    ...(md ? {md: width(md)} : {}),
    ...(lg ? {lg: width(lg)} : {})
  }
  return (
    <Box pt={space} pl={space} flexGrow={0} flexBasis={w} maxW={w} {...rest}>
      {children}
    </Box>
  )
}

export const Card = forwardRef<HTMLDivElement, HTMLChakraProps<'div'>>(function Card(props, ref) {
  return <Box ref={ref} layerStyle="card" {...props} />
})

const ButtonEl = chakra('button', blueButton)
const ButtonLink = chakra(NextLink, blueButton)

export const Button = forwardRef<
  HTMLElement,
  ButtonProps & Omit<HTMLChakraProps<'button'>, 'type'>
>(function Button(
  {variant, size, href, startIcon, endIcon, fullWidth, type = 'button', children, ...rest},
  ref
) {
  const content = (
    <>
      {startIcon ? <span data-icon="start">{startIcon}</span> : null}
      {children}
      {endIcon ? <span data-icon="end">{endIcon}</span> : null}
    </>
  )
  const recipe = {variant, size, fullWidth}
  if (href)
    return (
      <ButtonLink ref={ref as never} href={href} {...recipe} {...(rest as object)}>
        {content}
      </ButtonLink>
    )
  return (
    <ButtonEl ref={ref as never} type={type} {...recipe} {...rest}>
      {content}
    </ButtonEl>
  )
})
