import { useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
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

export function TabsAdvancedDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start" px="$4">
      <TabsAdvanced />
    </XStack>
  )
}

const TabsRovingIndicator = styled(Stack, {
  name: 'TabsRovingIndicator',
  variants: {
    active: {
      true: {
        backgroundColor: '$color8',
      },
    },
    variants: {
      active: {
        true: {
          backgroundColor: '$color8',
        },
      },
      enter: {
        true: {
          opacity: 0,
        },
      },
      exit: {
        true: {
          opacity: 0,
        },
      },
    },
  },
  defaultVariants: {
    position: 'absolute',
    backgroundColor: '$color5',
    opacity: 1,
    animation: '100ms',
    borderRadius: '$4',
  },
})

const AnimatedYStack = styled(YStack, {
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
})

const TabsAdvanced = () => {
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
   * 0: n/a
   * 1: from right
   */
  const direction = useMemo(() => {
    if (
      !selectIndicator ||
      !prevSelectionIndicatorLayout.current ||
      selectIndicator.x === prevSelectionIndicatorLayout.current.x
    ) {
      return 0
    }
    return selectIndicator.x > prevSelectionIndicatorLayout.current.x ? 1 : -1
  }, [selectIndicator])

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
      br="$2"
      size="$4"
      p="$1.5"
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
              height="$0.5"
              x={selectIndicator.x}
              borderRadius={0}
              bottom={-4}
            />
          )}

          <Tabs.Trigger value="tab1" onInteraction={handleOnInteraction}>
            <SizableText fontFamily="$body">Profile</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab2" onInteraction={handleOnInteraction}>
            <SizableText fontFamily="$body">Connections</SizableText>
          </Tabs.Trigger>
          <Tabs.Trigger value="tab3" onInteraction={handleOnInteraction}>
            <SizableText fontFamily="$body">Notifications</SizableText>
          </Tabs.Trigger>
        </Tabs.List>
      </YStack>

      <YStack f={1}>
        <AnimatePresence
          exitBeforeEnter
          enterVariant={enterVariant}
          exitVariant={exitVariant}
        >
          <AnimatedYStack key={currentTab} animation="100ms" x={0} o={1} f={1}>
            <Tabs.Content value={currentTab} forceMount p="$2" f={1} jc="center">
              <H5 ta="center">{currentTab}</H5>
            </Tabs.Content>
          </AnimatedYStack>
        </AnimatePresence>
      </YStack>
    </Tabs>
  )
}
