import { Masonry } from 'masonic'
import { memo } from 'react'
import { XStack, YStack, styled, useThemeName } from 'tamagui'
import { StudioPaletteBar } from '~/features/studio/StudioPaletteBar'
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

export const StudioPreviewComponents = memo(({ isReady }: { isReady: boolean }) => {
  if (!isReady) return null

  return (
    <>
      <YStack>
        <Masonry
          items={new Array(components.length).fill(0).map((_, id) => ({ id }))}
          render={ComponentComponent}
          columnWidth={260}
          columnGutter={18}
          rowGutter={18}
        />
      </YStack>
      <PalettePreviewPanels />
    </>
  )
})

export default StudioPreviewComponents

const ComponentComponent = ({ index }) => {
  return components[index]
}

const components = [
  <>
    <Panel key="" fileToCopyName="Statistics">
      <StatisticsBarScreen />
    </Panel>
  </>,
  <>
    <Panel key="" initialAccent fileToCopyName="Statistics">
      <StatisticsLineScreen />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Overviews" initialAccent>
      <Overview1 />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Overviews">
      <Overview2 />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Chat">
      <ChatScreen />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="UserDropdown">
      <UserDropdown />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Pricing">
      <PricingCards />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Login">
      <LoginScreen />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="AllTasks">
      <AllTasks />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Statistics">
      <PieScreen />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="CurrentTask">
      <CurrentTask />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Components">
      <Components />
    </Panel>
  </>,
  <>
    <Panel key="" fileToCopyName="Calendar" initialAccent>
      <Calendar />
    </Panel>
  </>,
]

const PalettePreviewPanels = memo(() => {
  const themeBuilderStore = useThemeBuilderStore()
  const themeName = useThemeName()
  const isThemeDark = themeName.startsWith('dark')

  const palettes = themeBuilderStore.palettesBuilt

  if (!palettes) return null

  return (
    <XStack flexWrap="wrap" gap="$2">
      {Object.entries(palettes).map(([name, palette]) => {
        if (
          (isThemeDark && !name.startsWith('dark')) ||
          (!isThemeDark && !name.startsWith('light'))
        ) {
          return null
        }

        return (
          <Panel key={name} disableSettings m={0} height="auto" flex={1}>
            <YStack borderWidth={0} gap="$0" p="$0" overflow="hidden">
              <StudioPaletteBar showLabelIndices colors={palette} />
            </YStack>
          </Panel>
        )
      })}
    </XStack>
  )
})

export const StudioPreviewComponentsSkeleton = memo(() => {
  return (
    <>
      <YStack mr={-10}>
        <XStack flexWrap="wrap" gap="$4">
          {[...Array(13)].map((_, index) => (
            <ComponentSkeleton key={index} index={index} />
          ))}
        </XStack>
      </YStack>
    </>
  )
})

const Skeleton = styled(YStack, {
  bg: '$color2',
})

const ComponentSkeleton = ({ index }) => {
  const heights = [200, 280, 320, 240, 300]
  const height = heights[index % heights.length]

  return (
    <YStack width="calc(33.33% - 16px)" mb="$4">
      <Skeleton height={height} width="100%" rounded={16} />
    </YStack>
  )
}
