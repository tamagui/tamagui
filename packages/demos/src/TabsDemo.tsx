import { H5, Tabs, XStack, YStack } from 'tamagui'

export function TabsDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
      <YStack space px="$4">
        <HorizontalTabs />
        <VerticalTabs />
      </YStack>
    </XStack>
  )
}

const HorizontalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      width={400}
      height={150}
      br="$4"
    >
      <Tabs.List aria-label="Manage your account" margin="$2">
        <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Connections</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
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

const VerticalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      flexDirection="row"
      orientation="vertical"
      width={400}
      br="$4"
    >
      <Tabs.List aria-label="Manage your account" margin="$2">
        <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Connections</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
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
