import { createContext } from 'react'

import { IPopperProps } from './types'

export type PopperContext = Omit<IPopperProps, 'children'> & {
  triggerRef: any
  onClose: any
  setOverlayRef?: (overlayRef: any) => void
}
export const PopperContext = createContext<PopperContext | null>(null)
