import { Stack, StackProps, styled } from '@tamagui/core'

// TODO merge w InteractiveFrame

export const InteractiveContainer = styled(Stack, {
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: '$borderColor',
  overflow: 'hidden',
  borderRadius: '$2',
  hoverStyle: {
    borderColor: '$borderColor2',
  },
})
