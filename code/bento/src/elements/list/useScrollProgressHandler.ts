import { type SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'

export function useScrollProgressHandler(progress: SharedValue<number>) {
  return useAnimatedScrollHandler({
    onScroll: (event) => {
      const height = event.contentSize.height - event.layoutMeasurement.height
      const scrollY = event.contentOffset.y
      const value = height > 0 ? scrollY / height : 0

      if (value <= 1) {
        progress.value = value
      }
    },
  })
}
