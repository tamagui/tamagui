import { Stack, styled } from '@tamagui/core'
import { createSwitch } from '@tamagui/switch'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(Stack, {
  width: 40,
  height: 20,
  rounded: 20,
  variants: {
    checked: {
      true: {
        backgroundColor: 'lightblue',
      },
      false: {
        backgroundColor: 'silver',
      },
    },
  } as const,
  defaultVariants: {
    checked: false,
  },
})

const Thumb = styled(Stack, {
  width: 20,
  height: 20,
  bg: 'black',
  rounded: 20,

  variants: {
    checked: {
      true: {
        opacity: 0.8,
      },
      false: {
        opacity: 0.5,
      },
    },
  } as const,
})

export const Switch = createSwitch({
  Frame,
  Thumb,
})

export function SwitchUnstyledDemo() {
  return (
    <YStack width={200} items="center" gap="$3">
      <XStack gap="$3" items="center">
        <Label htmlFor="unstyled-switch">Unstyled</Label>
        <Switch defaultChecked id="unstyled-switch">
          <Switch.Thumb transition="quickest" />
        </Switch>
      </XStack>
    </YStack>
  )
}
