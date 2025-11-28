import React from 'react'
import type { TabsContentProps } from 'tamagui'
import { Button, H5, Separator, SizableText, Tabs, XStack, YStack, isWeb } from 'tamagui'

const demos = ['horizontal', 'vertical'] as const
const demosTitle: Record<(typeof demos)[number], string> = {
  horizontal: 'Horizontal',
  vertical: 'Vertical',
}

export function TabsDemo() {
  const [demoIndex, setDemoIndex] = React.useState(0)
  const demo = demos[demoIndex]

  return (
    // web only fix for position relative
    <YStack
      px="$4"
      {...(isWeb && {
        position: 'unset' as any,
      })}
    >
      {demo === 'horizontal' ? <HorizontalTabs /> : <VerticalTabs />}

      <XStack
        items="center"
        gap="$4"
        position="absolute"
        b="$3"
        l="$4"
        $maxXs={{ display: 'none' }}
      >
        <Button size="$2" onPress={() => setDemoIndex((x) => (x + 1) % demos.length)}>
          {demosTitle[demo]}
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
      $maxMd={{ width: 300 }}
      width={400}
      height={150}
      rounded="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List disablePassBorderRadius="bottom" aria-label="Manage your account">
        <Tabs.Tab
          focusStyle={{
            backgroundColor: '$color3',
          }}
          flex={1}
          value="tab1"
        >
          <SizableText fontFamily="$body" text="center">
            Profile
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab
          focusStyle={{
            backgroundColor: '$color3',
          }}
          flex={1}
          value="tab2"
        >
          <SizableText fontFamily="$body" text="center">
            Connections
          </SizableText>
        </Tabs.Tab>
        <Tabs.Tab
          focusStyle={{
            backgroundColor: '$color3',
          }}
          flex={1}
          value="tab3"
        >
          <SizableText fontFamily="$body" text="center">
            Notifications
          </SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator />
      <TabsContent value="tab1">
        <H5>Profile</H5>
      </TabsContent>

      <TabsContent value="tab2">
        <H5>Connections</H5>
      </TabsContent>

      <TabsContent value="tab3">
        <H5>Notifications</H5>
      </TabsContent>
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
      rounded="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List disablePassBorderRadius="end" aria-label="Manage your account">
        <Tabs.Tab value="tab1">
          <SizableText>Profile</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="tab2">
          <SizableText>Connections</SizableText>
        </Tabs.Tab>
        <Tabs.Tab value="tab3">
          <SizableText>Notifications</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator vertical />
      <TabsContent value="tab1">
        <H5 text="center">Profile</H5>
      </TabsContent>
      <TabsContent value="tab2">
        <H5 text="center">Connections</H5>
      </TabsContent>
      <TabsContent value="tab3">
        <H5 text="center">Notifications</H5>
      </TabsContent>
    </Tabs>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      bg="$background"
      key="tab3"
      p="$2"
      items="center"
      justify="center"
      flex={1}
      borderColor="$background"
      rounded="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}
