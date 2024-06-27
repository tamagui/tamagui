import { createContext } from 'react'

export const ParentSheetContext = createContext({
  zIndex: 100_000,
})

export const SheetInsideSheetContext = createContext<
  ((hasChild: boolean) => void) | null
>(null)
