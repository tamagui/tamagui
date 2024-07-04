import { Text, styled } from '@tamagui/web'

export const VisuallyHidden = styled(Text, {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  zIndex: -10000,
  overflow: 'hidden',
  opacity: 0.00000001,
  pointerEvents: 'none',

  variants: {
    preserveDimensions: {
      true: {
        position: 'relative',
        width: 'auto',
        height: 'auto',
      },
    },

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
  } as const,
})

// @tamgui/core checks for this in spacing
VisuallyHidden['isVisuallyHidden'] = true
