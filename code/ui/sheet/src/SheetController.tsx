import React, { useId, useRef } from 'react'
import { useEvent } from '@tamagui/core'
import type { ReactNode } from 'react'

import type { SheetControllerContextValue } from './useSheetController'
import { SheetControllerContext } from './useSheetController'

export const SheetController = ({
  children,
  onOpenChange: onOpenChangeProp,
  onAnimationComplete: onAnimationCompleteProp,
  open,
  hidden,
  disableDrag,
  scope = '',
}: Partial<SheetControllerContextValue> & { children?: ReactNode; scope?: string }) => {
  const onOpenChange = useEvent(onOpenChangeProp)
  const onAnimationComplete = useEvent(onAnimationCompleteProp)
  const id = useId()

  // track hidden transitions to signal adapt handoff
  // when hidden goes from true -> false while open, the sheet should skip animation
  const wasHiddenRef = useRef(hidden)
  let skipNextAnimation = false
  if (wasHiddenRef.current && !hidden && open) {
    skipNextAnimation = true
  }
  wasHiddenRef.current = hidden

  const memoValue = React.useMemo(
    () => ({
      id,
      open,
      hidden,
      disableDrag,
      onOpenChange,
      onAnimationComplete,
      skipNextAnimation,
    }),
    [id, onOpenChange, onAnimationComplete, open, hidden, disableDrag, skipNextAnimation]
  )

  return (
    <SheetControllerContext.Provider scope={scope} {...memoValue}>
      {children}
    </SheetControllerContext.Provider>
  )
}
