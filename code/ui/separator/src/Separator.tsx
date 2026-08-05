import { isWeb } from '@tamagui/constants'
import { View, styled } from '@tamagui/core'

// Unstyled Separator: orientation + layout + the collapsed 1px rule only (an
// invisible line, transparent by default). The theme line color lives in the
// tamagui skin (code/ui/tamagui/src/components/Separator.tsx).
export const Separator = styled(View, {
  name: 'Separator',
  ...(isWeb && {
    role: 'separator',
    // @ts-ignore
    'aria-orientation': 'horizontal',
    'data-orientation': 'horizontal',
  }),
  borderColor: 'transparent',
  flexShrink: 0,
  borderWidth: 0,
  flex: 1,
  height: 0,
  maxHeight: 0,
  borderBottomWidth: 1,
  y: -0.5,

  variants: {
    vertical: {
      true: {
        y: 0,
        x: -0.5,
        height: isWeb ? 'initial' : 'auto',
        // maxHeight auto WILL BE passed to style attribute, but for some reason not used?
        // almost seems like a react or browser bug, but for now `initial` works
        // also, it doesn't happen for `height`, but for consistency using the same values
        maxHeight: isWeb ? 'initial' : 'auto',
        width: 0,
        maxWidth: 0,
        borderBottomWidth: 0,
        borderRightWidth: 1,
        ...(isWeb && {
          // @ts-ignore
          'aria-orientation': 'vertical',
          'data-orientation': 'vertical',
        }),
      },
    },
  } as const,
})
