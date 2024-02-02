// debug-verbose
// import './wdyr'

import { useState } from 'react'
import { View } from 'react-native'
import { Button, Stack, XStack, YStack } from 'tamagui'
import { TimedRender } from './components/TimedRender'

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        {/* <AnimatedNumbers /> */}
        {/* <Square debug="verbose" size={100} bg="$tokenNonExistent" /> */}

        <YStack>
          <MeasureTamagui />
        </YStack>

        <YStack>
          <MeasureNative />
        </YStack>
      </>
    </View>
  )
}

const MeasureTamagui = () => {
  const [open, setOpen] = useState<any>(true)
  return (
    <TimedRender key={open}>
      <>
        <Button onPress={() => setOpen(Math.random())}>go</Button>
        {new Array(100).fill(0).map((_, i) => (
          <Stack key={i} width={2} height={2} backgroundColor="#000" />
        ))}
      </>
    </TimedRender>
  )
}

const MeasureNative = () => {
  const [open, setOpen] = useState<any>(true)
  return (
    <TimedRender key={open}>
      <>
        <Button onPress={() => setOpen(Math.random())}>go</Button>
        {new Array(100).fill(0).map((_, i) => (
          <View key={i} style={{ width: 2, height: 2, backgroundColor: '#000' }} />
        ))}
      </>
    </TimedRender>
  )
}

// const AnimatedNumbers = () => {
//   const [numbers, setNumbers] = useState(10_000)

//   return (
//     <>
//       <Button onPress={() => setNumbers(Math.round(Math.random() * 10_000))}>Next</Button>

//       <Stack importantForAccessibility="auto" />

//       <AnimatePresence enterVariant="fromTop" exitVariant="toBottom">
//         {`${numbers}`.split('').map((num, i) => {
//           return <AnimatedNumber key={`${num}${i}`}>{num}2</AnimatedNumber>
//         })}
//       </AnimatePresence>
//     </>
//   )
// }

// const AnimatedNumber = styled(Text, {
//   fontSize: 20,
//   color: '$color',

//   variants: {
//     fromTop: {
//       true: {
//         y: -10,
//         o: 0,
//       },
//     },

//     toBottom: {
//       true: {
//         y: 10,
//         o: 0,
//       },
//     },
//   } as const,
// })
