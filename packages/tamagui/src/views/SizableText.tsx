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
        const lh = +val * (Math.log(Math.max(1.5, val)) * 0.08 + 1.3)
        return {
          fontSize: fs,
          lineHeight: lh,
        }
      },
    },
  },
})

export type SizableTextProps = GetProps<typeof SizableText>
