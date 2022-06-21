import { stylePropsTextOnly, validStyles } from '@tamagui/helpers'
import { Text as TextView } from 'react-native'

import { isWeb } from '../constants/platform'
import { createComponent } from '../createComponent'
import { TextProps, TextPropsBase } from '../types'

const ellipseStyle = {
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export const Text = createComponent<TextProps, TextView, TextPropsBase>({
  componentName: 'Text',
  isText: true,

  defaultProps: {
    display: 'flex',
    fontFamily: 'System',
    ...(isWeb && {
      display: 'inline',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
    }),
  },

  variants: {
    numberOfLines: {
      1: isWeb ? ellipseStyle : { numberOfLines: 1 },

      ':number': (numberOfLines) =>
        isWeb
          ? numberOfLines >= 1
            ? { WebkitLineClamp: numberOfLines }
            : null
          : { numberOfLines },
    },

    selectable: {
      true: {
        userSelect: 'text',
        cursor: 'text',
      },
      false: {
        userSelect: 'none',
        cursor: 'inherit',
      },
    },

    pressable: {
      true: {
        cursor: 'pointer',
      },
    },

    ellipse: {
      true: isWeb
        ? ellipseStyle
        : {
            numberOfLines: 1,
            lineBreakMode: 'clip',
          },
    },
  },

  deoptProps: new Set(isWeb ? [] : ['ellipse']),

  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
  },
})
