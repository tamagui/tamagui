import { useState } from 'react'
import { Text, View, XStack, YStack } from 'tamagui'

import { Button } from '../components/Button'

const LeadingIcon = ({ color, size }: { color?: any; size?: number }) => (
  <View
    testID="button-skin-leading-icon"
    backgroundColor={color}
    borderRadius={1000}
    height={size}
    width={size}
  />
)

const TrailingIcon = ({ color, size }: { color?: any; size?: number }) => (
  <View
    testID="button-skin-trailing-icon"
    backgroundColor={color}
    borderRadius={1000}
    height={size}
    width={size}
  />
)

const CircleIcon = ({ color, size }: { color?: any; size?: number }) => (
  <View
    testID="button-skin-circle-icon"
    backgroundColor={color}
    borderRadius={1000}
    height={size}
    width={size}
  />
)

export const ButtonSkin = () => {
  const [presses, setPresses] = useState(0)

  return (
    <YStack gap="$4" padding="$4">
      <Text testID="button-skin-press-count">presses:{presses}</Text>

      <XStack flexWrap="wrap" gap="$3">
        <Button
          testID="button-skin-default"
          onPress={() => setPresses((value) => value + 1)}
        >
          Default
        </Button>

        <Button
          testID="button-skin-disabled"
          disabled
          onPress={() => setPresses((value) => value + 1)}
        >
          Disabled
        </Button>

        <Button testID="button-skin-leading" icon={LeadingIcon}>
          Leading icon
        </Button>

        <Button testID="button-skin-trailing" iconAfter={TrailingIcon}>
          Trailing icon
        </Button>

        <Button
          testID="button-skin-circular"
          aria-label="Circular button"
          circular
          icon={CircleIcon}
          size="large"
        />

        <Button testID="button-skin-wide" size="wide">
          Custom wide size
        </Button>
      </XStack>

      <Button testID="button-skin-wrapped">Wrapped string text</Button>

      <Button testID="button-skin-explicit">
        <Button.Text testID="button-skin-explicit-text">Explicit text part</Button.Text>
      </Button>

      <Button testID="button-skin-nested-outer" variant="outlined">
        Outer
        <Button testID="button-skin-nested-inner" size="small" variant="quiet">
          Inner
        </Button>
      </Button>
    </YStack>
  )
}
