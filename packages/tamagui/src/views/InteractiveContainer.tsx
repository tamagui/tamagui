import { Stack, styled } from '@tamagui/core'

export const InteractiveContainer = styled(Stack, {
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: '$borderColor',
  overflow: 'hidden',
  borderRadius: '$3',
  hoverStyle: {
    borderColor: '$borderColorHover',
  },
})
