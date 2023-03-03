import { useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  H5,
  Stack,
  TabTriggerLayout,
  Tabs,
  XStack,
  YStack,
  styled,
} from 'tamagui'

export function TabsUnderlinedDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
      <UnderlineTabs />
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
  },
})

const AnimatedYStack = styled(YStack, {
  variants: {
    isTop: { true: { y: -25, opacity: 0 } },
    isBottom: { true: { y: 25, opacity: 0 } },
  } as const,
})

const UnderlineTabs = () => {
  const [currentTab, setCurrentTab] = useState('tab1')
  const [focusIndicatorLayout, setFocusIndicatorLayout] =
    useState<TabTriggerLayout | null>(null)
  const [hoverIndicatorLayout, setHoverIndicatorLayout] =
    useState<TabTriggerLayout | null>(null)
  const [selectionIndicatorLayout, setSelectionIndicatorLayout] =
    useState<TabTriggerLayout | null>(null)
  const prevSelectionIndicatorLayout = useRef<TabTriggerLayout | null>(null)
  const handleUpdateSelectionIndicator = (newSize: TabTriggerLayout | null) => {
    prevSelectionIndicatorLayout.current = selectionIndicatorLayout
    setSelectionIndicatorLayout(newSize)
  }

  const intentIndicatorLayout = focusIndicatorLayout || hoverIndicatorLayout

  /**
   * -1: from top
   * 0: n/a
   * 1: from bottom
   */
  const direction = useMemo(() => {
    if (
      !selectionIndicatorLayout ||
      !prevSelectionIndicatorLayout.current ||
      selectionIndicatorLayout.y === prevSelectionIndicatorLayout.current.y
    ) {
      return 0
    }
    return selectionIndicatorLayout.y > prevSelectionIndicatorLayout.current.y ? 1 : -1
  }, [selectionIndicatorLayout])

  const enterVariant =
    direction === 1 ? 'isTop' : direction === -1 ? 'isBottom' : undefined
  const exitVariant =
    direction === 1 ? 'isBottom' : direction === -1 ? 'isTop' : undefined

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="vertical"
      width={300}
      br="$4"
      ai="center"
      activationMode="manual"
    >
      <YStack borderColor="$color3" borderRightWidth="$0.5" mr="$2">
        <YStack>
          {intentIndicatorLayout && (
            <TabsRovingIndicator
              width="$0.5"
              height={intentIndicatorLayout.height}
              x={intentIndicatorLayout.x}
              y={intentIndicatorLayout.y}
              right={0}
            />
          )}
          {selectionIndicatorLayout && (
            <TabsRovingIndicator
              theme="active"
              active
              width="$0.5"
              height={selectionIndicatorLayout.height}
              x={selectionIndicatorLayout.x}
              y={selectionIndicatorLayout.y}
              right={0}
            />
          )}
          <Tabs.List loop={false} aria-label="Manage your account" flexDirection="column">
            <Tabs.Trigger
              unstyled
              color="$color12"
              value="tab1"
              onSelectedLayoutChange={handleUpdateSelectionIndicator}
              onHoveredLayoutChange={setHoverIndicatorLayout}
              onFocusedLayoutChange={setFocusIndicatorLayout}
            >
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger
              unstyled
              color="$color12"
              value="tab2"
              onSelectedLayoutChange={handleUpdateSelectionIndicator}
              onHoveredLayoutChange={setHoverIndicatorLayout}
              onFocusedLayoutChange={setFocusIndicatorLayout}
            >
              Connections
            </Tabs.Trigger>
            <Tabs.Trigger
              unstyled
              color="$color12"
              value="tab3"
              onSelectedLayoutChange={handleUpdateSelectionIndicator}
              onHoveredLayoutChange={setHoverIndicatorLayout}
              onFocusedLayoutChange={setFocusIndicatorLayout}
            >
              Notifications
            </Tabs.Trigger>
          </Tabs.List>
        </YStack>
      </YStack>
      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} animation="100ms" y={0} o={1}>
          <Tabs.Content value={currentTab} forceMount p="$2">
            <H5 ta="center">{currentTab}</H5>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  )
}
