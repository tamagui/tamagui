import { memo } from 'react'
import { Theme, YStack, useThemeName } from 'tamagui'

import { Masonry } from 'masonic'
import { StudioPaletteBar } from '~/features/studio/StudioPaletteBar'
import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { AllTasks } from './preview/AllTasks'
import { Calendar } from './preview/Calendar'
import { ChatScreen } from './preview/Chat'
import { Components } from './preview/Components'
import { CurrentTask } from './preview/CurrentTask'
import { LoginScreen } from './preview/Login'
import { Overview1, Overview2 } from './preview/Overviews'
import { Panel } from './preview/Panel'
import { PieScreen } from './preview/Pie'
import { PricingCards } from './preview/Pricing'
import { StatisticsBarScreen, StatisticsLineScreen } from './preview/Statistics'
import { UserDropdown } from './preview/UserDropdown'

export const StudioPreviewComponents = memo(() => {
  return (
    <>
      <PalettePreviewPanels />

      <YStack mr={-10}>
        <Masonry
          items={new Array(components.length).fill(0).map((_, id) => ({ id }))}
          render={ComponentComponent}
          columnWidth={260}
          columnGutter={18}
          rowGutter={18}
        />
      </YStack>
    </>
  )
})

const ComponentComponent = ({ index }) => {
  return components[index]
}

const components = [
  <>
    <Panel fileToCopyName="Statistics">
      <StatisticsBarScreen />
    </Panel>
  </>,
  <>
    <Panel initialAccent fileToCopyName="Statistics">
      <StatisticsLineScreen />
    </Panel>
  </>,
  <>
    <Panel fileToCopyName="Overviews" initialAccent>
      <Overview1 />
    </Panel>
  </>,
  <>
    <Panel fileToCopyName="Overviews">
      <Overview2 />
    </Panel>
  </>,
  <>
    {/* <Theme name="surface2"> */}
    <Panel fileToCopyName="Chat">
      <ChatScreen />
    </Panel>
    {/* </Theme> */}
  </>,
  <>
    <Panel fileToCopyName="UserDropdown">
      <UserDropdown />
    </Panel>
  </>,
  <>
    {/* <Theme name="surface2"> */}
    <Panel fileToCopyName="Pricing">
      <PricingCards />
    </Panel>
    {/* </Theme> */}
  </>,
  <>
    <Panel fileToCopyName="Login">
      <LoginScreen />
    </Panel>
  </>,
  <>
    {/* <Theme name="surface2"> */}
    <Panel fileToCopyName="AllTasks">
      <AllTasks />
    </Panel>
    {/* </Theme> */}
  </>,
  <>
    <Panel fileToCopyName="Statistics">
      <PieScreen />
    </Panel>
  </>,
  <>
    <Panel fileToCopyName="CurrentTask">
      <CurrentTask />
    </Panel>
  </>,
  <>
    <Panel fileToCopyName="Components">
      <Components />
    </Panel>
  </>,
  <>
    <Panel fileToCopyName="Calendar" initialAccent>
      <Calendar />
    </Panel>
  </>,
]

const PalettePreviewPanels = memo(() => {
  const themeBuilderStore = useThemeBuilderStore()
  const themeName = useThemeName()
  const isThemeDark = themeName.startsWith('dark')
  const demoProps = useDemoProps()

  const palettes = themeBuilderStore.palettesBuilt

  if (!palettes) return null

  return (
    <YStack gap="$2">
      {Object.entries(palettes).map(([name, palette]) => {
        if (
          (isThemeDark && !name.startsWith('dark')) ||
          (!isThemeDark && !name.startsWith('light'))
        ) {
          return null
        }

        return (
          <Panel
            key={name}
            disableSettings
            m={0}
            f={0}
            h="auto"
            w="calc(100% + 24px)"
            ml={-1}
          >
            <YStack
              {...demoProps.stackOutlineProps}
              {...demoProps.borderRadiusProps}
              {...demoProps.elevationProps}
              {...demoProps.panelPaddingProps}
              borderWidth={0}
              gap="$0"
              p="$0"
              ov="hidden"
            >
              <StudioPaletteBar showLabelIndices colors={palette} />
            </YStack>
          </Panel>
        )
      })}
    </YStack>
  )
})
