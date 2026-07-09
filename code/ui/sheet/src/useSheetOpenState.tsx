import { useAdaptContext, useAdaptTarget } from '@tamagui/adapt'
import React from 'react'
import { useControllableState } from '@tamagui/use-controllable-state'

import type { SheetProps } from './types'
import type { SheetControllerContextValue } from './useSheetController'
import { useSheetController } from './useSheetController'

export const useSheetOpenState = (props: SheetProps) => {
  const adaptContext = useAdaptContext()
  const adapt = useAdaptTarget()
  const { isHidden: controllerIsHidden, controller: legacyController } =
    useSheetController(props.scope)
  const shouldUseAdapt = Boolean(
    adaptContext.open !== undefined || adaptContext.onOpenChange
  )
  // Dialog no longer mounts SheetController while Adapt is inactive, so the
  // hidden state must come from the Adapt parent context even before a target
  // can register through useAdaptTarget().
  const isHidden = shouldUseAdapt ? !adaptContext.active : controllerIsHidden
  const wasHiddenRef = React.useRef(isHidden)
  // when the adapt target is exiting (media flipped off while the dialog stays
  // open), Adapt keeps `active` true so the sheet stays mounted, and signals
  // the close through handoff.hidden: drive the sheet's open state to false so
  // it plays its exit animation and reports onAnimationComplete back to Adapt
  const controllerOpen = shouldUseAdapt
    ? Boolean(adaptContext.open) && !adaptContext.handoff.hidden
    : legacyController?.open
  const localSkipNextAnimation = Boolean(
    wasHiddenRef.current && !isHidden && controllerOpen
  )
  const skipNextAnimation =
    (shouldUseAdapt ? adapt?.handoff.skipNextAnimation : undefined) ??
    localSkipNextAnimation

  wasHiddenRef.current = isHidden

  const adaptController = React.useMemo<SheetControllerContextValue | null>(() => {
    if (!adapt || !shouldUseAdapt) return null

    return {
      open: adaptContext.open,
      hidden: isHidden,
      onOpenChange: adaptContext.active ? adaptContext.onOpenChange : undefined,
      onAnimationComplete: adapt?.handoff.onAnimationComplete,
      skipNextAnimation,
    }
  }, [adapt, adaptContext, isHidden, shouldUseAdapt, skipNextAnimation])

  const controller = adaptController ?? legacyController
  const controllerOnOpenChange =
    (shouldUseAdapt && adaptContext.active ? adaptContext.onOpenChange : undefined) ??
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
