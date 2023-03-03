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

export function TabsHighlightedDemo() {
  return (
    <XStack maxHeight="100%" maxWidth="100%" justifyContent="flex-start">
      <HighlightTabs />
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
  } as const,
})

const HighlightTabs = () => {
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

  const intentIndicatorLayout = hoverIndicatorLayout || focusIndicatorLayout

  /**
   * -1: from left
   * 0: n/a
   * 1: from right
   */
  const direction = useMemo(() => {
    if (
      !selectionIndicatorLayout ||
      !prevSelectionIndicatorLayout.current ||
      selectionIndicatorLayout.x === prevSelectionIndicatorLayout.current.x
    ) {
      return 0
    }
    return selectionIndicatorLayout.x > prevSelectionIndicatorLayout.current.x ? 1 : -1
  }, [selectionIndicatorLayout])

  const enterVariant =
    direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : undefined
  const exitVariant =
    direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : undefined

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      br="$4"
      height={150}
      flexDirection="column"
      activationMode="manual"
    >
      <Tabs.List
        scrollable
        loop={false}
        aria-label="Manage your account"
        disablePassBorderRadius
      >
        {intentIndicatorLayout && (
          <TabsRovingIndicator
            width={intentIndicatorLayout.width}
            height={intentIndicatorLayout.height}
            x={intentIndicatorLayout.x}
            y={intentIndicatorLayout.y}
          />
        )}
        {selectionIndicatorLayout && (
          <TabsRovingIndicator
            theme="active"
            active
            width={selectionIndicatorLayout.width}
            height={selectionIndicatorLayout.height}
            x={selectionIndicatorLayout.x}
            y={selectionIndicatorLayout.y}
          />
        )}
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

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}
      >
        <AnimatedYStack key={currentTab} animation="100ms" x={0} o={1}>
          <Tabs.Content value={currentTab} forceMount p="$2">
            <H5 ta="center">{currentTab}</H5>
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  )
}
