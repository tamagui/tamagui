import { H5, SizeTokens, Tabs, XGroup, XStack, YGroup, YStack } from 'tamagui'

export function TabsDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
      <XStack space="$3" px="$8">
        <YStack space>
          <HorizontalTabs />
          <VerticalTabs />
        </YStack>
        {/* <YStack space>
          <HorizontalTabs size="$2" />
          <VerticalTabs size="$2" />
        </YStack> */}
      </XStack>
    </XStack>
  )
}

const HorizontalTabs = ({ size }: { size?: SizeTokens }) => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      size={size}
      width={400}
      height={150}
      br="$4"
    >
      <Tabs.List aria-label="Manage your account" m="$2">
        <XGroup>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Connections</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </XGroup>
      </Tabs.List>
      <Tabs.Content value="tab1" key="tab1" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Profile</H5>
      </Tabs.Content>
      <Tabs.Content value="tab2" key="tab2" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Connections</H5>
      </Tabs.Content>
      <Tabs.Content value="tab3" key="tab3" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Notifications</H5>
      </Tabs.Content>
    </Tabs>
  )
}

const VerticalTabs = ({ size }: { size?: SizeTokens }) => {
  return (
    <Tabs
      defaultValue="tab1"
      flexDirection="row"
      orientation="vertical"
      size={size}
      width={400}
      br="$4"
    >
      <Tabs.List aria-label="Manage your account" space="$2" m="$2">
        <YGroup>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Connections</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </YGroup>
      </Tabs.List>
      <Tabs.Content value="tab1" key="tab1" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Profile</H5>
      </Tabs.Content>
      <Tabs.Content value="tab2" key="tab2" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Connections</H5>
      </Tabs.Content>
      <Tabs.Content value="tab3" key="tab3" p="$2" ai="center" jc="center" f={1}>
        <H5 ta="center">Notifications</H5>
      </Tabs.Content>
    </Tabs>
  )
}
