import type { SharedValue } from 'react-native-reanimated'
import { useEvent } from 'tamagui'

type Options<T> = {
  index: number
  itemStride: number
  items: T[]
  onChange?: (item: T, index: number) => void
  scrollY: SharedValue<number>
  setIndex: (index: number) => void
}

export function useWheelScrollHandler<T>({
  itemStride,
  items,
  onChange,
  scrollY,
  setIndex,
}: Options<T>) {
  return useEvent((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const value = event.nativeEvent.contentOffset.y
    const nextIndex = Math.min(
      items.length - 1,
      Math.max(0, Math.round(value / itemStride))
    )

    setIndex(nextIndex)
    onChange?.(items[nextIndex], nextIndex)
    scrollY.value = value
  })
}
