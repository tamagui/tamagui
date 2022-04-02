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

  variants: {
    visible: {
      true: {
        position: 'relative',
        width: 'auto',
        height: 'auto',
        margin: 0,
        zIndex: 1,
        overflow: 'visible',
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  },
})

// @tamgui/core checks for this in spacing
VisuallyHidden['isVisuallyHidden'] = true
