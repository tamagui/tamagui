import React from 'react'

export const useSheetController = () => {
  const controller = React.useContext(SheetControllerContext)
  const isHidden = controller?.hidden
  const isShowingNonSheet = isHidden && controller?.open
  return {
    controller,
    isHidden,
    isShowingNonSheet,
    disableDrag: controller?.disableDrag,
  }
}

export const SheetControllerContext =
  React.createContext<SheetControllerContextValue | null>(null)

export type SheetControllerContextValue = {
  id?: string
  disableDrag?: boolean
  open?: boolean
  // hide without "closing" to prevent re-animation when shown again
  hidden?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
  // fired by the sheet after its open/close animation finishes. used by
  // Dialog adapt to know when it's safe to tear down adapted children
  // without cutting off the slide-out mid-animation.
  onAnimationComplete?: (state: { open: boolean }) => void
  // when true, the sheet should skip its open animation (used for adapt handoff)
  skipNextAnimation?: boolean
}
