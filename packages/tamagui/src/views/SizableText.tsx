import { GetProps, Text, Variable, styled } from '@tamagui/core'

export const SizableText = styled(Text, {
  variants: {
    size: {
      // TODO this should be ...fontSize type not working
      '...size': (val, { tokens, props }) => {
        const family = (
          typeof props.fontFamily === 'string'
            ? props.fontFamily
            : props.fontFamily instanceof Variable
            ? props.fontFamily.val
            : props.fontFamily || '$body'
        ) as any
        const font = tokens.font[family]
        const fontFamily = font.family
        const fontSize = props.fontSize || font.size[val]
        const lineHeight = props.lineHeight || font.lineHeight[val]
        const fontWeight = props.fontWeight || font.weight[val]
        const letterSpacing = props.letterSpacing || font.letterSpacing[val]
        if (fontSize instanceof Variable) {
          return {
            fontFamily,
            fontWeight,
            letterSpacing,
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
