import { useMedia } from '@tamagui/core'

import { SelectContextValue, SelectedItemContext } from './types'

export const useSelectBreakpointActive = (
  sheetBreakpoint: SelectContextValue['sheetBreakpoint']
) => {
  const media = useMedia()
  return sheetBreakpoint ? media[sheetBreakpoint] : false
}

export const useShowSelectSheet = (
  context: SelectContextValue,
  itemContext: SelectedItemContext
) => {
  const breakpointActive = useSelectBreakpointActive(context.sheetBreakpoint)
  return itemContext.open === false ? false : breakpointActive
}
