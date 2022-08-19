// there's some bug with reanimated likely related to worklets
// for now to not regress, we require react-native Animated alongside
export {
  useAnimatedNumber,
  useAnimatedNumberStyle,
  useAnimatedNumberReaction,
} from '@tamagui/animations-react-native'

// import { UniversalAnimatedNumber } from '@tamagui/core'
// import {
//   SharedValue,
//   cancelAnimation,
//   useAnimatedReaction,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from 'react-native-reanimated'

// type ReanimatedAnimatedNumber = SharedValue<number>

// export function useAnimatedNumber(
//   initial: number
// ): UniversalAnimatedNumber<ReanimatedAnimatedNumber> {
//   const val = useSharedValue(initial)
//   return {
//     getInstance() {
//       return val
//     },
//     getValue() {
//       return val.value
//     },
//     stop() {
//       cancelAnimation(val)
//     },
//     setValue(next: number, config = { type: 'spring' }) {
//       if (config.type === 'direct') {
//         val.value = next
//       } else if (config.type === 'spring') {
//         val.value = withSpring(next, config)
//       } else {
//         val.value = withTiming(next, config)
//       }
//     },
//   }
// }

// export function useAnimatedNumberReaction(
//   value: UniversalAnimatedNumber<ReanimatedAnimatedNumber>,
//   cb: (current: number) => void
// ) {
//   useAnimatedReaction(
//     () => {
//       'worklet'
//       return value.getValue()
//     },
//     (result, prev) => {
//       'worklet'
//       if (result !== prev) cb(result)
//     },
//     [value]
//   )
// }

// export function useAnimatedNumberStyle<V extends UniversalAnimatedNumber<ReanimatedAnimatedNumber>>(
//   value: V,
//   getStyle: (value: number) => any
// ) {
//   return useAnimatedStyle(() => {
//     'worklet'
//     return getStyle(value.getValue())
//   })
// }
