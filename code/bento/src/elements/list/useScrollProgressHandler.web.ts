import type { SharedValue } from 'react-native-reanimated'
import { useEvent } from 'tamagui'

type ScrollEvent = {
  nativeEvent: {
    contentOffset: { y: number }
    contentSize: { height: number }
    layoutMeasurement: { height: number }
  }
}

export function useScrollProgressHandler(progress: SharedValue<number>) {
  return useEvent((event: ScrollEvent) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const height = contentSize.height - layoutMeasurement.height
    const value = height > 0 ? contentOffset.y / height : 0

    if (value <= 1) {
      progress.value = value
    }
  })
}
