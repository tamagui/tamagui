import { stylePropsTextOnly, validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import { TamaguiTextElement, TextProps, TextPropsBase } from '../types'

const ellipseStyle = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export type Text = TamaguiTextElement

export const Text = createComponent<TextProps, Text, TextPropsBase>({
  acceptsClassName: true,
  isText: true,

  defaultProps:
    process.env.TAMAGUI_TARGET === 'web'
      ? {
          display: 'inline',
          boxSizing: 'border-box',
          wordWrap: 'break-word',
          margin: 0,
        }
      : {
          display: 'flex',
          suppressHighlighting: true,
        },

  inlineWhenUnflattened: new Set(['fontFamily']),

  variants: {
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      numberOfLines: {
        1: ellipseStyle,

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

    // ??
    ellipsizeMode: {
      '...': () => null,
    },

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

    ellipse: {
      true:
        process.env.TAMAGUI_TARGET === 'web'
          ? ellipseStyle
          : {
              numberOfLines: 1,
              lineBreakMode: 'clip',
            },
    },
  },

  deoptProps: new Set(process.env.TAMAGUI_TARGET === 'web' ? [] : ['ellipse']),

  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
  },
})
