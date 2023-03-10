import { useRef, useState } from 'react'
import {
  AnimatePresence,
  H5,
  SizableText,
  Stack,
  TabTriggerLayout,
  Tabs,
  TabsTriggerProps,
  YStack,
  styled,
} from 'tamagui'

export const TabsAdvancedDemo = () => {
  const [currentTab, setCurrentTab] = useState('tab1')

  // Layout of the trigger user might intend to select (hovering / focusing)
  const [IntentIndicator, setIntentIndicator] = useState<TabTriggerLayout | null>(null)

  // Layout of the trigger user selected
  const [selectIndicator, setSelectIndicator] = useState<TabTriggerLayout | null>(null)
  const prevSelectionIndicatorLayout = useRef<TabTriggerLayout | null>(null)

  const handleUpdateSelectionIndicator = (newSize: TabTriggerLayout | null) => {
    prevSelectionIndicatorLayout.current = selectIndicator
    setSelectIndicator(newSize)
  }

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (
      !selectIndicator ||
      !prevSelectionIndicatorLayout.current ||
      selectIndicator.x === prevSelectionIndicatorLayout.current.x
    ) {
      return 0
    }
    return selectIndicator.x > prevSelectionIndicatorLayout.current.x ? -1 : 1
  })()

  const enterVariant =
    direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  const exitVariant =
    direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTriggerProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      handleUpdateSelectionIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      br="$4"
      size="$3"
      p="$2"
      height={150}
      flexDirection="column"
      activationMode="manual"
    >
      <YStack borderColor="$color3" borderBottomWidth="$0.5">
        <Tabs.List
          loop={false}
          aria-label="Manage your account"
          disablePassBorderRadius
          overflow="visible"
          pb="$1.5"
        >
          {IntentIndicator && (
            <TabsRovingIndicator
              width={IntentIndicator.width}
              height={IntentIndicator.height}
              x={IntentIndicator.x}
              y={IntentIndicator.y}
            />
          )}

          {selectIndicator && (
            <TabsRovingIndicator
              theme="active"
              active
              width={selectIndicator.width}
              height="$0.25"
              x={selectIndicator.x}
              borderRadius={0}
              bottom={-3}
            />
          )}

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
