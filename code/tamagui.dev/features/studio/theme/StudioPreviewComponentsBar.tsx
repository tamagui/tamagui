import { Heading } from '@tamagui/lucide-icons'
import { memo, useState } from 'react'
import {
  Label,
  Paragraph,
  SizableText,
  Square,
  Switch,
  ToggleGroup,
  Tooltip,
  TooltipGroup,
  XGroup,
  XStack,
  styled,
} from 'tamagui'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { optionValues } from './demoOptions'

export const StudioPreviewComponentsBar = memo(({ scrollView }: { scrollView: any }) => {
  return (
    <XStack z={1000} mt={-10} data-tauri-drag-region className="all ease-in ms300">
      <XStack flexWrap="nowrap" flex={1} flexBasis="auto" gap="$3">
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
  borderRadius: '$4',

  focusStyle: {
    backgroundColor: '$color10',
  },

  focusVisibleStyle: {
    outlineWidth: 0,
  },
})

export function BorderRadiusInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="border-radius" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.borderRadius?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            borderRadius: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="border-radius"
            asChild
            onMouseEnter={() => setLabel('No radius')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={optionValues.borderRadius[0] as any}
                  aria-label="No border radius"
                >
                  <Square size={11} bg="$color9" rounded={0} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-radius"
            asChild
            onMouseEnter={() => setLabel('Small radius')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={optionValues.borderRadius[1] as any}
                  aria-label="Small border radius"
                >
                  <Square size={11} bg="$color9" rounded={2} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-radius"
            asChild
            onMouseEnter={() => setLabel('Medium radius')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={optionValues.borderRadius[2] as any}
                  aria-label="Medium border radius"
                >
                  <Square size={11} bg="$color9" rounded={3} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-radius"
            asChild
            onMouseEnter={() => setLabel('Large radius')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={optionValues.borderRadius[3] as any}
                  aria-label="Large border radius"
                >
                  <Square size={11} bg="$color9" rounded={4} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-radius"
            asChild
            onMouseEnter={() => setLabel('Very large radius')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={optionValues.borderRadius[4] as any}
                  aria-label="Very large border radius"
                >
                  <Square size={11} bg="$color9" rounded={7} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="border-radius"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="border-radius" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function BorderWidthInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="border-width" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.borderWidth?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            borderWidth: +value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="border-width"
            asChild
            onMouseEnter={() => setLabel('No border')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-width"
            asChild
            onMouseEnter={() => setLabel('Slim border')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={`${optionValues.borderWidth[1]}`}
                  aria-label="Slim border width"
                >
                  <Square size={11} borderColor="$color9" borderWidth={1} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="border-width"
            asChild
            onMouseEnter={() => setLabel('Thick border')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem
                  value={`${optionValues.borderWidth[2]}`}
                  aria-label="Thick border width"
                >
                  <Square size={11} borderColor="$color9" borderWidth={2} />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="border-width"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="border-width" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function FontFamilyInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="font-family" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.headingFontFamily?.toString() ?? ''}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            headingFontFamily: value as any,
          }
        }}
      >
        <XGroup>
          {optionValues.headingFontFamily.map((font) => (
            <Tooltip.Trigger
              scope="font-family"
              key={String(font)}
              asChild
              onMouseEnter={() => setLabel(`${font}`)}
            >
              <XStack>
                <XGroup.Item>
                  <ToggleGroupItem value={font as any} aria-label={`${font} Font`}>
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
                </XGroup.Item>
              </XStack>
            </Tooltip.Trigger>
          ))}
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="font-family"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="font-family" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function FillStyleInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="fill-style" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.fillStyle?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            fillStyle: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="fill-style"
            asChild
            onMouseEnter={() => setLabel('Filled')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="filled" aria-label="Filled">
                  <Square
                    size={10}
                    rounded="$4"
                    bg="$color8"
                    borderWidth={1}
                    borderColor="$color"
                  />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="fill-style"
            asChild
            onMouseEnter={() => setLabel('Outlined')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="outlined" aria-label="Outlined">
                  <Square size={10} rounded="$4" borderWidth={1} borderColor="$color" />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="fill-style"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="fill-style" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function ElevationInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="elevation" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.elevation?.toString() ?? ''}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            elevation: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="elevation"
            asChild
            onMouseEnter={() => setLabel('No shadow')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="$0" aria-label="No Shadow">
                  <Square size={10} borderWidth={1} borderColor="$color" />
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="elevation"
            asChild
            onMouseEnter={() => setLabel('Subtle shadow')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="elevation"
            asChild
            onMouseEnter={() => setLabel('Intense shadow')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="elevation"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="elevation" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function SpacingInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="spacing" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.spacing?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            spacing: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="spacing"
            asChild
            onMouseEnter={() => setLabel('Small padding')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="spacing"
            asChild
            onMouseEnter={() => setLabel('Medium padding')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="spacing"
            asChild
            onMouseEnter={() => setLabel('Large padding')}
          >
            <XStack>
              <XGroup.Item>
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
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="spacing"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="spacing" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function TextAccentInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="text-accent" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.textAccent?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            textAccent: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="text-accent"
            asChild
            onMouseEnter={() => setLabel('Low contrast')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="low" aria-label="Text Low Contrast" p="$0">
                  <XStack items="flex-end" opacity={0.4}>
                    <Heading size={10} />
                  </XStack>
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="text-accent"
            asChild
            onMouseEnter={() => setLabel('High contrast')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="high" aria-label="Text High Contrast" p="$0">
                  <XStack items="flex-end">
                    <Heading size={10} />
                  </XStack>
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="text-accent"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="text-accent" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function BackgroundAccentInput() {
  const store = useThemeBuilderStore()
  const [label, setLabel] = useState('')

  return (
    <Tooltip scope="bg-accent" offset={8} placement="bottom">
      <ToggleGroup
        disableDeactivation
        orientation="horizontal"
        type="single"
        value={store.demosOptions.backgroundAccent?.toString()}
        onValueChange={(value) => {
          store.demosOptions = {
            ...store.demosOptions,
            backgroundAccent: value as any,
          }
        }}
      >
        <XGroup>
          <Tooltip.Trigger
            scope="bg-accent"
            asChild
            onMouseEnter={() => setLabel('Soft background')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="high" aria-label="Soft Background Accent" p="$0">
                  <XStack items="center" gap="$1">
                    <Square size={8} bg="$color" opacity={0.5} />
                  </XStack>
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>

          <Tooltip.Trigger
            scope="bg-accent"
            asChild
            onMouseEnter={() => setLabel('Normal background')}
          >
            <XStack>
              <XGroup.Item>
                <ToggleGroupItem value="low" aria-label="Normal Background Accent" p="$0">
                  <XStack items="center" gap="$1">
                    <Square size={8} bg="$color" />
                  </XStack>
                </ToggleGroupItem>
              </XGroup.Item>
            </XStack>
          </Tooltip.Trigger>
        </XGroup>
      </ToggleGroup>

      <Tooltip.Content
        scope="bg-accent"
        animatePosition
        transition="quick"
        bg="$background"
        elevation="$2"
        rounded="$4"
        px="$2.5"
        py="$1"
        enterStyle={{ y: -4, opacity: 0 }}
        exitStyle={{ y: -4, opacity: 0 }}
      >
        <Tooltip.Arrow scope="bg-accent" />
        <Paragraph size="$3">{label}</Paragraph>
      </Tooltip.Content>
    </Tooltip>
  )
}

export function InverseAccentInput() {
  const store = useThemeBuilderStore()

  return (
    <XStack gap="$3" items="center">
      <Label
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
