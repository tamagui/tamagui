import { memo } from 'react'
import { YStack, useThemeName } from 'tamagui'

import { StudioPaletteBar } from '~/features/studio/StudioPaletteBar'
import { useDemoProps } from '~/features/studio/theme/hooks/useDemoProps'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { AllTasks } from './preview/AllTasks'
import { Calendar } from './preview/Calendar'
import { ChatScreen } from './preview/Chat'
import { Components } from './preview/Components'
import { CurrentTask } from './preview/CurrentTask'
import { Header } from './preview/Header'
import { LoginScreen } from './preview/Login'
import { Overview1, Overview2 } from './preview/Overviews'
import { Panel } from './preview/Panel'
import { PieScreen } from './preview/Pie'
import { PricingCards } from './preview/Pricing'
import { StatisticsBarScreen, StatisticsLineScreen } from './preview/Statistics'
import Masonry from 'react-layout-masonry'
import { UserDropdown } from './preview/UserDropdown'

const extraPad = 18

function gridRow(items: Array<[string, number]>) {
  return items.map((item) => Array(item[1]).fill(item[0]).join(' ')).join(' ')
}

export const StudioPreviewComponents = memo(() => {
  const demoProps = useDemoProps()

  return (
    <YStack>
      <Contents />
    </YStack>
  )
})

const Contents = memo(() => {
  return (
    <Masonry columns={{ 640: 1, 768: 2, 1024: 3, 1280: 5 }} gap={12}>
      <div style={{ gridArea: 'statistics-bar' }}>
        <Panel fileToCopyName="Statistics">
          <StatisticsBarScreen />
        </Panel>
      </div>
      <div style={{ gridArea: 'statistics-line' }}>
        <Panel initialAccent fileToCopyName="Statistics">
          <StatisticsLineScreen />
        </Panel>
      </div>
      <div style={{ gridArea: 'overview-1' }}>
        <Panel initialInverse fileToCopyName="Overviews" initialAccent>
          <Overview1 />
        </Panel>
      </div>
      <div style={{ gridArea: 'overview-2' }}>
        <Panel fileToCopyName="Overviews">
          <Overview2 />
        </Panel>
      </div>
      <div style={{ gridArea: 'chat' }}>
        {/* <Theme name="surface2"> */}
        <Panel fileToCopyName="Chat">
          <ChatScreen />
        </Panel>
        {/* </Theme> */}
      </div>
      <div style={{ gridArea: 'user-dropdown' }}>
        <Panel fileToCopyName="UserDropdown">
          <UserDropdown />
        </Panel>
      </div>
      <div style={{ gridArea: 'pricing' }}>
        <Panel fileToCopyName="Pricing">
          <PricingCards />
        </Panel>
      </div>
      <div style={{ gridArea: 'login' }}>
        <Panel fileToCopyName="Login">
          <LoginScreen />
        </Panel>
      </div>
      <div style={{ gridArea: 'all-tasks' }}>
        <Panel fileToCopyName="AllTasks">
          <AllTasks />
        </Panel>
      </div>
      <div style={{ gridArea: 'pie' }}>
        <Panel fileToCopyName="Statistics">
          <PieScreen />
        </Panel>
      </div>
      <div style={{ gridArea: 'current-task' }}>
        <Panel fileToCopyName="CurrentTask">
          <CurrentTask />
        </Panel>
      </div>
      <div style={{ gridArea: 'components' }}>
        <Panel fileToCopyName="Components">
          <Components />
        </Panel>
      </div>
      <div style={{ gridArea: 'calendar' }}>
        <Panel fileToCopyName="Calendar" initialAccent>
          <Calendar />
        </Panel>
      </div>
    </Masonry>
  )
})

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
