import { View, styled, Text } from '@tamagui/core'

export const MyStack = styled(View, {
  backgroundColor: 'green',
})

export const MySizableText = styled(Text, {
  name: 'MySizableText',
  backgroundColor: 'green',
})

const MyScaledText = styled(Text, {
  variants: {
    scale: {
      sm: { fontSize: 24 },
      md: { fontSize: 35 },
      lg: { fontSize: 58 },
    },
  } as const,
})

// a variant whose values carry media blocks, and those media blocks set
// another variant (`scale`). exercises the compiler resolving variants nested
// inside media inside variants.
export const MyMediaVariantText = styled(MyScaledText, {
  name: 'MyMediaVariantText',
  fontWeight: '200',
  scale: 'sm',
  $lg: { scale: 'md' },

  variants: {
    strength: {
      large: {
        scale: 'md',
        fontWeight: '800',
        $lg: { scale: 'lg', fontWeight: '800' },
      },
    },
  } as const,
})
