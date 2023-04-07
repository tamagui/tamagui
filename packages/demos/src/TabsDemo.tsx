import { useState } from 'react'
import { Button, H5, SizableText, Tabs, XStack, YStack } from 'tamagui'

const demos = ['horizontal', 'vertical'] as const

export function TabsDemo() {
  const [demoIndex, setDemoIndex] = useState(0)
  const demo = demos[demoIndex]

  return (
    <YStack paddingHorizontal="$4" position='unset'>
      {demo === 'horizontal' ? <HorizontalTabs /> : <VerticalTabs />}

      <XStack
        alignItems="center"
        space
        position="absolute"
        bottom="$3"
        left="$4"
        $xxs={{ display: 'none' }}
      >
        <Button size="$2" onPress={() => setDemoIndex((x) => (x + 1) % demos.length)}>
          {demo}
        </Button>
      </XStack>
    </YStack>
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
      borderRadius="$4"
    >
      <Tabs.List disablePassBorderRadius="bottom" aria-label="Manage your account">
        <Tabs.Trigger theme="Button" flex={1} value="tab1">
          <SizableText fontFamily="$body">Profile</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" flex={1} value="tab2">
          <SizableText fontFamily="$body">Connections</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" flex={1} value="tab3">
          <SizableText fontFamily="$body">Notifications</SizableText>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content
        value="tab1"
        key="tab1"
        padding="$5"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5>Profile</H5>
      </Tabs.Content>

      <Tabs.Content
        value="tab2"
        key="tab2"
        padding="$5"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5>Connections</H5>
      </Tabs.Content>

      <Tabs.Content
        value="tab3"
        key="tab3"
        padding="$5"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5>Notifications</H5>
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
      borderRadius="$4"
    >
      <Tabs.List disablePassBorderRadius="end" aria-label="Manage your account">
        <Tabs.Trigger theme="Button" value="tab1">
          <SizableText>Profile</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" value="tab2">
          <SizableText>Connections</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" value="tab3">
          <SizableText>Notifications</SizableText>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="tab1"
        key="tab1"
        padding="$2"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5 textAlign="center">Profile</H5>
      </Tabs.Content>
      <Tabs.Content
        value="tab2"
        key="tab2"
        padding="$2"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5 textAlign="center">Connections</H5>
      </Tabs.Content>
      <Tabs.Content
        value="tab3"
        key="tab3"
        padding="$2"
        alignItems="center"
        justifyContent="center"
        flex={1}
      >
        <H5 textAlign="center">Notifications</H5>
      </Tabs.Content>
    </Tabs>
  )
}
