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
      paddingHorizontal="$4"
      {...(isWeb && {
        position: 'unset' as any,
      })}
    >
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
      width={400}
      height={150}
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List
        separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
      >
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Profile</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Connections</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab3">
          <SizableText fontFamily="$body">Notifications</SizableText>
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
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List
        disablePassBorderRadius="end"
        aria-label="Manage your account"
        separator={<Separator />}
      >
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
        <H5 textAlign="center">Profile</H5>
      </TabsContent>
      <TabsContent value="tab2">
        <H5 textAlign="center">Connections</H5>
      </TabsContent>
      <TabsContent value="tab3">
        <H5 textAlign="center">Notifications</H5>
      </TabsContent>
    </Tabs>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}
