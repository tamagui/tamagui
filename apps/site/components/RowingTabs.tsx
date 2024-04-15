import React, { useEffect, useState } from 'react'
import type { ViewProps, TabLayout, TabsTabProps } from 'tamagui'
import { Avatar } from 'tamagui'
import { AnimatePresence, Paragraph, Tabs, YStack } from 'tamagui'
import { getBashText } from './getBashText'

export function RowingTabs({ enabled = false, onTabChange, children }) {
  const [tabState, setTabState] = useState<{
    currentTab: string
    // Layout of the Tab user might intend to select (hovering / focusing)
    intentAt: TabLayout | null
    // Layout of the Tab user selected
    activeAt: TabLayout | null
  }>({
    activeAt: null,
    currentTab: getBashText(children)[0].startsWith('npx') ? 'npx' : 'yarn',
    intentAt: null,
  })

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) => setTabState({ ...tabState, activeAt })
  const { activeAt, intentAt, currentTab } = tabState

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  useEffect(() => {
    onTabChange(currentTab)
  }, [currentTab])

  return (
    <>
      {enabled ? (
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
                {getBashText(children)[0].startsWith('npm create') ? (
                  <>
                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="npm"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/npm.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">npm</Paragraph>
                    </Tabs.Tab>
                  </>
                ) : getBashText(children)[0].startsWith('npx') ? (
                  <>
                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="npx"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/npm.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">npx</Paragraph>
                    </Tabs.Tab>

                    {/* <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="bunx"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/bun.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">bunx</Paragraph>
                    </Tabs.Tab> */}
                  </>
                ) : (
                  <>
                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="yarn"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/yarn.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">yarn</Paragraph>
                    </Tabs.Tab>

                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="bun"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/bun.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">bun</Paragraph>
                    </Tabs.Tab>

                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="npm"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/npm.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">npm</Paragraph>
                    </Tabs.Tab>

                    <Tabs.Tab
                      unstyled
                      pl="$2"
                      pr="$2.5"
                      py="$1.5"
                      gap="$1.5"
                      value="pnpm"
                      onInteraction={handleOnInteraction}
                    >
                      <Avatar size="$1" br="$2">
                        <Avatar.Image scale={0.8} src="/logos/pnpm.svg" />
                        <Avatar.Fallback bg="$color6" bc="$color8" />
                      </Avatar>
                      <Paragraph col="$white1">pnpm</Paragraph>
                    </Tabs.Tab>
                  </>
                )}
              </Tabs.List>
            </YStack>

            <Tabs.Content value={currentTab} forceMount>
              {children}
            </Tabs.Content>
          </YStack>
        </Tabs>
      ) : (
        children
      )}
    </>
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
