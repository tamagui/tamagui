import { styled, withStaticProperties } from '@tamagui/core'
import { Tabs } from '../src'

const TabsSkinFrame = styled(Tabs, {
  name: 'TabsSkinFrame',
  gap: '$2',
})

const TabsSkinList = styled(Tabs.List, {
  name: 'TabsSkinList',
  borderRadius: '$4',
})

const TabsSkinTab = styled(Tabs.Tab, {
  name: 'TabsSkinTab',
  padding: '$3',
  backgroundColor: '$background',
})

const TabsSkinContent = styled(Tabs.Content, {
  name: 'TabsSkinContent',
  padding: '$4',
})

const TabsSkin = withStaticProperties(TabsSkinFrame, {
  List: TabsSkinList,
  Tab: TabsSkinTab,
  Content: TabsSkinContent,
})

export const TabsSkinTypeTest = () => (
  <TabsSkin defaultValue="one" size="$4">
    <TabsSkin.List loop>
      <TabsSkin.Tab value="one">One</TabsSkin.Tab>
      <TabsSkin.Tab value="two" disabled>
        Two
      </TabsSkin.Tab>
    </TabsSkin.List>
    <TabsSkin.Content value="one">First panel</TabsSkin.Content>
    <TabsSkin.Content value="two" forceMount>
      Second panel
    </TabsSkin.Content>
  </TabsSkin>
)

export const TabsPartsTypeTest = () => (
  <Tabs defaultValue="one" orientation="vertical" size={32}>
    <Tabs.List disabled width={180}>
      <Tabs.Tab
        value="one"
        padding="$2"
        onInteraction={(_type, layout) => layout?.width}
      />
    </Tabs.List>
    <Tabs.Content value="one" minHeight={120} />
  </Tabs>
)
