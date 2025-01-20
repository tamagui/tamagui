import { memo, useRef } from 'react'
import { XStack, YStack, useThemeName } from 'tamagui'

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
import { UserDropdown } from './preview/UserDropdown'

const extraPad = 18

function gridRow(items: Array<[string, number]>) {
  return items.map((item) => Array(item[1]).fill(item[0]).join(' ')).join(' ')
}

export const StudioPreviewComponents = memo(() => {
  const previewRef = useRef<HTMLElement>()
  const demoProps = useDemoProps()

  return (
    <XStack w="100%" pr={570} $md={{ pr: 80 }} jc="flex-end">
      <YStack
        gap="$4"
        ref={previewRef as any}
        mt="$-4"
        p="$8"
        f={1}
        maw={1300}
        group="content"
        $md={{
          maw: 900,
          p: '$4',
        }}
      >
        <Panel disableSettings m={0} f={0} h="auto" w="calc(100% + 24px)">
          <YStack
            {...demoProps.panelProps}
            {...demoProps.stackOutlineProps}
            {...demoProps.borderRadiusProps}
            {...demoProps.panelPaddingProps}
            backgroundColor="transparent"
            borderColor="transparent"
            px={0}
            gap="$0"
          >
            <Header />
          </YStack>
        </Panel>

        <PalettePreviewPanels />

        <YStack
          f={1}
          display={'grid' as any}
          $group-content={
            {
              gridTemplateColumns: `50% 50%`,
              gridGap: `${extraPad}px ${extraPad * (12 / 10)}px`,
              gridTemplateAreas: `
              'chat chat'
              'statistics-line statistics-line'
              'all-tasks all-tasks'
              'current-task current-task'
              'user-dropdown user-dropdown'
              'pie pie'
              'overview-1 overview-2'
              'pricing pricing'
              'statistics-bar statistics-bar'
              'login login'
              'calendar calendar'
              'components components'
              `,
            } as any
          }
          $group-content-gtXs={
            {
              gridTemplateColumns: Array(12)
                .fill(`calc(${100 / 12}% - ${extraPad}px)`)
                .join(' '),
              gridGap: `${extraPad}px ${extraPad * (12 / 10)}px`,
              gridTemplateAreas: `
              '${gridRow([
                ['statistics-line', 7],
                ['pricing', 5],
              ])}'
              '${gridRow([
                ['chat', 7],
                ['pricing', 5],
              ])}'
              '${gridRow([
                ['chat', 7],
                ['pricing', 5],
              ])}'
              '${gridRow([
                ['chat', 7],
                ['pie', 5],
              ])}'
              '${gridRow([
                ['chat', 7],
                ['pie', 5],
              ])}'
              '${gridRow([
                ['overview-1', 4],
                ['statistics-bar', 8],
              ])}'
              '${gridRow([
                ['overview-2', 4],
                ['statistics-bar', 8],
              ])}'
              '${gridRow([
                ['current-task', 6],
                ['login', 6],
              ])}'
              '${gridRow([
                ['all-tasks', 6],
                ['login', 6],
              ])}'
              '${gridRow([
                ['calendar', 6],
                ['user-dropdown', 6],
              ])}'
              '${gridRow([['components', 12]])}'
          `,
            } as any
          }
          $group-content-gtSm={
            {
              gridTemplateColumns: Array(12)
                .fill(`calc(${100 / 12}% - ${extraPad}px)`)
                .join(' '),
              gridGap: `${extraPad}px ${extraPad * (12 / 10)}px`,
              gridTemplateAreas: `
              '${gridRow([
                ['chat', 5],
                ['overview-1', 3],
                ['user-dropdown', 4],
              ])}'
              '${gridRow([
                ['chat', 5],
                ['overview-2', 3],
                ['user-dropdown', 4],
              ])}'
              '${gridRow([
                ['chat', 5],
                ['statistics-line', 3],
                ['statistics-line', 4],
              ])}'

              '${gridRow([
                ['statistics-bar', 6],
                ['pricing', 6],
              ])}'
              '${gridRow([
                ['login', 4],
                ['pie', 4],
                ['current-task', 4],
              ])}'
              '${gridRow([
                ['calendar', 4],
                ['components', 4],
                ['all-tasks', 4],
              ])}'
            `,
            } as any
          }
        >
          <Contents />
        </YStack>
      </YStack>
    </XStack>
  )
})

const Contents = memo(() => {
  return (
    <>
      <div style={{ gridArea: 'login' }}>
        <Panel fileToCopyName="Login">
          <LoginScreen />
        </Panel>
      </div>
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
        <Panel fileToCopyName="Overviews" initialAccent>
          <Overview1 />
        </Panel>
      </div>
      <div style={{ gridArea: 'overview-2' }}>
        <Panel fileToCopyName="Overviews">
          <Overview2 />
        </Panel>
      </div>
      <div style={{ gridArea: 'chat' }}>
        <Panel fileToCopyName="Chat">
          <ChatScreen />
        </Panel>
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
    </>
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
