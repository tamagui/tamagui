import { styled } from '@tamagui/core'
import { ThemeableStack, XStack, YStack } from '@tamagui/stacks'

import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from './constants'
import { createSheet } from './createSheet'

export { createSheetScope } from './SheetContext'
export * from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetHandle
 * -----------------------------------------------------------------------------------------------*/

export const Handle = styled(
  XStack,
  {
    variants: {
      open: {
        true: {
          pointerEvents: 'auto',
        },
        false: {
          opacity: 0,
          pointerEvents: 'none',
        },
      },

      unstyled: {
        false: {
          height: 10,
          borderRadius: 100,
          backgroundColor: '$background',
          zIndex: 10,
          marginHorizontal: '35%',
          marginBottom: '$2',
          opacity: 0.5,

          hoverStyle: {
            opacity: 0.7,
          },
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: SHEET_HANDLE_NAME,
  }
)

/* -------------------------------------------------------------------------------------------------
 * SheetOverlay
 * -----------------------------------------------------------------------------------------------*/

export const Overlay = styled(
  ThemeableStack,
  {
    variants: {
      open: {
        true: {
          opacity: 1,
          pointerEvents: 'auto',
        },
        false: {
          opacity: 0,
          pointerEvents: 'none',
        },
      },

      unstyled: {
        false: {
          fullscreen: true,
          position: 'absolute',
          backgrounded: true,
          zIndex: 100_000 - 1,
          pointerEvents: 'auto',
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: SHEET_OVERLAY_NAME,
  }
)

/* -------------------------------------------------------------------------------------------------
 * Sheet
 * -----------------------------------------------------------------------------------------------*/

export const Frame = styled(
  YStack,
  {
    variants: {
      unstyled: {
        false: {
          flex: 1,
          backgroundColor: '$background',
          borderTopLeftRadius: '$true',
          borderTopRightRadius: '$true',
          width: '100%',
          maxHeight: '100%',
          overflow: 'hidden',
        },
      },
    } as const,

    defaultVariants: {
      unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
    },
  },
  {
    name: SHEET_NAME,
  }
)

export const Sheet = createSheet({
  Frame,
  Handle,
  Overlay,
})

/** @deprecated use Overlay instead  */
export const SheetOverlayFrame = Overlay

/** @deprecated use Overlay instead  */
export const SheetHandleFrame = Handle
