import type React from 'react'
import { createStyledContext, type StyledContext } from '@tamagui/core'

import type { SheetTransitionEvent } from './types'

export const useSheetController = (scope?: string) => {
  const controller = SheetControllerContext.useStyledContext(
    scope
  ) as SheetControllerContextValue | null
  const isHidden = controller?.hidden
  const isShowingNonSheet = isHidden && controller?.open
  return {
    controller,
    isHidden,
    isShowingNonSheet,
    disableDrag: controller?.disableDrag,
  }
}

export const SheetControllerContext = createStyledContext<SheetControllerContextValue>(
  null as any,
  'SheetController__'
) as StyledContext<SheetControllerContextValue> &
  React.Context<SheetControllerContextValue | null>

export type SheetControllerContextValue = {
  id?: string
  disableDrag?: boolean
  open?: boolean
  // hide without "closing" to prevent re-animation when shown again
  hidden?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
  // fired by the sheet at the start/end of its position transition. used by
  // Dialog adapt to know when it's safe to tear down adapted children
  // without cutting off the slide-out mid-animation.
  onTransition?: (e: SheetTransitionEvent) => void
  // when true, the sheet should skip its open animation (used for adapt handoff)
  skipNextAnimation?: boolean
}
