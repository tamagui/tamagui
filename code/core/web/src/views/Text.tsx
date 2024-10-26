import { stylePropsTextOnly, validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import type {
  TamaguiTextElement,
  TextNonStyleProps,
  TextProps,
  TextStylePropsBase,
} from '../types'

export type Text = TamaguiTextElement

const defaultWebStyle = {
  display: 'inline', // display: inline breaks css transform styles
  boxSizing: 'border-box',
  wordWrap: 'break-word',
  whiteSpace: 'pre-wrap',
  margin: 0,
}

const ellipsisStyle =
  process.env.TAMAGUI_TARGET === 'web'
    ? {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    : {
        numberOfLines: 1,
        lineBreakMode: 'clip',
      }

export const Text = createComponent<
  TextProps,
  Text,
  TextNonStyleProps,
  TextStylePropsBase
>({
  acceptsClassName: true,
  isText: true,

  defaultProps: {
    fontFamily: 'unset',
    ...(process.env.TAMAGUI_TARGET === 'web'
      ? defaultWebStyle
      : {
          position: 'static',
          suppressHighlighting: true,
        }),
  },

  inlineWhenUnflattened: new Set(['fontFamily']),

  variants: {
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      numberOfLines: {
        1: ellipsisStyle,

        ':number': (numberOfLines) =>
          numberOfLines >= 1
            ? {
                WebkitLineClamp: numberOfLines,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
                overflow: 'hidden',
              }
            : null,
      },
    }),

    ...(process.env.TAMAGUI_TARGET === 'web' && {
      selectable: {
        true: {
          userSelect: 'text',
          cursor: 'text',
        },
        false: {
          userSelect: 'none',
          cursor: 'default',
        },
      },
    }),

    /**
     * @deprecated Use ellipsis instead
     */
    ellipsis: {
      true: ellipsisStyle,
    },

    ellipsis: {
      true: ellipsisStyle,
    },
  },

  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
  },
})

Text['displayName'] = 'Text'
