import { useState } from 'react'
import { TamaguiProvider, Text, View, XStack, YStack } from 'tamagui'

import config from '../tamagui.config'
import { Button } from './components/Button'
import { Select } from './components/Select'
import { Sheet } from './components/Sheet'
import { CanaryVariantContext } from './imported/CanaryVariantContext'
import { CrossFileFrame } from './imported/CrossFileFrame'

const fruits = ['apple', 'banana'] as const

export function CanaryTree() {
  const [presses, setPresses] = useState(0)
  const [selectedFruit, setSelectedFruit] = useState<(typeof fruits)[number]>('apple')
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack
        testID="canary-root"
        background="$background"
        gap="$4"
        minHeight="100%"
        padding="$4"
      >
        <Text testID="canary-heading" color="$canaryTheme" fontSize="$6">
          Tamagui v3 integrated canary
        </Text>

        <View testID="canary-claimed" className="bg-canary-token p-4 rounded-4">
          <Text color="$white">Claimed Tamagui token classes</Text>
        </View>

        <View
          testID="canary-cascade"
          background="$canaryTheme"
          className="supports-[display:grid]:bg-blue-500"
        >
          <Text color="$white">Tailwind call-site utility wins the cascade</Text>
        </View>

        <View
          testID="canary-tailwind"
          data-state="open"
          className="@container grid w-[400px] grid-cols-2 gap-3 data-[state=open]:opacity-75"
        >
          <Text>Tailwind passthrough one</Text>
          <View
            testID="canary-tailwind-child"
            className="grid grid-cols-1 @[320px]:grid-cols-3"
          />
        </View>

        <CanaryVariantContext.Provider tone="accent">
          <CrossFileFrame testID="canary-cross-file" emphasis="strong" selected />
        </CanaryVariantContext.Provider>

        <XStack gap="$3" flexWrap="wrap">
          <Button testID="canary-button" onPress={() => setPresses((value) => value + 1)}>
            presses:{presses}
          </Button>
          <Text testID="canary-press-count">presses:{presses}</Text>
          <Button
            testID="canary-button-compound"
            aria-label="small circular copied button"
            circular
            size="small"
          />
          <Button testID="canary-sheet-open" onPress={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </XStack>

        <Select
          value={selectedFruit}
          onValueChange={(value) => {
            if (value === 'apple' || value === 'banana') setSelectedFruit(value)
          }}
          size="small"
        >
          <Select.Trigger testID="canary-select-trigger" w={190}>
            <Select.Value placeholder="Choose fruit" />
            <Select.Icon>
              <Text>⌄</Text>
            </Select.Icon>
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport testID="canary-select-viewport">
              <Select.Group>
                {fruits.map((fruit, index) => (
                  <Select.Item
                    testID={`canary-select-${fruit}`}
                    index={index}
                    key={fruit}
                    value={fruit}
                  >
                    <Select.ItemText>{fruit}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Text>✓</Text>
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select>

        <Text testID="canary-selected-value">selected:{selectedFruit}</Text>

        <Sheet.Root
          modal
          dismissOnOverlayPress
          onOpenChange={setSheetOpen}
          open={sheetOpen}
          snapPoints={[70]}
        >
          <Sheet.Overlay testID="canary-sheet-overlay" />
          <Sheet.Handle testID="canary-sheet-handle" />
          <Sheet.Container testID="canary-sheet-container">
            <Sheet.Background testID="canary-sheet-background" />
            <Sheet.ScrollView testID="canary-sheet-scroll-view">
              <YStack gap="$3">
                <Text>Copied Sheet skin</Text>
                <Button testID="canary-sheet-close" onPress={() => setSheetOpen(false)}>
                  Close sheet
                </Button>
              </YStack>
            </Sheet.ScrollView>
          </Sheet.Container>
        </Sheet.Root>
      </YStack>
    </TamaguiProvider>
  )
}
