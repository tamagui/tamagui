import React from 'react'
import { useEvent } from '@tamagui/core'
import type { ReactNode } from 'react'

import type { SheetControllerContextValue } from './useSheetController'
import { SheetControllerContext } from './useSheetController'

export const SheetController = ({
  children,
  onOpenChange: onOpenChangeProp,
  ...value
}: Partial<SheetControllerContextValue> & { children?: ReactNode }) => {
  const onOpenChange = useEvent(onOpenChangeProp)

  const memoValue = React.useMemo(
    () => ({
      open: value.open,
      hidden: value.hidden,
      disableDrag: value.disableDrag,
      onOpenChange,
    }),
    [onOpenChange, value.open, value.hidden, value.disableDrag]
  )

  return (
    <SheetControllerContext.Provider value={memoValue}>
      {children}
    </SheetControllerContext.Provider>
  )
}
