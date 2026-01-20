import { Heading } from '@tamagui/lucide-icons'
import { memo } from 'react'
import {
  Label,
  SizableText,
  Square,
  Switch,
  ToggleGroup,
  TooltipGroup,
  TooltipSimple,
  XStack,
  styled,
} from 'tamagui'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { optionValues } from './demoOptions'

export const StudioPreviewComponentsBar = memo(({ scrollView }: { scrollView: any }) => {
  return (
    <XStack z={1000} mt={-10} data-tauri-drag-region className="all ease-in ms300">
      <XStack flexWrap="wrap" flex={1} flexBasis="auto" gap="$3">
        <TooltipGroup delay={{ open: 0, close: 300 }}>
          <BorderRadiusInput />

          <BorderWidthInput />

          <FontFamilyInput />

          <FillStyleInput />

          <ElevationInput />

          <SpacingInput />

          <TextAccentInput />

          <BackgroundAccentInput />
        </TooltipGroup>
      </XStack>
    </XStack>
  )
})

export default StudioPreviewComponentsBar

const ToggleGroupItem = styled(ToggleGroup.Item, {
  height: 28,
  width: 30,

  focusStyle: {
    backgroundColor: '$color10',
  },

  focusVisibleStyle: {
    outlineWidth: 0,
  },
})

export function BorderRadiusInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" items="center">
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
        <TooltipSimple label="No border radius">
          <ToggleGroupItem
            value={optionValues.borderRadius[0] as any}
            aria-label="No border radius"
          >
            <Square size={11} bg="$color9" rounded={0} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Small border radius">
          <ToggleGroupItem
            value={optionValues.borderRadius[1] as any}
            aria-label="Small border radius"
          >
            <Square size={11} bg="$color9" rounded={2} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Medium border radius">
          <ToggleGroupItem
            value={optionValues.borderRadius[2] as any}
            aria-label="Medium border radius"
          >
            <Square size={11} bg="$color9" rounded={3} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Large border radius">
          <ToggleGroupItem
            value={optionValues.borderRadius[3] as any}
            aria-label="Large border radius"
          >
            <Square size={11} bg="$color9" rounded={4} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Very large border radius">
          <ToggleGroupItem
            value={optionValues.borderRadius[4] as any}
            aria-label="Very large border radius"
          >
            <Square size={11} bg="$color9" rounded={7} />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function BorderWidthInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" items="center">
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
        <TooltipSimple label="No border width">
          <ToggleGroupItem
            value={`${optionValues.borderWidth[0]}`}
            aria-label="No border width"
          >
            <Square
              size={11}
              borderColor="$color9"
              borderWidth={0.5}
              borderStyle="dotted"
            />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Slim border width">
          <ToggleGroupItem
            value={`${optionValues.borderWidth[1]}`}
            aria-label="Slim border width"
          >
            <Square size={11} borderColor="$color9" borderWidth={1} />
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Small border width">
          <ToggleGroupItem
            value={`${optionValues.borderWidth[2]}`}
            aria-label="Small border width"
          >
            <Square size={11} borderColor="$color9" borderWidth={2} />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function FontFamilyInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" items="center">
      <ToggleGroup
        disableDeactivation
        orientation={'horizontal'}
        type={'single'}
        size="$2"
        value={store.demosOptions.headingFontFamily?.toString() ?? ''}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            headingFontFamily: value as any,
          }
        }}
      >
        {optionValues.headingFontFamily.map((font, idx) => {
          const label = `${font} Font`
          return (
            <TooltipSimple groupId={idx.toString()} key={String(font)} label={`${font}`}>
              <ToggleGroupItem value={font as any} aria-label={label}>
                <SizableText
                  color="$color12"
                  fontFamily={font as any}
                  fontSize={12}
                  textTransform="none"
                  letterSpacing={0}
                  lineHeight={0}
                  mt={-2}
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
    <XStack gap="$3" items="center">
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
            <Square
              size={10}
              rounded="$4"
              bg="$color8"
              borderWidth={1}
              borderColor="$color"
            />
          </ToggleGroupItem>
        </TooltipSimple>
        <TooltipSimple groupId="2" label="Outlined">
          <ToggleGroupItem value="outlined" aria-label="Outlined">
            <Square size={10} rounded="$4" borderWidth={1} borderColor="$color" />
          </ToggleGroupItem>
        </TooltipSimple>
      </ToggleGroup>
    </XStack>
  )
}

export function ElevationInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" items="center">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        size="$2"
        value={store.demosOptions.elevation?.toString() ?? ''}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            elevation: value as any,
          }
        }}
      >
        <TooltipSimple label="No Shadow">
          <ToggleGroupItem value="$0" aria-label="No Shadow">
            <Square size={10} borderWidth={1} borderColor="$color" />
          </ToggleGroupItem>
        </TooltipSimple>
        <TooltipSimple label="Subtle Shadow">
          <ToggleGroupItem value="$1" aria-label="Subtle Shadow">
            <Square size={10} y={-1} x={-1} position="relative">
              <Square size={10} position="absolute" bg="$color8" b={-2} r={-2} />
              <Square
                size={10}
                position="absolute"
                borderWidth={1}
                borderColor="$color"
              />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Intense Shadow">
          <ToggleGroupItem value="$2" aria-label="Intense Shadow">
            <Square size={10} y={-2} x={-2} position="relative">
              <Square size={12} position="absolute" bg="$color8" b={-4} r={-4} />
              <Square
                size={10}
                position="absolute"
                borderWidth={1}
                borderColor="$color"
              />
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
    <XStack gap="$3" items="center">
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
            <Square
              rounded="$1"
              size={10}
              borderWidth="$0.5"
              borderColor="$color"
              position="relative"
            >
              <Square size={6} position="absolute" bg="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Medium Padding">
          <ToggleGroupItem value="md" aria-label="Medium Padding">
            <Square
              rounded="$1"
              size={10}
              borderWidth="$0.5"
              borderColor="$color"
              position="relative"
            >
              <Square size={3} position="absolute" bg="$color" />
            </Square>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Large Padding">
          <ToggleGroupItem value="lg" aria-label="Large Padding">
            <Square
              rounded="$1"
              size={10}
              borderWidth="$0.5"
              borderColor="$color"
              position="relative"
            >
              <Square size={1} position="absolute" bg="$color" />
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
    <XStack gap="$3" items="center">
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
            <XStack items="flex-end" opacity={0.4}>
              <Heading size={10} />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Text High Contrast">
          <ToggleGroupItem value="high" aria-label="Text High Contrast" p="$0">
            <XStack items="flex-end">
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
    <XStack gap="$3" items="center">
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
            <XStack items="center" gap="$1">
              <Square size={8} bg="$color" opacity={0.5} />
            </XStack>
          </ToggleGroupItem>
        </TooltipSimple>

        <TooltipSimple label="Normal Background Accent">
          <ToggleGroupItem value="low" aria-label="Normal Background Accent" p="$0">
            <XStack items="center" gap="$1">
              <Square size={8} bg="$color" />
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
    <XStack gap="$3" items="center">
      <Label
        size="$2"
        color="$color10"
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
        <Switch.Thumb transition="quickest" />
      </Switch>
    </XStack>
  )
}
