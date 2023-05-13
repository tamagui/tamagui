import { createContext, useContext } from 'react'

export const useSheetController = () => {
  const controller = useContext(SheetControllerContext)
  const isHidden = controller?.hidden
  const isShowingNonSheet = isHidden && controller?.open
  return {
    controller,
    isHidden,
    isShowingNonSheet,
    disableDrag: controller?.disableDrag,
  }
}

export const SheetControllerContext = createContext<SheetControllerContextValue | null>(
  null
)

export type SheetControllerContextValue = {
  disableDrag?: boolean
  open?: boolean
  // hide without "closing" to prevent re-animation when shown again
  hidden?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}
