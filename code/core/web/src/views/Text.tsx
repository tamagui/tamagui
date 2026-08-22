import { stylePropsTextOnly, validStyles } from '@tamagui/helpers'

import { createComponent } from '../createComponent'
import { setComponentDisplayName } from '../helpers/componentDisplayName'
import type {
  StaticConfig,
  TamaguiTextElement,
  TextNonStyleProps,
  TextProps,
  TextStylePropsBase,
} from '../types'

export type Text = TamaguiTextElement

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

/**
 * Shared by every frontend's Text — see the note on `viewStaticConfig`.
 */
export const textStaticConfig: StaticConfig = {
  acceptsClassName: true,
  isText: true,

  defaultProps:
    process.env.TAMAGUI_TARGET === 'web'
      ? undefined
      : {
          suppressHighlighting: true,
        },

  inlineProps: new Set(['maxFontSizeMultiplier']),

  variants: {
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      numberOfLines: {
        1: ellipsisStyle,

        number: (numberOfLines) =>
          numberOfLines >= 1
            ? {
                maxWidth: '100%',
                WebkitLineClamp: numberOfLines,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
                overflow: 'hidden',
              }
            : null,
      },
    }),

    ellipsis: {
      true: ellipsisStyle,
    },
  },

  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
  },
}

export const Text = setComponentDisplayName(
  createComponent<TextProps, Text, TextNonStyleProps, TextStylePropsBase>(
    textStaticConfig
  ),
  'Text'
)
