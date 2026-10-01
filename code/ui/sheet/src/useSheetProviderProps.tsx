import { useConfiguration } from '@tamagui/core'
import { useConstant } from '@tamagui/use-constant'

import type { ScrollBridge, SheetProps } from './types'
import type { SheetOpenState } from './useSheetOpenState'
import { useSheetState } from './useSheetState'

export type SheetContextValue =
  | (ReturnType<typeof useSheetProviderProps> & {
      keyboardOccludedHeight: number
      isKeyboardVisible: boolean
      keyboardStableFrameHeight: number
      setHasScrollView: (val: boolean) => void
    })
  | (Omit<ReturnType<typeof useSheetState>, 'maxContentSize'> & {
      onlyShowContainer: true
      scrollBridge?: undefined
    })

export function useSheetProviderProps(props: SheetProps, state: SheetOpenState) {
  const { maxContentSize, ...sheetState } = useSheetState(props, state)
  const { frameSize, snapPointsMode, snapPoints, open } = sheetState

  const { animationDriver } = useConfiguration()
  if (!animationDriver) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌ 008`
        : 'Must set animations in tamagui.config.ts',
    )
  }

  const scrollBridge = useConstant<ScrollBridge>(() => {
    const parentDragListeners = new Set<Function>()

    const bridge: ScrollBridge = {
      hasScrollableContent: false,
      enabled: false,
      y: 0,
      paneY: 0,
      paneMinY: 0,
      scrollStartY: -1,
      drag: () => {},
      release: () => {},
      scrollLock: false,
      isParentDragging: false,
      onParentDragging: (cb) => {
        parentDragListeners.add(cb)
        return () => {
          parentDragListeners.delete(cb)
        }
      },
      setParentDragging: (val) => {
        if (val !== bridge.isParentDragging) {
          bridge.isParentDragging = val
          parentDragListeners.forEach((cb) => cb(val))
        }
      },
    }

    return bridge
  })

  const disableRemoveScroll = props.disableRemoveScroll || !open || !props.modal

  const maxSnapPoint = snapPoints[0]
  const screenSize =
    snapPointsMode === 'percent'
      ? frameSize / ((typeof maxSnapPoint === 'number' ? maxSnapPoint : 100) / 100)
      : maxContentSize

  return {
    ...sheetState,
    screenSize,
    maxSnapPoint,
    disableRemoveScroll,
    scrollBridge,
    onlyShowContainer: false as const,
  }
}
