import { useAdaptWhenIsActive } from '@tamagui/adapt'
import type { SelectContextValue } from './types'

export const useShowSelectSheet = (context: SelectContextValue) => {
  const breakpointActive = useAdaptWhenIsActive(context.sheetBreakpoint)
  return context.open === false ? false : breakpointActive
}
