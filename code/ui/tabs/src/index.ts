import { createTabs } from './createTabs'
import { DefaultTabsContentFrame, DefaultTabsFrame, DefaultTabsTabFrame } from './Tabs'
export * from './createTabs'
export * from './StyledContext'

export const Tabs = createTabs({
  ContentFrame: DefaultTabsContentFrame,
  TabFrame: DefaultTabsTabFrame,
  TabsFrame: DefaultTabsFrame,
})
