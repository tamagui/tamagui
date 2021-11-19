import { Stack, styled } from '@tamagui/core'

export const VisuallyHidden = styled(Stack, {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  zIndex: -10000,
  overflow: 'hidden',
  opacity: 0.0001,
  pointerEvents: 'none',
})

// @tamgui/core checks for this in spacing
VisuallyHidden['isVisuallyHidden'] = true
