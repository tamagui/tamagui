import { isWeb } from '../constants/platform'
import { createComponent } from '../createComponent'
import { stylePropsTextOnly, validStyles } from '../static'
import { TextProps } from '../types'

export const Text = createComponent<TextProps>({
  isText: true,
  defaultProps: {
    // TODO align with rnw... there are no good solutions here
    display: isWeb ? 'inline' : 'flex',
    boxSizing: 'border-box',
    fontFamily: 'System',
    wordWrap: 'break-word',
  },
  variants: {
    numberOfLines: {
      // TODO imply fn, test 1, could do types `>1` `<2`
      number: (lines) => (lines > 1 ? { WebkitLineClamp: 1 } : null),
      1: {
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },

    selectable: {
      true: {
        userSelect: 'text',
      },
      false: {
        userSelect: 'none',
      },
    },

    pressable: {
      true: {
        cursor: 'pointer',
      },
    },

    ellipse: {
      true: isWeb
        ? {
            display: 'inline-block',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        : {
            numberOfLines: 1,
            lineBreakMode: 'clip',
          },
    },
  },
  // TODO document
  deoptProps: new Set(isWeb ? [] : ['ellipse']),
  validStyles: {
    ...validStyles,
    ...stylePropsTextOnly,
    ...(isWeb && {
      userSelect: true,
      textOverflow: true,
      whiteSpace: true,
      wordWrap: true,
      selectable: true,
      cursor: true,
    }),
  },
})
