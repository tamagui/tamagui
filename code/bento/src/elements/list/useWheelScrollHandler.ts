import {
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'

type Options<T> = {
  index: number
  itemStride: number
  items: T[]
  onChange?: (item: T, index: number) => void
  scrollY: SharedValue<number>
  setIndex: (index: number) => void
}

export function useWheelScrollHandler<T>({
  index,
  itemStride,
  items,
  onChange,
  scrollY,
  setIndex,
}: Options<T>) {
  return useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const value = event.contentOffset.y
        let nextIndex = Math.round(value / itemStride)

        if (nextIndex >= 0) {
          if (index > items.length - 1) nextIndex = items.length - 1
          runOnJS(setIndex)(nextIndex)
          if (onChange) runOnJS(onChange)(items[nextIndex], nextIndex)
        }

        scrollY.value = value
      },
      onMomentumEnd: (event) => {
        scrollY.value = Math.round(event.contentOffset.y)
      },
      onEndDrag: (event) => {
        scrollY.value = Math.round(event.contentOffset.y)
      },
    },
    [index]
  )
}
