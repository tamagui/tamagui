import { createStyledContext } from '@tamagui/core'
import type { TokenSize } from '@tamagui/size'
import type { TabsProps } from './Tabs'

export type TabsContextValue = {
  baseId: string
  value?: string
  onChange: (value: string) => void
  orientation?: TabsProps['orientation']
  dir?: TabsProps['dir']
  activationMode?: TabsProps['activationMode']
  size: TokenSize
  registerTrigger: () => void
  unregisterTrigger: () => void
  triggersCount: number
}

export const { Provider: TabsProvider, useStyledContext: useTabsContext } =
  createStyledContext<TabsContextValue>()
