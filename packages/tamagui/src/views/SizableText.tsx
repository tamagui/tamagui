import { Text, Variable, styled } from '@tamagui/core'

import { GetProps } from '../../types'

export const SizableText = styled(Text, {
  variants: {
    size: {
      '...size': (val, { tokens }) => {
        const fontSize = tokens.fontSize[val]
        const lineHeight = tokens.lineHeight[val]
        if (fontSize instanceof Variable) {
          return {
            fontSize,
            lineHeight,
          }
        }
        const fs = +val
        // TODO can have props.sizeLineHeight
        const lh = +val * (Math.log(Math.max(1.6, val)) * 0.01 + 1.1)
        return {
          fontSize: fs,
          lineHeight: lh,
        }
      },
    },
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
