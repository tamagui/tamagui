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
  const { activeAt, intentAt } = tabRovingState

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
      size="2"
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

      <Tabs.List loop={false} aria-label="Manage your account" gap="2" bg="transparent">
        {tabs.map(({ component, value, hasChanges }) => (
          <Tabs.Tab
            key={value}
            borderColor="transparent"
            px="3"
            value={value}
            onInteraction={handleOnInteraction}
          >
            <AnimatePresence>
              {hasChanges && (
                <Circle
                  key={value}
                  transition="bouncy"
                  opacity="1 enter:0 exit:0"
                  scale="1 enter:0.4 exit:0.4"
                  position="absolute"
                  r={2}
                  t={2}
                  bg="green8"
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
      rounded="2"
      position="absolute"
      bg="color6"
      transition="quick"
      opacity="0.5 enter:0 exit:0"
      {...(isActive && {
        backgroundColor: 'color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
