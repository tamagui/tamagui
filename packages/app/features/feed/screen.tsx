import { H5, Separator, SizableText, Tabs, TabsContentProps, YStack, isWeb } from '@my/ui'

import { MyClimbsTab } from './myclimbs-tab'
import { ClimbsTab } from './climbs-tab'

export function FeedScreen() {
  return (
    <YStack
      flex={1}
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
    <Tabs defaultValue="tab1" orientation="horizontal" flexDirection="column" f={1}>
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
      key="tab3"
      alignItems="center"
      justifyContent="center"
      borderColor="$background"
      {...rest}
    >
      {children}
    </Tabs.Content>
  )
}
