import {Box, Image, Text} from '@chakra-ui/react'
import {
  ALIGN,
  linkAttrs,
  opts,
  SHAPES,
  SIZES,
  str,
  UNITS,
  withCommon
} from '@platform/builder/fields'
import type {ElementDef} from '@platform/core/types/layout'

const TAGS = opts(
  ['h1', 'H1'],
  ['h2', 'H2'],
  ['h3', 'H3'],
  ['h4', 'H4'],
  ['h5', 'H5'],
  ['h6', 'H6'],
  ['p', 'Paragraph'],
  ['div', 'Div']
)
const HEADING_SIZE: Record<string, string> = {
  h1: '5xl',
  h2: '4xl',
  h3: '3xl',
  h4: '2xl',
  h5: 'xl',
  h6: 'lg'
}
const BUTTON_PAD: Record<string, [string, string]> = {
  xs: ['1', '3'],
  sm: ['2', '4'],
  md: ['3', '6'],
  lg: ['4', '8'],
  xl: ['5', '10']
}
const RADIUS: Record<string, string> = {square: '0', rounded: '8px', round: '999px'}
const JUSTIFY: Record<string, string> = {left: 'flex-start', center: 'center', right: 'flex-end'}

export const contentElements: ElementDef[] = [
  {
    type: 'text',
    name: 'Text block',
    category: 'Content',
    icon: 'Type',
    description: 'Rich text with headings, lists and links',
    editOnAdd: true,
    fields: withCommon({
      name: 'content',
      type: 'richtext',
      label: 'Text',
      default: '<p>I am a text block. Click edit to change this text.</p>'
    }),
    render: ({settings, attrs, editable, html}) => (
      <Box
        key={str(settings.content)}
        {...attrs}
        {...editable('content', 'rich')}
        className={`${attrs.className} lb-el lb-prose`}
        dangerouslySetInnerHTML={{__html: html(str(settings.content))}}
      />
    )
  },
  {
    type: 'heading',
    name: 'Heading',
    category: 'Content',
    icon: 'Heading',
    description: 'A title with its own font, size and colour',
    fields: withCommon(
      {name: 'text', type: 'textarea', label: 'Text', default: 'This is a heading', summary: true},
      {name: 'tag', type: 'select', label: 'Tag', options: TAGS, default: 'h2', half: true},
      {
        name: 'align',
        type: 'buttons',
        label: 'Alignment',
        options: ALIGN,
        default: 'left',
        half: true
      },
      {name: 'fontSize', type: 'number', label: 'Font size', units: UNITS, half: true},
      {name: 'lineHeight', type: 'number', label: 'Line height', step: 0.1, half: true},
      {name: 'color', type: 'color', label: 'Colour', half: true},
      {name: 'link', type: 'link', label: 'Link'}
    ),
    render: ({settings, attrs, editable}) => {
      const tag = str(settings.tag) || 'h2'
      const link = linkAttrs(settings.link)
      const text = str(settings.text)
      return (
        <Box
          as={tag as 'h2'}
          {...attrs}
          className={`${attrs.className} lb-el`}
          fontFamily="heading"
          fontWeight="medium"
          lineHeight={settings.lineHeight ? Number(settings.lineHeight) : 'shorter'}
          fontSize={str(settings.fontSize) || HEADING_SIZE[tag] || 'md'}
          textAlign={str(settings.align) as 'left'}
          style={{color: str(settings.color) || undefined, whiteSpace: 'pre-line'}}
        >
          {link ? (
            <a {...link}>
              <span key={text} {...editable('text')}>
                {text}
              </span>
            </a>
          ) : (
            <span key={text} {...editable('text')}>
              {text}
            </span>
          )}
        </Box>
      )
    }
  },
  {
    type: 'button',
    name: 'Button',
    category: 'Content',
    icon: 'RectangleHorizontal',
    description: 'A link styled as a button',
    fields: withCommon(
      {name: 'label', type: 'text', label: 'Text', default: 'Text on the button', summary: true},
      {name: 'link', type: 'link', label: 'URL (link)'},
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        options: opts(
          ['solid', 'Solid'],
          ['outline', 'Outline'],
          ['flat', 'Flat'],
          ['custom', 'Custom colours']
        ),
        default: 'solid',
        half: true
      },
      {
        name: 'shape',
        type: 'select',
        label: 'Shape',
        options: SHAPES,
        default: 'rounded',
        half: true
      },
      {name: 'size', type: 'buttons', label: 'Size', options: SIZES, default: 'md'},
      {name: 'align', type: 'buttons', label: 'Alignment', options: ALIGN, default: 'left'},
      {name: 'fullWidth', type: 'toggle', label: 'Full width'},
      {
        name: 'background',
        type: 'color',
        label: 'Background',
        half: true,
        showIf: {field: 'style', equals: 'custom'}
      },
      {
        name: 'textColor',
        type: 'color',
        label: 'Text colour',
        half: true,
        showIf: {field: 'style', equals: 'custom'}
      }
    ),
    render: ({settings, attrs, editable}) => {
      const style = str(settings.style) || 'solid'
      const [py, px] = BUTTON_PAD[str(settings.size) || 'md'] || BUTTON_PAD.md
      const link = linkAttrs(settings.link)
      return (
        <Box
          {...attrs}
          className={`${attrs.className} lb-el`}
          display="flex"
          justifyContent={JUSTIFY[str(settings.align)] || 'flex-start'}
        >
          <Box
            as="a"
            {...(link || {})}
            display="inline-flex"
            justifyContent="center"
            w={settings.fullWidth ? 'full' : undefined}
            py={py}
            px={px}
            fontWeight="medium"
            borderWidth="2px"
            borderColor={style === 'flat' ? 'transparent' : 'brand.solid'}
            bg={style === 'solid' ? 'brand.solid' : 'transparent'}
            color={style === 'solid' ? 'brand.contrast' : 'brand.fg'}
            textDecoration="none"
            style={{
              borderRadius: RADIUS[str(settings.shape) || 'rounded'],
              ...(style === 'custom'
                ? {
                    background: str(settings.background),
                    color: str(settings.textColor),
                    borderColor: 'transparent'
                  }
                : {})
            }}
          >
            <span key={str(settings.label)} {...editable('label', 'line')}>
              {str(settings.label)}
            </span>
          </Box>
        </Box>
      )
    }
  },
  {
    type: 'image',
    name: 'Single image',
    category: 'Content',
    icon: 'Image',
    description: 'One image with a caption and link',
    editOnAdd: true,
    fields: withCommon(
      {name: 'image', type: 'image', label: 'Image'},
      {
        name: 'alt',
        type: 'text',
        label: 'Alternative text',
        help: 'Describes the image for screen readers.'
      },
      {name: 'caption', type: 'text', label: 'Caption'},
      {name: 'align', type: 'buttons', label: 'Alignment', options: ALIGN, default: 'left'},
      {name: 'width', type: 'number', label: 'Width', units: ['%', 'px'], half: true},
      {
        name: 'shape',
        type: 'select',
        label: 'Style',
        options: opts(
          ['', 'Default'],
          ['rounded', 'Rounded'],
          ['circle', 'Circle'],
          ['border', 'Border'],
          ['shadow', 'Shadow']
        ),
        half: true
      },
      {name: 'link', type: 'link', label: 'Link'}
    ),
    render: ({settings, attrs, editable, url}) => {
      const src = url(str(settings.image))
      const shape = str(settings.shape)
      const link = linkAttrs(settings.link)
      const img = src ? (
        <Image
          src={src}
          alt={str(settings.alt)}
          w={str(settings.width) || undefined}
          maxW="full"
          borderRadius={shape === 'rounded' ? 'lg' : shape === 'circle' ? 'full' : undefined}
          borderWidth={shape === 'border' ? '4px' : undefined}
          borderColor="border"
          boxShadow={shape === 'shadow' ? 'lift' : undefined}
        />
      ) : (
        <Box h="40" bg="bg.muted" borderRadius="md" />
      )
      return (
        <Box
          as="figure"
          {...attrs}
          className={`${attrs.className} lb-el`}
          m="0"
          textAlign={str(settings.align) as 'left'}
        >
          {link ? <a {...link}>{img}</a> : img}
          {settings.caption ? (
            <Text
              key={str(settings.caption)}
              as="figcaption"
              mt="2"
              fontSize="sm"
              color="fg.muted"
              {...editable('caption', 'line')}
            >
              {str(settings.caption)}
            </Text>
          ) : null}
        </Box>
      )
    }
  },
  {
    type: 'spacer',
    name: 'Empty space',
    category: 'Content',
    icon: 'MoveVertical',
    description: 'Blank space of a set height',
    fields: withCommon({
      name: 'height',
      type: 'number',
      label: 'Height',
      units: ['px', 'rem', 'vh'],
      default: '32px'
    }),
    render: ({settings, attrs}) => (
      <div
        {...attrs}
        className={`${attrs.className} lb-el`}
        style={{height: str(settings.height) || '32px'}}
      />
    )
  },
  {
    type: 'separator',
    name: 'Separator',
    category: 'Content',
    icon: 'Minus',
    description: 'A horizontal line',
    fields: withCommon(
      {
        name: 'style',
        type: 'select',
        label: 'Style',
        options: opts(
          ['solid', 'Line'],
          ['dashed', 'Dashed'],
          ['dotted', 'Dotted'],
          ['double', 'Double']
        ),
        default: 'solid',
        half: true
      },
      {name: 'color', type: 'color', label: 'Colour', half: true},
      {
        name: 'thickness',
        type: 'number',
        label: 'Thickness',
        units: ['px'],
        default: '1px',
        half: true
      },
      {
        name: 'width',
        type: 'range',
        label: 'Width (%)',
        min: 10,
        max: 100,
        step: 10,
        default: 100,
        half: true
      },
      {name: 'align', type: 'buttons', label: 'Alignment', options: ALIGN, default: 'center'}
    ),
    render: ({settings, attrs}) => {
      const align = str(settings.align) || 'center'
      return (
        <Box
          as="hr"
          {...attrs}
          className={`${attrs.className} lb-el`}
          border="0"
          borderTopColor="border"
          style={{
            borderTopStyle: (str(settings.style) || 'solid') as 'solid',
            borderTopWidth: str(settings.thickness) || '1px',
            borderTopColor: str(settings.color) || undefined,
            width: `${Number(settings.width) || 100}%`,
            marginLeft: align === 'left' ? 0 : 'auto',
            marginRight: align === 'right' ? 0 : 'auto'
          }}
        />
      )
    }
  },
  {
    type: 'html',
    name: 'Raw HTML',
    category: 'Structure',
    icon: 'Code',
    description: 'Your own HTML; scripts, styles, frames and forms are removed',
    editOnAdd: true,
    fields: withCommon({
      name: 'html',
      type: 'code',
      label: 'HTML',
      default: '<p>Your HTML here.</p>'
    }),
    // The CMS removes scripts, frames, styles and event handlers when it saves the page.
    render: ({settings, attrs, html}) => (
      <div
        {...attrs}
        className={`${attrs.className} lb-el`}
        dangerouslySetInnerHTML={{__html: html(str(settings.html))}}
      />
    )
  }
]
