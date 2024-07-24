import { memo, useState } from 'react'
import type { TabLayout, TabsTabProps, YStackProps } from 'tamagui'
import { AnimatePresence, Circle, Tabs, YStack } from 'tamagui'

export const BarTabs = memo(function HeaderTabs({
  currentTab,
  onTabChange,
  tabs,
}: {
  currentTab: string
  onTabChange: (string) => void
  tabs: { component: React.ReactNode; value: string; hasChanges?: boolean }[]
}) {
  const [tabRovingState, setTabRovingState] = useState<{
    /**
     * Layout of the Tab user might intend to select (hovering / focusing)
     */
    intentAt: TabLayout | null
    /**
     * Layout of the Tab user selected
     */
    activeAt: TabLayout | null
    /**
     * Used to get the direction of activation for animating the active indicator
     */
    prevActiveAt: TabLayout | null
  }>({
    activeAt: null,
    intentAt: null,
    prevActiveAt: null,
  })

  const setCurrentTab = onTabChange
  const setIntentIndicator = (intentAt) =>
    setTabRovingState({ ...tabRovingState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabRovingState({
      ...tabRovingState,
      prevActiveAt: tabRovingState.activeAt,
      activeAt,
    })
  const { activeAt, intentAt, prevActiveAt } = tabRovingState

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  //   const direction = (() => {
  //     if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
  //       return 0
  //     }
  //     return activeAt.x > prevActiveAt.x ? -1 : 1
  //   })()

  //   const enterVariant =
  //     direction === 1 ? 'isLeft' : direction === -1 ? 'isRight' : 'defaultFade'
  //   const exitVariant =
  //     direction === 1 ? 'isRight' : direction === -1 ? 'isLeft' : 'defaultFade'

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
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
      size="$2"
      flexDirection="column"
      activationMode="manual"
      position="relative"
    >
      <AnimatePresence>
        {intentAt && (
          <TabsRovingIndicator
            key="intent-indicator"
            width={intentAt.width}
            height={intentAt.height}
            x={intentAt.x}
            y={intentAt.y}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeAt && (
          <TabsRovingIndicator
            key="active-indicator"
            isActive
            width={activeAt.width}
            height={activeAt.height}
            x={activeAt.x}
            y={activeAt.y}
          />
        )}
      </AnimatePresence>

      <Tabs.List
        disablePassBorderRadius
        loop={false}
        aria-label="Manage your account"
        space="$2"
        backgroundColor="transparent"
      >
        {tabs.map(({ component, value, hasChanges }) => (
          <Tabs.Tab
            key={value}
            unstyled
            bc="transparent"
            px="$3"
            value={value}
            onInteraction={handleOnInteraction}
          >
            <AnimatePresence>
              {hasChanges && (
                <Circle
                  key={value}
                  animation="bouncy"
                  opacity={1}
                  scale={1}
                  enterStyle={{ opacity: 0, scale: 0.4 }}
                  exitStyle={{ opacity: 0, scale: 0.4 }}
                  pos="absolute"
                  right={2}
                  top={2}
                  backgroundColor={'$green8'}
                  size={8}
                />
              )}
            </AnimatePresence>
            {component}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  )
})

const TabsRovingIndicator = ({
  isActive,
  ...props
}: { isActive?: boolean } & YStackProps) => {
  return (
    <YStack
      borderRadius="$2"
      position="absolute"
      backgroundColor="$color6"
      animation="quick"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      opacity={0.5}
      {...(isActive && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
