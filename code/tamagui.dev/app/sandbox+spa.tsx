import { Configuration, createStyledContext, styled, useConfiguration } from '@tamagui/web'
import { useState } from 'react'
import {
  AnimatePresence,
  Button,
  Circle,
  Square,
  Tabs,
  Text,
  View,
  XStack,
  YStack,
  withStaticProperties,
} from 'tamagui'
import type { TabLayout, TabsTabProps, ViewProps } from 'tamagui'

export default function Sandbox() {
  return (
    <Configuration>
      <YStack p="$10" gap="$8" items="center" justify="center">
        <RovingTabsDemo />
      </YStack>
    </Configuration>
  )
}

// roving tabs demo
function RovingTabsDemo() {
  const [tab, setTab] = useState('tab1')

  return (
    <YStack gap="$6" p="$4" bg="$background" rounded="$4" width={400}>
      <Text fontSize="$6" fontWeight="600">
        Underline Style
      </Text>
      <RovingTabs value={tab} onValueChange={setTab} indicatorStyle="underline">
        {({ handleOnInteraction }) => (
          <>
            <RovingTabs.Tab value="tab1" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab1' ? '$color12' : '$color10'} py="$2" px="$3">
                Home
              </Text>
            </RovingTabs.Tab>
            <RovingTabs.Tab value="tab2" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab2' ? '$color12' : '$color10'} py="$2" px="$3">
                Settings
              </Text>
            </RovingTabs.Tab>
            <RovingTabs.Tab value="tab3" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab3' ? '$color12' : '$color10'} py="$2" px="$3">
                Profile
              </Text>
            </RovingTabs.Tab>
          </>
        )}
      </RovingTabs>

      <Text fontSize="$6" fontWeight="600">
        Pill Style
      </Text>
      <RovingTabs value={tab} onValueChange={setTab} indicatorStyle="pill">
        {({ handleOnInteraction }) => (
          <>
            <RovingTabs.Tab value="tab1" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab1' ? '$color12' : '$color10'} py="$2" px="$3">
                Home
              </Text>
            </RovingTabs.Tab>
            <RovingTabs.Tab value="tab2" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab2' ? '$color12' : '$color10'} py="$2" px="$3">
                Settings
              </Text>
            </RovingTabs.Tab>
            <RovingTabs.Tab value="tab3" onInteraction={handleOnInteraction}>
              <Text color={tab === 'tab3' ? '$color12' : '$color10'} py="$2" px="$3">
                Profile
              </Text>
            </RovingTabs.Tab>
          </>
        )}
      </RovingTabs>

      <YStack p="$4" bg="$color2" rounded="$4">
        <Text>Current tab: {tab}</Text>
      </YStack>
    </YStack>
  )
}

// roving tabs implementation
type TabState = {
  intentAt: TabLayout | null
  activeAt: TabLayout | null
  prevActiveAt: TabLayout | null
}

type IndicatorStyle = 'underline' | 'pill'

type RenderProps = {
  handleOnInteraction: TabsTabProps['onInteraction']
  currentTab: string
}

type RovingTabsChildren = React.ReactNode | ((props: RenderProps) => React.ReactNode)

function RovingTabsRoot({
  children,
  value,
  onValueChange,
  indicatorStyle = 'underline',
  ...rest
}: {
  children: RovingTabsChildren
  value: string
  onValueChange?: (value: string) => void
  indicatorStyle?: IndicatorStyle
} & Omit<ViewProps, 'children'>) {
  const [tabState, setTabState] = useState<TabState>({
    intentAt: null,
    activeAt: null,
    prevActiveAt: null,
  })

  const setIntentIndicator = (intentAt: TabLayout | null) =>
    setTabState((prev) => ({ ...prev, intentAt }))

  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState((prev) => ({
      ...prev,
      prevActiveAt: prev.activeAt,
      activeAt,
    }))

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  const { activeAt, intentAt } = tabState

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      orientation="horizontal"
      activationMode="manual"
      {...rest}
    >
      <View position="relative">
        <AnimatePresence>
          {intentAt && (
            <RovingTabsIndicator
              key="intent"
              variant={indicatorStyle}
              width={intentAt.width}
              height={indicatorStyle === 'underline' ? 3 : intentAt.height}
              x={intentAt.x}
              y={indicatorStyle === 'underline' ? undefined : intentAt.y}
              b={indicatorStyle === 'underline' ? 0 : undefined}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeAt && (
            <RovingTabsIndicator
              key="active"
              active
              variant={indicatorStyle}
              width={activeAt.width}
              height={indicatorStyle === 'underline' ? 3 : activeAt.height}
              x={activeAt.x}
              y={indicatorStyle === 'underline' ? undefined : activeAt.y}
              b={indicatorStyle === 'underline' ? 0 : undefined}
            />
          )}
        </AnimatePresence>

        <Tabs.List loop={false} bg="transparent" gap="$2">
          {typeof children === 'function'
            ? children({
                handleOnInteraction,
                currentTab: value,
              })
            : children}
        </Tabs.List>
      </View>
    </Tabs>
  )
}

function RovingTabsTab({
  children,
  value,
  onInteraction,
  ...rest
}: {
  children: React.ReactNode
  value: string
  onInteraction?: TabsTabProps['onInteraction']
} & Omit<ViewProps, 'children'>) {
  return (
    <Tabs.Tab
      unstyled
      value={value}
      onInteraction={onInteraction}
      borderWidth={0}
      bg="transparent"
      rounded="$2"
      hoverStyle={{
        bg: 'transparent',
      }}
      pressStyle={{
        bg: 'transparent',
      }}
      {...rest}
    >
      {children}
    </Tabs.Tab>
  )
}

function RovingTabsIndicator({
  active,
  variant = 'underline',
  ...props
}: {
  active?: boolean
  variant?: IndicatorStyle
} & ViewProps) {
  const isUnderline = variant === 'underline'

  return (
    <View
      position="absolute"
      bg={active ? '$blue10' : '$color5'}
      opacity={active ? 1 : 0.5}
      rounded={isUnderline ? '$2' : '$4'}
      transition="quick"
      pointerEvents="none"
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...props}
    />
  )
}

const RovingTabs = withStaticProperties(RovingTabsRoot, {
  Tab: RovingTabsTab,
  Indicator: RovingTabsIndicator,
})

const Styyled = styled(View)

const Stylable = Styyled.styleable((props) => {
  return null
})

const context = createStyledContext({
  customProp: 'ok',
})

const StyledText = styled(Text, {
  context,

  variants: {
    customProp: {
      ok: {
        background: 'red',
      },
    },
  } as const,
})

const Y = styled(View, {
  name: 'Button',
  bg: '$color5',
  width: 500,
  height: 500,
})

export function MergeStylesTests() {
  const [show, setShow] = useState(false)

  return (
    <>
      <Button onPress={() => setShow(!show)}>show</Button>
      {/* TODO these are all is a really good test case: compiler on and off */}
      <Circle
        size={100}
        bg="red"
        transform={[{ scale: 0.9 }]}
        x={100}
        y={0}
        hoverStyle={{
          y: 20,
          // scale: 1.02,
        }}
      />

      {/* test case: ensure hoverStyle animates because it gets default aniamtable styles */}
      <Square
        transition="bouncy"
        bg="$color9"
        size={104}
        rounded="$9"
        hoverStyle={{
          scale: 1.2,
        }}
        pressStyle={{
          scale: 0.9,
        }}
      ></Square>

      {/* test case: ensure enter/exit style animate */}
      <AnimatePresence>
        {show && (
          <Circle
            bg="$shadow4"
            size={100}
            transition="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {show && (
        <Circle
          bg="$shadow4"
          size={100}
          transition="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
      )}
    </>
  )
}

// export function TextThemes() {
//   const [name, setName] = useState('dark')

//   return (
//     <YStack gap="$2">
//       {/* <Theme name="blue">
//         <Switch>
//           <Switch.Thumb transition="quicker" />
//         </Switch>
//       </Theme> */}

//       {/* <ThemeToggle /> */}

//       {/* <Link href="/sandbox2">Go to sandbox2</Link> */}

//       <Button onPress={() => setName(name === 'dark' ? 'light' : 'dark')}>
//         change {name}
//       </Button>

//       {/* <Circles /> */}
//       <SwitchBetweenNull />

//       <Theme name={name as any}>
//         {/* <TooltipSimple open label="test test">
//           <Circle size={10} />
//         </TooltipSimple> */}

//         <Circles />
//       </Theme>
//     </YStack>
//   )
// }

// const SwitchBetweenNull = memo(() => {
//   const [x, setX] = useState(false)

//   return (
//     <Theme name={x ? 'red' : null}>
//       <Button onPress={() => setX(!x)}>Toggle {x ? 'on' : 'off'}</Button>
//       <Circle size={50} bg="$color10" />
//     </Theme>
//   )
// })

// const Circles = memo(() => {
//   console.warn('cirlcers', useId())

//   return (
//     <XStack bg="$color1">
//       <Theme name="accent">
//         <MemoTestCircle size={100} bg="$color10">
//           <Slow />
//           <Fast />
//         </MemoTestCircle>
//       </Theme>

//       <Theme name="red">
//         <MemoTestCircle size={100} bg="$color10" />
//       </Theme>

//       <Theme name="surface3">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <Theme name="surface2">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <Theme name="surface1">
//         <MemoTestCircle size={100} bg="$borderColor" />
//       </Theme>

//       <MemoTestCircle />
//     </XStack>
//   )
// })

// const MemoTestCircle = memo((props: CircleProps) => {
//   return <Circle size={100} bg="$color" {...props} />
// })

// const Slow = () => {
//   console.warn('rendering Slow')
//   const [theme, state] = useThemeWithState({
//     // debug: true,
//   })

//   console.info('theme.background.val', theme.background.val, state)

//   return (
//     <Circle size={50} bg={theme.background.val as any}>
//       <Text>🐢</Text>
//     </Circle>
//   )
// }

// const Fast = () => {
//   const [theme, state] = useThemeWithState({})

//   console.info('theme.background.get()', theme.background.get(), state)

//   return (
//     <Circle size={50} bg={theme.background.get() as any}>
//       <Text>🐰</Text>
//     </Circle>
//   )
// }
