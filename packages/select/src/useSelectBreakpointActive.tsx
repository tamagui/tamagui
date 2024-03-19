import { useMedia } from '@tamagui/core'

import type { SelectContextValue } from './types'

export const useSelectBreakpointActive = (
  sheetBreakpoint: SelectContextValue['sheetBreakpoint']
) => {
  const media = useMedia()
  if (!sheetBreakpoint) return false
  if (sheetBreakpoint === true) return true
  return sheetBreakpoint ? media[sheetBreakpoint] : false
}

export const useShowSelectSheet = (context: SelectContextValue) => {
  const breakpointActive = useSelectBreakpointActive(context.sheetBreakpoint)
  return context.open === false ? false : breakpointActive
}
