import { H5, Separator, SizableText, Tabs, TabsContentProps, YStack, isWeb } from '@my/ui'

import { ClimbsTab } from './climbs-tab'
import { MyClimbsTab } from './myclimbs-tab'

export function FeedScreen() {
  return (
    <YStack
      flex={1}
      paddingHorizontal="$4"
      {...(isWeb && {
        // Should fix in core
        position: 'unset' as any,
      })}
    >
      <HorizontalTabs />
    </YStack>
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
        separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        aria-label="Manage your account"
      >
        <Tabs.Tab flex={1} value="tab1">
          <SizableText fontFamily="$body">Climbs</SizableText>
        </Tabs.Tab>
        <Tabs.Tab flex={1} value="tab2">
          <SizableText fontFamily="$body">Your Climbs</SizableText>
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
  const { children, ...rest } = props
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
      {...rest}
    >
      {children}
    </Tabs.Content>
  )
}
