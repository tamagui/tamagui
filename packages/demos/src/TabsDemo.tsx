import { useState } from 'react'
import { Button, H5, SizableText, Tabs, XStack } from 'tamagui'

const demos = ['horizontal', 'vertical'] as const

export function TabsDemo() {
  const [demoIndex, setDemoIndex] = useState(0)
  const demo = demos[demoIndex]

  return (
    <>
      {demo === 'horizontal' ? <HorizontalTabs /> : <VerticalTabs />}

      <XStack ai="center" space pos="absolute" b="$3" l="$4" $xxs={{ dsp: 'none' }}>
        <Button size="$2" onPress={() => setDemoIndex((x) => (x + 1) % demos.length)}>
          {demo}
        </Button>
      </XStack>
    </>
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
      <Tabs.List disablePassBorderRadius="bottom" aria-label="Manage your account">
        <Tabs.Trigger theme="Button" f={1} value="tab1">
          <SizableText fontFamily="$body">Profile</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" f={1} value="tab2">
          <SizableText fontFamily="$body">Connections</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" f={1} value="tab3">
          <SizableText fontFamily="$body">Notifications</SizableText>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tab1" key="tab1" p="$5" ai="center" jc="center" f={1}>
        <H5>Profile</H5>
      </Tabs.Content>

      <Tabs.Content value="tab2" key="tab2" p="$5" ai="center" jc="center" f={1}>
        <H5>Connections</H5>
      </Tabs.Content>

      <Tabs.Content value="tab3" key="tab3" p="$5" ai="center" jc="center" f={1}>
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
      br="$4"
    >
      <Tabs.List disablePassBorderRadius="end" aria-label="Manage your account">
        <Tabs.Trigger theme="Button" value="tab1">
          <SizableText fontFamily="$body">Profile</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" value="tab2">
          <SizableText fontFamily="$body">Connections</SizableText>
        </Tabs.Trigger>
        <Tabs.Trigger theme="Button" value="tab3">
          <SizableText fontFamily="$body">Notifications</SizableText>
        </Tabs.Trigger>
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
