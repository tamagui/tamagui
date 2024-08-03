import React from 'react'

export const ParentSheetContext = React.createContext({
  zIndex: 100_000,
})

export const SheetInsideSheetContext = React.createContext<
  ((hasChild: boolean) => void) | null
>(null)
