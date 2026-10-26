'use client'

import {Box, chakra} from '@chakra-ui/react'
import type {AlertProps, RadioGroupProps, TextFieldProps} from '@platform/core/types/theme-ui'
import {ALERT_ICONS, ICON_PATHS} from '@platform/themes/legal-finance/icon-paths'
import {Icon} from '@platform/themes/legal-finance/ui'
import {useId, useState} from 'react'

const FIELD_PADDING = '16.5px 14px'
const SELECT_PADDING = '16.5px 32px 16.5px 14px'

const control = {
  textStyle: 'input',
  fontFamily: 'body',
  color: 'fg',
  boxSizing: 'content-box',
  border: '0',
  bg: 'transparent',
  w: '100%',
  display: 'block',
  minW: '0',
  m: '0',
  outline: '0'
} as const

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  name,
  error,
  helperText,
  type = 'text',
  rows,
  placeholder,
  options
}: TextFieldProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const shrink = focused || value !== ''
  const labelText = `${label}\u2009*`
  const events = {
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false)
      onBlur?.()
    }
  }
  const placeholderStyle = {color: 'currentColor', opacity: shrink ? 0.42 : 0}

  const input =
    options !== undefined ? (
      <chakra.select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...events}
        {...control}
        appearance="none"
        h="1.4375em"
        minH="1.4375em"
        p={SELECT_PADDING}
        cursor="pointer"
        borderRadius="sm"
      >
        <option value="" disabled hidden />
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </chakra.select>
    ) : rows ? (
      <chakra.textarea
        id={id}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...events}
        {...control}
        h={`calc(${rows} * 1.4375em)`}
        p="0"
        resize="none"
        _placeholder={placeholderStyle}
      />
    ) : (
      <chakra.input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...events}
        {...control}
        h="1.4375em"
        p={FIELD_PADDING}
        _placeholder={placeholderStyle}
      />
    )

  return (
    <Box
      display="inline-flex"
      flexDirection="column"
      position="relative"
      minW="0"
      w="100%"
      verticalAlign="top"
    >
      <chakra.label
        htmlFor={id}
        textStyle="input"
        fontFamily="body"
        position="absolute"
        left="0"
        top="0"
        zIndex="1"
        pointerEvents="none"
        display="block"
        transformOrigin="top left"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        color={error ? 'danger' : focused ? 'primary' : 'fg.muted'}
        maxW={shrink ? 'calc(133% - 32px)' : 'calc(100% - 24px)'}
        transform={shrink ? 'translate(14px, -9px) scale(0.75)' : 'translate(14px, 16px) scale(1)'}
        transitionProperty="color, transform, max-width"
        transitionDuration="200ms"
        transitionTimingFunction="cubic-bezier(0, 0, 0.2, 1)"
      >
        {labelText}
      </chakra.label>
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        cursor="text"
        borderRadius="sm"
        w="100%"
        textStyle="input"
        fontFamily="body"
        color="fg"
        p={rows ? FIELD_PADDING : undefined}
        _hover={focused || error ? undefined : {'& fieldset': {borderColor: 'fg'}}}
      >
        {input}
        {options !== undefined ? (
          <Icon
            name="arrowDropDown"
            position="absolute"
            right="7px"
            top="calc(50% - 0.5em)"
            pointerEvents="none"
            color="action.active"
          />
        ) : null}
        <chakra.fieldset
          aria-hidden="true"
          textAlign="left"
          position="absolute"
          bottom="0"
          right="0"
          top="-5px"
          left="0"
          m="0"
          px="2"
          py="0"
          pointerEvents="none"
          borderRadius="inherit"
          borderStyle="solid"
          borderWidth={focused ? '2px' : '1px'}
          borderColor={error ? 'danger' : focused ? 'primary' : 'input.border'}
          overflow="hidden"
          minW="0%"
        >
          <chakra.legend
            float="unset"
            w="auto"
            overflow="hidden"
            display="block"
            p="0"
            h="11px"
            fontSize="0.75em"
            visibility="hidden"
            maxW={shrink ? '100%' : '0.01px'}
            transitionProperty="max-width"
            transitionDuration={shrink ? '100ms' : '50ms'}
            transitionDelay={shrink ? '50ms' : '0ms'}
            whiteSpace="nowrap"
          >
            <chakra.span px="5px" display="inline-block" opacity="0" visibility="visible">
              {labelText}
            </chakra.span>
          </chakra.legend>
        </chakra.fieldset>
      </Box>
      {helperText ? (
        <chakra.p
          textStyle="caption"
          fontFamily="body"
          color="danger"
          m="3px 14px 0"
          textAlign="left"
        >
          {helperText}
        </chakra.p>
      ) : null}
    </Box>
  )
}

export function RadioGroup({label, name, value, onChange, options, error}: RadioGroupProps) {
  return (
    <chakra.fieldset
      display="inline-flex"
      flexDirection="column"
      position="relative"
      minW="0"
      p="0"
      m="0"
      border="0"
      verticalAlign="top"
    >
      <chakra.legend
        textStyle="input"
        fontFamily="body"
        color={error ? 'danger' : 'fg.muted'}
        p="0"
        fontWeight={600}
        mb="2"
      >
        {label}
      </chakra.legend>
      <Box display="flex" flexWrap="wrap" flexDirection="row" role="radiogroup">
        {options.map((o) => {
          const checked = value === o.value
          return (
            <chakra.label
              key={o.value}
              display="inline-flex"
              alignItems="center"
              cursor="pointer"
              verticalAlign="middle"
              ml="-11px"
              mr="4"
            >
              <Box
                as="span"
                position="relative"
                display="inline-flex"
                p="9px"
                borderRadius="full"
                color={checked ? 'primary' : 'fg.muted'}
              >
                <chakra.input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={checked}
                  onChange={() => onChange(o.value)}
                  position="absolute"
                  inset="0"
                  opacity="0"
                  m="0"
                  cursor="inherit"
                  w="100%"
                  h="100%"
                />
                <Box as="span" position="relative" display="flex">
                  <chakra.svg
                    viewBox="0 0 24 24"
                    boxSize="icon.md"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={ICON_PATHS.radioRing[0]} />
                  </chakra.svg>
                  <chakra.svg
                    viewBox="0 0 24 24"
                    boxSize="icon.md"
                    fill="currentColor"
                    aria-hidden="true"
                    position="absolute"
                    left="0"
                    transform={checked ? 'scale(1)' : 'scale(0)'}
                    transitionProperty="transform"
                    transitionDuration="150ms"
                  >
                    <path d={ICON_PATHS.radioDot[0]} />
                  </chakra.svg>
                </Box>
              </Box>
              <chakra.span textStyle="body1" fontFamily="body">
                {o.label}
              </chakra.span>
            </chakra.label>
          )
        })}
      </Box>
      {error ? (
        <chakra.span textStyle="caption" fontFamily="body" color="danger" mt="2">
          {error}
        </chakra.span>
      ) : null}
    </chakra.fieldset>
  )
}

export function Alert({severity, children, mt}: AlertProps) {
  return (
    <Box
      role="alert"
      display="flex"
      px="4"
      py="1.5"
      borderRadius="sm"
      bg={`alert.${severity}.bg`}
      color={`alert.${severity}.fg`}
      mt={mt}
      textStyle="body2"
      fontFamily="body"
    >
      <Box display="flex" mr="3" py="7px" opacity={0.9} color={`alert.${severity}.icon`}>
        <Icon name={ALERT_ICONS[severity]} size="alert" />
      </Box>
      <Box py="2" minW="0" overflow="auto">
        {children}
      </Box>
    </Box>
  )
}
