import { View, styled } from '@tamagui/core'

const DynamicResolverStackBase = styled(View, {
  variants: {
    scale: styled.dynamic<number>((value) => ({
      width: value,
      height: value,
    })),
    tone: styled.dynamic<'neutral' | 'critical'>(),
  },
}).resolve((props) => ({
  backgroundColor: props.tone === 'critical' ? 'red' : 'green',
  opacity: props.id === 'dim' ? 0.5 : undefined,
  padding: 8,
}))

export const DynamicResolverStack = DynamicResolverStackBase.resolve(() => ({
  padding: 12,
}))
