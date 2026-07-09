import { styled } from '@tamagui/core'
import { XStack, YStack } from '@tamagui/stacks'

import {
  SHEET_BACKGROUND_NAME,
  SHEET_CONTAINER_NAME,
  SHEET_HANDLE_NAME,
  SHEET_OVERLAY_NAME,
} from './constants'
import { createSheet } from './createSheet'

export * from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetHandle
 * -----------------------------------------------------------------------------------------------*/

export const Handle = styled(XStack, {
  name: SHEET_HANDLE_NAME,

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
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * SheetOverlay
 * -----------------------------------------------------------------------------------------------*/

export const Overlay = styled(YStack, {
  name: SHEET_OVERLAY_NAME,

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        pointerEvents: 'none',
      },
    },

    unstyled: {
      false: {
        inset: 0,
        position: 'absolute',
        backgroundColor: '$background',
        zIndex: 100_000 - 1,
        pointerEvents: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * SheetContainer
 * -----------------------------------------------------------------------------------------------*/

export const Container = styled(YStack, {
  name: SHEET_CONTAINER_NAME,

  variants: {
    unstyled: {
      false: {
        flex: 1,
        position: 'relative',
        width: '100%',
        maxHeight: '100%',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * SheetBackground
 * -----------------------------------------------------------------------------------------------*/

export const Background = styled(YStack, {
  name: SHEET_BACKGROUND_NAME,

  variants: {
    unstyled: {
      false: {
        backgroundColor: '$background',
        borderTopLeftRadius: '$true',
        borderTopRightRadius: '$true',
        overflow: 'hidden',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export const Sheet = createSheet({
  Background,
  Container,
  Handle,
  Overlay,
})
