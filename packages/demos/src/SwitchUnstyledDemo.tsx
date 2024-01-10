import { Stack, styled } from '@tamagui/core'
import { SwitchStyledContext, createSwitch } from '@tamagui/switch'
import { Label, XStack, YStack } from 'tamagui'

const Frame = styled(Stack, {
  context: SwitchStyledContext,
  width: 40,
  height: 20,
  borderRadius: 20,
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
  context: SwitchStyledContext,
  width: 20,
  height: 20,
  backgroundColor: 'black',
  borderRadius: 20,

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

// TODO: remove ts-ignores
export const Switch = createSwitch({
  // @ts-ignore
  Frame,
  // @ts-ignore
  Thumb,
})

export function SwitchUnstyledDemo() {
  return (
    <YStack width={200} alignItems="center" space="$3">
      <XStack space="$3" alignItems="center">
        <Label htmlFor="unstyled-switch">Unstyled</Label>
        <Switch defaultChecked id="unstyled-switch">
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
    </YStack>
  )
}
