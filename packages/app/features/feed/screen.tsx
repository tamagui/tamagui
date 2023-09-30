import {
  H5,
  Separator,
  SizableText,
  Tabs,
  TabsContentProps,
  YStack,
  isWeb,
} from '@my/ui'

import { MyClimbsTab } from './myclimbs-tab'
import { ClimbsTab } from './climbs-tab'
import { SheetDemo } from './thingy'

export function FeedScreen() {
  return (
    <YStack
      flex={1}
      {...(isWeb && {
        // Should fix in core
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        position: 'unset' as any,
      })}
    >
      <TabsDemo />
    </YStack>
  )
}

export function TabsDemo() {
  return (
    // web only fix for position relative
    <>
      <YStack
        {...(isWeb && {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          position: 'unset' as any,
        })}
      >
        <HorizontalTabs />
      </YStack>
    </>
  )
}

const HorizontalTabs = () => {
  return (
    <Tabs
      defaultValue="tab1"
      orientation="horizontal"
      flexDirection="column"
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      borderColor="$borderColor"
    >
      <Tabs.List
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
      >
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Open</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Scheduled</SizableText>
        </Tabs.Tab>
      </Tabs.List>
      <Separator />
      <TabsContent value="tab1">
        <ClimbsTab />
      </TabsContent>
      <TabsContent value="tab2">
        <MyClimbsTab />
      </TabsContent>
    </Tabs>
  )
}

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      key="tab3"
      // padding="$2"
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      {...props}
    >
      {props.children}
    </Tabs.Content>
  )
}
