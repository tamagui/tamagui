// debug-verbose
// import './wdyr'

import { View as RNView } from 'react-native'
import { View, usePropsAndStyle } from 'tamagui'

const TestThing = (props) => {
  const [p2, style] = usePropsAndStyle(props)

  return null
}

export const Sandbox = () => {
  return (
    <RNView style={{ width: '100%', height: '100%', padding: 50 }}>
      {/* <Demo /> */}

      <View tag="span" animation="bouncy" w={200} h={200} bg="red" />
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
