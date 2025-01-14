import { useState } from 'react'
import type { TabLayout, TabsTabProps, ViewProps } from 'tamagui'
import { SizableText, XStack, styled } from 'tamagui'
import { AnimatePresence, Tabs, YStack } from 'tamagui'
import { Code } from './Code'
import { useBashCommand, PACKAGE_MANAGERS } from '~/hooks/useBashCommand'
import { Image } from '@tamagui/image-next'
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
        backgroundColor="transparent"
        f={1}
        className={className}
        size={size ?? '$5'}
        lineHeight={size ?? '$5'}
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
          br="$4"
          value={selectedPackageManager}
          onPress={(e) => e.stopPropagation()}
          onValueChange={setPackageManager}
          group
          mt={1}
        >
          <YStack w="100%">
            <YStack p="$1.5" m="$2" mb={0} br="$5">
              <AnimatePresence initial={false}>
                {intentAt && (
                  <TabIndicator
                    w={intentAt.width}
                    h={intentAt.height}
                    x={intentAt.x}
                    y={intentAt.y}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence initial={false}>
                {activeAt && (
                  <TabIndicator
                    theme="alt1"
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

function Tab({
  active,
  pkgManager,
  logo,
  onInteraction,
}: {
  active?: boolean
  pkgManager: string
  logo?: string
  onInteraction: TabsTabProps['onInteraction']
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
      onInteraction={onInteraction}
    >
      <XStack gap="$1.5" ai="center" jc="center">
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
          col={active ? '$color11' : '$color9'}
          o={active ? 1 : 0.5}
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
      pos="absolute"
      bg="$color5"
      o={0.7}
      br="$4"
      animation="quickest"
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
          x: direction > 0 ? -10 : -10,
          opacity: 0,
        },
        exitStyle: {
          zIndex: 0,
          x: direction < 0 ? -10 : -10,
          opacity: 0,
        },
      }),
    },
  } as const,
})
