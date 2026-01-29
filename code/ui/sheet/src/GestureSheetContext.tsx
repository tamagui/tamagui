import type React from 'react'
import { createContext, useContext, type RefObject } from 'react'

export interface GestureSheetContextValue {
  /**
   * The sheet's pan gesture object, used for simultaneousHandlers
   * in ScrollView to coordinate gestures
   */
  panGesture: any | null
  /**
   * Ref to the pan gesture for simultaneousHandlers prop
   */
  panGestureRef: RefObject<any> | null
  /**
   * Whether the sheet is currently being dragged by the user
   */
  isDragging: boolean
  /**
   * Set whether panning should be blocked (e.g., when scrolling)
   */
  setBlockPan: (blocked: boolean) => void
  /**
   * Whether pan gesture is currently blocked
   */
  blockPan: boolean
}

const GestureSheetContext = createContext<GestureSheetContextValue | null>(null)

export function useGestureSheetContext(): GestureSheetContextValue | null {
  return useContext(GestureSheetContext)
}

export interface GestureSheetProviderProps {
  children: React.ReactNode
  isDragging: boolean
  blockPan: boolean
  setBlockPan: (blocked: boolean) => void
  panGesture: any | null
  panGestureRef: RefObject<any> | null
}

export function GestureSheetProvider({
  children,
  isDragging,
  blockPan,
  setBlockPan,
  panGesture,
  panGestureRef,
}: GestureSheetProviderProps) {
  const value: GestureSheetContextValue = {
    panGesture,
    panGestureRef,
    isDragging,
    blockPan,
    setBlockPan,
  }

  return (
    <GestureSheetContext.Provider value={value}>{children}</GestureSheetContext.Provider>
  )
}
