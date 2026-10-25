import {defineRecipe} from '@chakra-ui/react'

/** The original site's MUI Button: no uppercase, 600 weight, 8px corners, no resting shadow. */
export const blueButton = defineRecipe({
  className: 'fahaa-button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    outline: 0,
    border: 0,
    m: 0,
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    textDecoration: 'none',
    bg: 'transparent',
    fontFamily: 'body',
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none',
    minW: '16',
    borderRadius: 'sm',
    boxShadow: 'none',
    transitionProperty: 'background-color, box-shadow, border-color, color',
    transitionDuration: '250ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    _hover: {boxShadow: 'buttonHover'},
    _disabled: {color: 'action.disabled', pointerEvents: 'none'},
    '& [data-icon=start]': {display: 'inherit', mr: '2', ml: '-1'},
    '& [data-icon=end]': {display: 'inherit', ml: '2', mr: '-1'}
  },
  variants: {
    variant: {
      contained: {
        color: 'white',
        bg: 'primary',
        _hover: {bg: 'primary.dark'},
        _disabled: {bg: 'action.disabledBg'}
      },
      outlined: {
        color: 'primary',
        border: '1px solid rgba(37, 99, 235, 0.5)',
        _hover: {borderColor: 'primary', bg: 'action.hover'}
      },
      text: {color: 'primary', _hover: {bg: 'action.hover'}}
    },
    size: {
      small: {
        px: '4',
        py: '2',
        fontSize: '0.75rem',
        '--icon-size': '{sizes.icon.button.sm}'
      },
      medium: {
        px: '6',
        py: '3',
        fontSize: '0.875rem',
        '--icon-size': '{sizes.icon.button.md}'
      },
      large: {px: '8', py: '4', fontSize: '1rem', '--icon-size': '{sizes.icon.button.lg}'}
    },
    fullWidth: {true: {w: '100%'}}
  },
  defaultVariants: {variant: 'text', size: 'medium'}
})
