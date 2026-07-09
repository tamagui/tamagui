import { useAdaptTarget } from '@tamagui/adapt'
import React from 'react'
import { useControllableState } from '@tamagui/use-controllable-state'

import type { SheetProps } from './types'
import type { SheetControllerContextValue } from './useSheetController'
import { useSheetController } from './useSheetController'

export const useSheetOpenState = (props: SheetProps) => {
  const adapt = useAdaptTarget()
  const {
    isHidden: controllerIsHidden,
    controller: legacyController,
  } = useSheetController(props.scope)
  const shouldUseAdapt = Boolean(
    adapt && (adapt.open !== undefined || adapt.onOpenChange)
  )
  const isHidden = shouldUseAdapt ? adapt?.handoff.hidden : controllerIsHidden
  const wasHiddenRef = React.useRef(isHidden)
  const localSkipNextAnimation = Boolean(wasHiddenRef.current && !isHidden && adapt?.open)
  const skipNextAnimation =
    (shouldUseAdapt ? adapt?.handoff.skipNextAnimation : undefined) ??
    localSkipNextAnimation

  wasHiddenRef.current = isHidden

  const adaptController = React.useMemo<SheetControllerContextValue | null>(() => {
    if (!adapt || !shouldUseAdapt) return null

    return {
      open: adapt.open,
      hidden: adapt.handoff.hidden,
      onOpenChange: adapt.onOpenChange,
      onAnimationComplete: adapt.handoff.onAnimationComplete,
      skipNextAnimation,
    }
  }, [adapt, shouldUseAdapt, skipNextAnimation])

  const controller = adaptController ?? legacyController
  const controllerOpen = shouldUseAdapt ? adapt?.open : legacyController?.open
  const controllerOnOpenChange =
    (shouldUseAdapt ? adapt?.onOpenChange : undefined) ??
    legacyController?.onOpenChange

  const onOpenChangeInternal = (val: boolean) => {
    controllerOnOpenChange?.(val)
    props.onOpenChange?.(val)
  }

  const propVal = props.preferAdaptParentOpenState
    ? (controllerOpen ?? props.open)
    : (props.open ?? controllerOpen)

  const [open, setOpen] = useControllableState({
    prop: propVal,
    defaultProp: props.defaultOpen ?? false,
    onChange: onOpenChangeInternal,
    strategy: 'most-recent-wins',
  })

  return {
    open,
    setOpen,
    isHidden,
    controller,
  }
}

export type SheetOpenState = ReturnType<typeof useSheetOpenState>
