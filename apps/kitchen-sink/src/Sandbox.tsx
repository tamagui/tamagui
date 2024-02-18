// debug-verbose
// import './wdyr'

import { View as RNView } from 'react-native'
import { View, Stack, XStack, YStack, usePropsAndStyle } from 'tamagui'

const TestThing = (props) => {
  const [p2, style] = usePropsAndStyle(props)

  return null
}

export const Sandbox = () => {
  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      <Demo />
    </RNView>
  )
}

const Demo = () => (
  <View f={1} ai="center" jc="center">
    <View
      bg="$green7"
      h={200}
      w={200}
      br={0}
      animation="lazy"
      pressStyle={{
        scale: 0.75,
        br: '$10',
      }}
    />
  </View>
)

// animationKeyframes: {
//   from: {
//     opacity: 0,
//     transform: [{ translateY: 50 }],
//   },
//   to: {
//     opacity: 1,
//     transform: [{ translateY: 0 }],
//   },
// },
// animationDuration: '0.8s',
// animationFillMode: 'both',
// animationDelay: '800ms',

import { styled } from '@tamagui/core'

import { SwitchStyledContext, createSwitch } from '@tamagui/switch'

import { Label } from 'tamagui'
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
