import { useState } from 'react'
import { AnimatePresence, H5, Tabs, XStack, YStack } from 'tamagui'

export function TabsAnimatedDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
      <XStack space="$3" px="$8">
        <UnderlineTabs />
        <HighlightTabs />
      </XStack>
    </XStack>
  )
}

const UnderlineTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')
  const [direction, setDirection] = useState<-1 | 0 | 1>(0)

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      onDirectionChange={setDirection}
      orientation="vertical"
      width={300}
      br="$4"
      ai="center"
    >
      <YStack borderColor="$color3" borderRightWidth="$0.5" mr="$2">
        <YStack>
          <Tabs.RovingIndicator
            highlightMode="hoverOrFocus"
            width="$0.5"
            right={0}
            animation="100ms"
          />
          <Tabs.RovingIndicator
            highlightMode="select"
            width="$0.5"
            right={0}
            animation="100ms"
          />
          <Tabs.List aria-label="Manage your account" flexDirection="column">
            <Tabs.Trigger unstyled color="$color12" value="tab1">
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger unstyled color="$color12" value="tab2">
              Connections
            </Tabs.Trigger>
            <Tabs.Trigger unstyled color="$color12" value="tab3">
              Notifications
            </Tabs.Trigger>
          </Tabs.List>
        </YStack>
      </YStack>
      <AnimatePresence exitBeforeEnter>
        <Tabs.Content
          value={currentTab}
          key={currentTab}
          forceMount
          p="$2"
          animation="100ms"
          o={1}
          y={0}
          f={1}
          enterStyle={{
            ...(direction === -1 ? { y: -25 } : {}),
            ...(direction === 1 ? { y: 25 } : {}),
            opacity: 0,
          }}
          exitStyle={{
            ...(direction === -1 ? { y: 25 } : {}),
            ...(direction === 1 ? { y: -25 } : {}),
            opacity: 0,
          }}
        >
          <H5 ta="center">{currentTab}</H5>
        </Tabs.Content>
      </AnimatePresence>
    </Tabs>
  )
}

const HighlightTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')
  const [direction, setDirection] = useState<-1 | 0 | 1>(0)

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      onDirectionChange={setDirection}
      orientation="horizontal"
      br="$4"
      flexDirection="column"
    >
      <YStack>
        <Tabs.RovingIndicator
          highlightMode="hoverOrFocus"
          borderRadius="$4"
          animation="100ms"
        />
        <Tabs.RovingIndicator
          highlightMode="select"
          borderRadius="$4"
          animation="100ms"
        />
        <Tabs.List aria-label="Manage your account">
          <Tabs.Trigger unstyled color="$color12" value="tab1">
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger unstyled color="$color12" value="tab2">
            Connections
          </Tabs.Trigger>
          <Tabs.Trigger unstyled color="$color12" value="tab3">
            Notifications
          </Tabs.Trigger>
        </Tabs.List>
      </YStack>
      <AnimatePresence exitBeforeEnter>
        <Tabs.Content
          value={currentTab}
          key={currentTab}
          forceMount
          p="$2"
          animation="100ms"
          o={1}
          x={0}
          enterStyle={{
            ...(direction === -1 ? { x: -25 } : {}),
            ...(direction === 1 ? { x: 25 } : {}),
            opacity: 0,
          }}
          exitStyle={{
            ...(direction === -1 ? { x: 25 } : {}),
            ...(direction === 1 ? { x: -25 } : {}),
            opacity: 0,
          }}
        >
          <H5 ta="center">{currentTab}</H5>
        </Tabs.Content>
      </AnimatePresence>
    </Tabs>
  )
}
