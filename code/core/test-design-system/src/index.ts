import { View, styled, Text } from '@tamagui/core'

export const MyStack = styled(View, {
  backgroundColor: 'green',
})

export const MySizableText = styled(Text, {
  displayName: 'MySizableText',
  backgroundColor: 'green',
})

// a variant whose value carries a media clause. this is the v3 flat-value form
// of the nested media object used by the v2 regression fixture.
export const MyMediaVariantText = styled(Text, {
  displayName: 'MyMediaVariantText',
  fontWeight: '200',
  fontSize: '24px lg:35px',

  variants: {
    strength: {
      large: {
        fontSize: '35px lg:58px',
        fontWeight: '800',
      },
    },
  } as const,
})
