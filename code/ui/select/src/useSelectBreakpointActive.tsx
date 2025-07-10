import { useAdaptIsActive } from '@tamagui/adapt'
import type { SelectContextValue } from './types'

export const useShowSelectSheet = (context: SelectContextValue) => {
  const breakpointActive = useAdaptIsActive(context.adaptScope)
  return context.open === false ? false : breakpointActive
}
