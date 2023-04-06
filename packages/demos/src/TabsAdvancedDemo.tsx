import { useRef, useState } from 'react'
import {
  AnimatePresence,
  Button,
  H5,
  SizableText,
  Stack,
  TabTriggerLayout,
  Tabs,
  TabsTriggerProps,
  XStack,
  YStack,
  styled,
} from 'tamagui'

const demos = ['background', 'underline'] as const
const demosTitle: Record<(typeof demos)[number], string> = {
  background: 'Background Indicator',
  underline: 'Underline Indicator',
}

export const TabsAdvancedDemo = () => {
  const [demoIndex, setDemoIndex] = useState(0)
  const demo = demos[demoIndex]
  return (
    <>
      {demo === 'underline' ? <TabsAdvancedUnderline /> : <TabsAdvancedBackground />}

      <XStack ai="center" space pos="absolute" b="$3" l="$4" $xxs={{ dsp: 'none' }}>
        <Button size="$2" onPress={() => setDemoIndex((x) => (x + 1) % demos.length)}>
          {demosTitle[demo]}
        </Button>
      </XStack>
    </>
  )
}

const TabsAdvancedBackground = () => {
  const [tabState, setTabState] = useState<{
    currentTab: string
    /**
     * Layout of the trigger user might intend to select (hovering / focusing)
     */
    intentAt: TabTriggerLayout | null
    /**
     * Layout of the trigger user selected
     */
    activeAt: TabTriggerLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabTriggerLayout | null
  }>({
    activeAt: null,
    currentTab: 'tab1',
    intentAt: null,
    prevActiveAt: null,
  })

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1
  })()

  const enterVariant =
    direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  const exitVariant =
    direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTriggerProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$3"
      padding="$2"
      height={150}
      flexDirection="column"
      activationMode="manual"
      backgroundColor="$backgroundStrong"
      borderRadius="$2"
      position="relative"
    >
      <YStack>
        {intentAt && (
          <TabsRovingIndicator
            width={intentAt.width}
            height={intentAt.height}
            x={intentAt.x}
            y={intentAt.y}
            opacity={0.4}
          />
        )}
        {activeAt && (
          <TabsRovingIndicator
            theme="active"
            width={activeAt.width}
            height={activeAt.height}
            x={activeAt.x}
            y={activeAt.y}
          />
        )}
        <Tabs.List
          loop={false}
          aria-label="Manage your account"
          
          space
          backgroundColor="transparent"
        >
          <Tabs.Trigger value="tab1" onInteraction={handleOnInteraction}>
            <SizableText>Profile</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" onInteraction={handleOnInteraction}>
            <SizableText>Connections</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" onInteraction={handleOnInteraction}>
            <SizableText>Notifications</SizableText>
          </Tabs.Trigger>
        </Tabs.List>
      </YStack>

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} animation="100ms" x={0} o={1} f={1}>
          <Tabs.Content value={currentTab} forceMount f={1} jc="center">
            <H5 ta="center">{currentTab}</H5>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  )
}

const TabsAdvancedUnderline = () => {
  const [tabState, setTabState] = useState<{
    currentTab: string
    /**
     * Layout of the trigger user might intend to select (hovering / focusing)
     */
    intentAt: TabTriggerLayout | null
    /**
     * Layout of the trigger user selected
     */
    activeAt: TabTriggerLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabTriggerLayout | null
  }>({
    activeAt: null,
    currentTab: 'tab1',
    intentAt: null,
    prevActiveAt: null,
  })

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1
  })()

  const enterVariant =
    direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  const exitVariant =
    direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTriggerProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$3"
      height={150}
      flexDirection="column"
      activationMode="manual"
      backgroundColor="$backgroundStrong"
      borderRadius="$2"
    >
      <YStack>
        {intentAt && (
          <TabsRovingIndicator
            width={intentAt.width}
            height="$0.25"
            x={intentAt.x}
            
            bottom={0}
          />
        )}
        {activeAt && (
          <TabsRovingIndicator
            theme="active"
            active
            width={activeAt.width}
            height="$0.25"
            x={activeAt.x}
            
            bottom={0}
          />
        )}
        <Tabs.List
          loop={false}
          aria-label="Manage your account"
          
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
        >
          <Tabs.Trigger paddingHorizontal="$4" value="tab1" onInteraction={handleOnInteraction}>
            <SizableText>Profile</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger paddingHorizontal="$4" value="tab2" onInteraction={handleOnInteraction}>
            <SizableText>Connections</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger paddingHorizontal="$4" value="tab3" onInteraction={handleOnInteraction}>
            <SizableText>Notifications</SizableText>
          </Tabs.Trigger>
        </Tabs.List>
      </YStack>

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} animation="100ms" x={0} o={1} f={1}>
          <Tabs.Content value={currentTab} forceMount f={1} jc="center">
            <H5 ta="center">{currentTab}</H5>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  )
}

const TabsRovingIndicator = styled(Stack, {
  position: 'absolute',
  backgroundColor: '$color5',
  opacity: 1,
  animation: '100ms',
  borderRadius: '$4',

  variants: {
    active: {
      true: {
        backgroundColor: '$color8',
      },
    },
  },
})

const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
})
