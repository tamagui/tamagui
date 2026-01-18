import { useState } from 'react'
import type { TabLayout, TabsTabProps, ViewProps } from 'tamagui'
import { SizableText, XStack, styled } from 'tamagui'
import { AnimatePresence, Tabs, YStack } from 'tamagui'
import { Code } from './Code'
import { useBashCommand, PACKAGE_MANAGERS } from '~/hooks/useBashCommand'
import { Image } from '@tamagui/image'
import { ScrollView } from 'react-native'

export function RovingTabs({ className, children, code, size, ...rest }) {
  const { showTabs, transformedCommand, selectedPackageManager, setPackageManager } =
    useBashCommand(code || children, className)

  const [tabState, setTabState] = useState<{
    intentAt: TabLayout | null
    activeAt: TabLayout | null
    prevActiveAt: TabLayout | null
  }>({
    intentAt: null,
    activeAt: null,
    prevActiveAt: null,
  })

  const setIntentIndicator = (intentAt: TabLayout | null) =>
    setTabState((prevTabState) => ({ ...prevTabState, intentAt }))
  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState((prevTabState) => ({
      ...prevTabState,
      prevActiveAt: tabState.activeAt,
      activeAt,
    }))

  const { activeAt, intentAt, prevActiveAt } = tabState

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  const codeContent = (
    <ScrollView
      style={{ width: '100%' }}
      contentContainerStyle={{
        minWidth: '100%',
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <Code
        p="$4"
        bg="transparent"
        flex={1}
        className={className}
        size={size ?? '$4'}
        lineHeight={size ?? '$4'}
        {...(showTabs && {
          whiteSpace: 'nowrap',
        })}
        {...rest}
      >
        {showTabs ? transformedCommand : children}
      </Code>
    </ScrollView>
  )

  return (
    <>
      {showTabs ? (
        <Tabs
          activationMode="manual"
          orientation="horizontal"
          size="$4"
          rounded="$4"
          value={selectedPackageManager}
          onPress={(e) => e.stopPropagation()}
          onValueChange={setPackageManager}
          group
          mt={1}
        >
          <YStack width="100%">
            <YStack p="$1.5" m="$2" mb={0} rounded="$5">
              <AnimatePresence initial={false}>
                {intentAt && (
                  <TabIndicator
                    width={intentAt.width}
                    height={intentAt.height}
                    x={intentAt.x}
                    y={intentAt.y}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {activeAt && (
                  <TabIndicator
                    theme="alt1"
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
                aria-label="package manager"
                gap="$2"
              >
                <>
                  {PACKAGE_MANAGERS.map((pkgManager) => (
                    <Tab
                      key={pkgManager}
                      active={selectedPackageManager === pkgManager}
                      pkgManager={pkgManager}
                      onInteraction={handleOnInteraction}
                    />
                  ))}
                </>
              </Tabs.List>
            </YStack>

            <Tabs.Content value={selectedPackageManager} forceMount>
              {codeContent}
            </Tabs.Content>
          </YStack>
        </Tabs>
      ) : (
        codeContent
      )}
    </>
  )
}

export function Tab({
  active,
  pkgManager,
  logo,
  onInteraction,
}: {
  active?: boolean
  pkgManager: string
  logo?: string
  onInteraction?: TabsTabProps['onInteraction']
}) {
  const imageName = logo ?? pkgManager
  return (
    <Tabs.Tab
      unstyled
      pl="$2"
      pr="$2.5"
      py="$1.5"
      gap="$1.5"
      value={pkgManager}
      {...(onInteraction && { onInteraction })}
      cursor="pointer"
    >
      <XStack gap="$1.5" items="center" justify="center">
        <Image
          width={16}
          height={16}
          scale={imageName === 'pnpm' ? 0.7 : 0.8}
          y={imageName === 'pnpm' ? 0 : 0}
          src={`/logos/${imageName}.svg`}
        />
        <SizableText
          y={-0.5}
          size="$2"
          color={active ? '$color11' : '$color9'}
          opacity={active ? 1 : 0.5}
        >
          {pkgManager}
        </SizableText>
      </XStack>
    </Tabs.Tab>
  )
}

function TabIndicator({ active, ...props }: { active?: boolean } & ViewProps) {
  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      bg="$color5"
      opacity={0.7}
      rounded="$4"
      transition="quickest"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        bg: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}
