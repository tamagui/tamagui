import { useMedia } from '@tamagui/core'

import { SelectContextValue } from './types'

export const useSelectBreakpointActive = (
  sheetBreakpoint: SelectContextValue['sheetBreakpoint'],
) => {
  const media = useMedia()
  return sheetBreakpoint ? media[sheetBreakpoint] : false
}

export const useShowSelectSheet = (context: SelectContextValue) => {
  const breakpointActive = useSelectBreakpointActive(context.sheetBreakpoint)
  return context.open === false ? false : breakpointActive
}
