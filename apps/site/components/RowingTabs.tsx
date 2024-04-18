import { useEffect, useState } from 'react'
import type { ViewProps, TabLayout, TabsTabProps } from 'tamagui'
import { Avatar, styled } from 'tamagui'
import { AnimatePresence, Paragraph, Tabs, YStack } from 'tamagui'
import { getBashCommand } from '@lib/getBashCommand'
import { Code } from './Code'

export function RowingTabs({ className, onTabChange, children, size, ...rest }) {
  const { isStarter, isPackageRunner, showTabs, command, handleTabChange } =
    getBashCommand(children, className, false)

  const [tabState, setTabState] = useState<{
    currentTab: string
    // Layout of the Tab user might intend to select (hovering / focusing)
    intentAt: TabLayout | null
    // Layout of the Tab user selected
    activeAt: TabLayout | null
    // Used to get the direction of activation for animating the active indicator
    prevActiveAt: TabLayout | null
  }>({
    currentTab: isStarter ? 'npm' : isPackageRunner ? 'npx' : 'yarn',
    intentAt: null,
    activeAt: null,
    prevActiveAt: null,
  })

  // Update the currentTab localStorage after the component has mounted
  useEffect(() => {
    const storedTab = isPackageRunner
      ? localStorage.getItem('bashPkgRunTab')
      : localStorage.getItem('bashPkgInstallTab')

    if (storedTab) {
      setTabState((prevState) => ({
        ...prevState,
        currentTab: storedTab,
      }))

      onTabChange(storedTab)
      handleTabChange(storedTab)
    }
  }, [])

  const setCurrentTab = (currentTab: string) => {
    setTabState({ ...tabState, currentTab })
    onTabChange(currentTab)
    handleTabChange(currentTab)

    // Update the currentTab localStorage if tab changes
    isPackageRunner
      ? localStorage.setItem('bashPkgRunTab', currentTab)
      : localStorage.setItem('bashPkgInstallTab', currentTab)
  }

  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) =>
    setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState

  // 1 = right, 0 = nowhere, -1 = left
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1
  })()

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <>
      {showTabs ? (
        <Tabs
          activationMode="manual"
          orientation="horizontal"
          size="$4"
          br="$4"
          animation="100ms"
          enterStyle={{ o: 0, y: -10 }}
          value={currentTab}
          onPress={(e) => e.stopPropagation()}
          onValueChange={setCurrentTab}
        >
          <YStack w="100%">
            <YStack p="$2" bg="$black1" bw="$1.5" bc="$background" br="$5">
              <AnimatePresence>
                {intentAt && (
                  <TabIndicator
                    w={intentAt.width}
                    h={intentAt.height}
                    x={intentAt.x}
                    y={intentAt.y}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {activeAt && (
                  <TabIndicator
                    theme="active"
                    w={activeAt.width}
                    h={activeAt.height}
                    x={activeAt.x}
                    y={activeAt.y}
                  />
                )}
              </AnimatePresence>

              <Tabs.List
                disablePassBorderRadius
                loop={false}
                aria-label="package manager"
                gap="$2"
                br="$4"
                animation="100ms"
              >
                {isStarter ? (
                  <Tab pkgManager="npm" onInteraction={handleOnInteraction} />
                ) : isPackageRunner ? (
                  <>
                    <Tab
                      pkgManager="npx"
                      logo="npm"
                      onInteraction={handleOnInteraction}
                    />
                    <Tab
                      pkgManager="bunx"
                      logo="bun"
                      onInteraction={handleOnInteraction}
                    />
                  </>
                ) : (
                  <>
                    <Tab pkgManager="yarn" onInteraction={handleOnInteraction} />
                    <Tab pkgManager="bun" onInteraction={handleOnInteraction} />
                    <Tab pkgManager="npm" onInteraction={handleOnInteraction} />
                    <Tab pkgManager="pnpm" onInteraction={handleOnInteraction} />
                  </>
                )}
              </Tabs.List>
            </YStack>

            <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
              <AnimatedYStack key={currentTab}>
                <Tabs.Content value={currentTab} forceMount>
                  <Code
                    p="$4"
                    backgroundColor="transparent"
                    f={1}
                    className={className}
                    size={size ?? '$5'}
                    lineHeight={size ?? '$5'}
                    {...rest}
                  >
                    {command}
                  </Code>
                </Tabs.Content>
              </AnimatedYStack>
            </AnimatePresence>
          </YStack>
        </Tabs>
      ) : (
        children
      )}
    </>
  )
}

function Tab({
  pkgManager,
  logo,
  onInteraction,
}: {
  pkgManager: string
  logo?: string
  onInteraction: TabsTabProps['onInteraction']
}) {
  return (
    <Tabs.Tab
      unstyled
      pl="$2"
      pr="$2.5"
      py="$1.5"
      gap="$1.5"
      value={pkgManager}
      onInteraction={onInteraction}
    >
      <Avatar size="$1" br="$2">
        <Avatar.Image scale={0.8} src={`/logos/${logo ?? pkgManager}.svg`} />
        <Avatar.Fallback bg="$color6" bc="$color8" />
      </Avatar>
      <Paragraph col="$white1">{pkgManager}</Paragraph>
    </Tabs.Tab>
  )
}

function TabIndicator({ active, ...props }: { active?: boolean } & ViewProps) {
  return (
    <YStack
      pos="absolute"
      bg="$color5"
      o={0.7}
      br="$4"
      animation="100ms"
      enterStyle={{
        o: 0,
      }}
      exitStyle={{
        o: 0,
      }}
      {...(active && {
        bg: '$color8',
        o: 0.6,
      })}
      {...props}
    />
  )
}

const AnimatedYStack = styled(YStack, {
  f: 1,
  x: 0,
  o: 1,

  animation: '100ms',
  variants: {
    // 1 = right, 0 = nowhere, -1 = left
    direction: {
      ':number': (direction) => ({
        enterStyle: {
          x: direction > 0 ? -25 : -25,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? -25 : -25,
          opacity: 0,
        },
      }),
    },
  } as const,
})
