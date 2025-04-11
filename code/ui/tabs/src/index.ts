import { createTabs } from './createTabs'
import { TabsContentFrame, TabsTriggerFrame, TabsFrame } from './Tabs'
export * from './createTabs'
export * from './StyledContext'

export const Tabs = createTabs({
  ContentFrame: TabsContentFrame,
  TriggerFrame: TabsTriggerFrame,
  TabsFrame: TabsFrame,
})
