import React, { useId } from 'react'
import { useEvent } from '@tamagui/core'
import type { ReactNode } from 'react'

import type { SheetControllerContextValue } from './useSheetController'
import { SheetControllerContext } from './useSheetController'

export const SheetController = ({
  children,
  onOpenChange: onOpenChangeProp,
  open,
  hidden,
  disableDrag,
}: Partial<SheetControllerContextValue> & { children?: ReactNode }) => {
  const onOpenChange = useEvent(onOpenChangeProp)
  const id = useId()

  const memoValue = React.useMemo(
    () => ({
      id,
      open,
      hidden,
      disableDrag,
      onOpenChange,
    }),
    [id, onOpenChange, open, hidden, disableDrag]
  )

  return (
    <SheetControllerContext.Provider value={memoValue}>
      {children}
    </SheetControllerContext.Provider>
  )
}
