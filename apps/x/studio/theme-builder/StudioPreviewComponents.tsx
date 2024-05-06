import { Dices, Heading } from '@tamagui/lucide-icons'
import { memo, useRef } from 'react'
import {
  Button,
  Label,
  SizableText,
  Square,
  Switch,
  ToggleGroup,
  TooltipSimple,
  XStack,
  YStack,
  styled,
  useThemeName,
} from 'tamagui'

import { useDemoProps } from '../hooks/useDemoProps'
import { StudioPaletteBar } from '../StudioPaletteBar'
import { optionValues } from './constants/demoOptions'
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
import { useThemeBuilderStore } from './ThemeBuilderStore'
import { extraPad } from './views/StudioPreviewFrame'

const ToggleGroupItem = styled(ToggleGroup.Item, {
  height: 28,
  w: 30,

  focusStyle: {
    outlineWidth: 0,
  },
} as any)

function gridRow(items: Array<[string, number]>) {
  return items.map((item) => Array(item[1]).fill(item[0]).join(' ')).join(' ')
}

export const StudioPreviewComponents = memo(() => {
  const previewRef = useRef<HTMLElement>()
  const demoProps = useDemoProps()

  return (
    <YStack data-tauri-drag-region gap="$4" ref={previewRef as any}>
      <Panel disableSettings m={0} f={0} h="auto" w="calc(100% + 24px)">
        <YStack
          {...demoProps.panelProps}
          {...demoProps.stackOutlineProps}
          {...demoProps.borderRadiusProps}
          {...demoProps.panelPaddingProps}
          backgroundColor="transparent"
          borderColor="transparent"
          gap="$0"
        >
          <Header />
        </YStack>
      </Panel>

      <PalettePreviewPanels />

      <YStack
        f={1}
        style={{
          display: 'grid',
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
        }}
        $xl={
          {
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
        $lg={
          {
            gridTemplateColumns: `50% 50%`,
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
      >
        <Contents />
      </YStack>
    </YStack>
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
        <Panel fileToCopyName="Statistics">
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

export function BorderRadiusInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.borderRadius?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            borderRadius: value as any,
          }
        }}
      >
        <TooltipSimple label="Slim border width">
          <ToggleGroupItem
            value={optionValues.borderRadius[0] as any}
            aria-label="Slim border width"
          >
            <Square size={11} bg="$color9" borderRadius={0} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Small border width">
          <ToggleGroupItem
            value={optionValues.borderRadius[1] as any}
            aria-label="Small border width"
          >
            <Square size={11} bg="$color9" borderRadius={2} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Medium border width">
          <ToggleGroupItem
            value={optionValues.borderRadius[2] as any}
            aria-label="Medium border width"
          >
            <Square size={11} bg="$color9" borderRadius={3} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Large border width">
          <ToggleGroupItem
            value={optionValues.borderRadius[3] as any}
            aria-label="Large border width"
          >
            <Square size={11} bg="$color9" borderRadius={4} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Very large border width">
          <ToggleGroupItem
            value={optionValues.borderRadius[4] as any}
            aria-label="Very large border width"
          >
            <Square size={11} bg="$color9" borderRadius={7} />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function BorderWidthInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.borderWidth?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            borderWidth: +value as any,
          }
        }}
      >
        <TooltipSimple label="Slim border width">
          <ToggleGroupItem
            value={`${optionValues.borderWidth[0]}`}
            aria-label="Slim border width"
          >
            <Square size={11} bc="$color9" bw={0.5} o={0.2} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Small border width">
          <ToggleGroupItem
            value={`${optionValues.borderWidth[1]}`}
            aria-label="Small border width"
          >
            <Square size={11} bc="$color9" bw={1} />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

const niceNames = {
  $heading: 'Inter',
  $headingNohemi: 'Nohemi',
  $headingDmSans: 'DM Sans',
  $headingDmSerifDisplay: 'DM Serif',
}

export function FontFamilyInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.headingFontFamily?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            headingFontFamily: value as any,
          }
        }}
      >
        {optionValues.headingFontFamily.map((font, idx) => {
          const niceName = niceNames[font as any]
          const label = `${niceName} Font`
          return (
            <TooltipSimple groupId={idx.toString()} key={String(font)} label={niceName}>
              <ToggleGroupItem value={font as any} aria-label={label}>
                <SizableText
                  fontFamily={font as any}
                  size="$1"
                  textTransform="none"
                  letterSpacing={0}
                  lineHeight={0}
                  y={0.5}
                  mt={-2}
                  scale={1.15}
                  {...(niceName === 'Nohemi' && {
                    scale: 0.9,
                    y: 1.5,
                  })}
                  {...(niceName === 'DM Sans' && {
                    scale: 0.95,
                  })}
                  {...(niceName === 'DM Serif' && {
                    y: 0,
                    scale: 0.85,
                  })}
                >
                  Aa
                </SizableText>
              </ToggleGroupItem>
            </TooltipSimple>
          )
        })}
      </ToggleGroup>
    </XStack>
  )
}

export function FillStyleInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.fillStyle?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            fillStyle: value as any,
          }
        }}
      >
        <TooltipSimple groupId="1" label="Filled">
          <ToggleGroupItem value="filled" aria-label="Filled">
            <Square size={10} br="$4" bg="$color8" bw={1} bc="$color" />
          </ToggleGroupItem>
        </TooltipSimple>
        <TooltipSimple groupId="2" label="Outlined">
          <ToggleGroupItem value="outlined" aria-label="Outlined">
            <Square size={10} br="$4" bw={1} bc="$color" />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function ElevationInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.elevation?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            elevation: value as any,
          }
        }}
      >
        <TooltipSimple label="No Shadow">
          <ToggleGroupItem value="$0" aria-label="No Shadow">
            <Square size={10} bw={1} bc="$color" />
          </ToggleGroupItem>
        </TooltipSimple>
        <TooltipSimple label="Subtle Shadow">
          <ToggleGroupItem value="$1" aria-label="Subtle Shadow">
            <Square size={10} y={-1} x={-1}>
              <Square size={10} pos="absolute" bg="$color8" bottom={-2} right={-2} />
              <Square size={10} pos="absolute" bw={1} bc="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Intense Shadow">
          <ToggleGroupItem value="$2" aria-label="Intense Shadow">
            <Square size={10} y={-2} x={-2}>
              <Square size={12} pos="absolute" bg="$color8" bottom={-4} right={-4} />
              <Square size={10} pos="absolute" bw={1} bc="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function SpacingInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.spacing?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            spacing: value as any,
          }
        }}
      >
        <TooltipSimple label="Small Padding">
          <ToggleGroupItem value="sm" aria-label="Small Padding">
            <Square br="$1" size={10} borderWidth="$0.5" borderColor="$color">
              <Square size={6} pos="absolute" bg="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Medium Padding">
          <ToggleGroupItem value="md" aria-label="Medium Padding">
            <Square br="$1" size={10} borderWidth="$0.5" borderColor="$color">
              <Square size={3} pos="absolute" bg="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Large Padding">
          <ToggleGroupItem value="lg" aria-label="Large Padding">
            <Square br="$1" size={10} borderWidth="$0.5" borderColor="$color">
              <Square size={1} pos="absolute" bg="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function TextAccentInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.textAccent?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            textAccent: value as any,
          }
        }}
      >
        <TooltipSimple label="Text Low Contrast">
          <ToggleGroupItem value="low" aria-label="Text Low Contrast" p="$0">
            <XStack ai="flex-end" o={0.4}>
              <Heading size={10} />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Text High Contrast">
          <ToggleGroupItem value="high" aria-label="Text High Contrast" p="$0">
            <XStack ai="flex-end">
              <Heading size={10} />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function BackgroundAccentInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.backgroundAccent?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            backgroundAccent: value as any,
          }
        }}
      >
        <TooltipSimple label="Soft Background Accent">
          <ToggleGroupItem value="high" aria-label="Soft Background Accent" p="$0">
            <XStack ai="center" gap="$1">
              <Square size={8} backgroundColor="$color" o={0.5} />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Normal Background Accent">
          <ToggleGroupItem value="low" aria-label="Normal Background Accent" p="$0">
            <XStack ai="center" gap="$1">
              <Square size={8} backgroundColor="$color" />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function InverseAccentInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" ai="center">
      <Label
        size="$2"
        theme="alt1"
        htmlFor="switch-accent-switch"
        onPress={() => {
          // for some reason id+htmlFor is not triggering - manually change the value here
          store.demosOptions = {
            ...store.demosOptions,
            inverseAccent: !store.demosOptions.inverseAccent,
          }
        }}
      >
        Inverse Accent
      </Label>
      <Switch
        id="switch-accent-switch"
        size="$1"
        checked={store.demosOptions.inverseAccent}
        onCheckedChange={(newVal) => {
          store.demosOptions = {
            ...store.demosOptions,
            inverseAccent: newVal,
          }
        }}
      >
        <Switch.Thumb animation="quickest" />
      </Switch>
    </XStack>
  )
}

export function RandomizeButton() {
  const store = useThemeBuilderStore()

  return (
    <TooltipSimple label="Randomize">
      <Button
        aria-label="Randomize"
        onPress={() => {
          store.randomizeDemoOptions()
        }}
        icon={Dices}
        size="$2"
        height={28}
        scaleIcon={1.4}
        br="$5"
      />
    </TooltipSimple>
  )
}

const PalettePreviewPanels = memo(() => {
  const themeBuilderStore = useThemeBuilderStore()
  const themeName = useThemeName()
  const isThemeDark = themeName.startsWith('dark_') || themeName === 'dark'
  const demoProps = useDemoProps()
  const theme = themeBuilderStore.baseTheme

  if (!theme) return null

  const palettes = themeBuilderStore.palettesBuilt

  if (!palettes) return null

  return (
    <YStack gap="$2">
      {[theme.palette, theme.accent?.palette || ''].filter(Boolean).map((name) => {
        const scheme = isThemeDark ? 'dark' : 'light'
        const palette = palettes[name] || palettes[`${scheme}_${name}`]

        if (!palette) {
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
