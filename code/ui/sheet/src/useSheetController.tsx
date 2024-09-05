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
  disableDrag?: boolean
  open?: boolean
  // hide without "closing" to prevent re-animation when shown again
  hidden?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}
