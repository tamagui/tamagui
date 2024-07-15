import { useRef } from 'react'
import type { GestureResponderEvent } from 'react-native'
import { useEvent } from 'tamagui'

export const useDoublePress = ({
  onSinglePress,
  onDoublePress,
  eagerSingle,
  delay = 350,
}: {
  onSinglePress?: (e: GestureResponderEvent) => void
  onDoublePress?: (e: GestureResponderEvent) => void
  delay?: number
  eagerSingle?: boolean
}) => {
  const state = useRef({
    last: 0,
    tm: 0 as any,
    pendingSinglePress: null as any,
  })

  return {
    onPress: useEvent((e: GestureResponderEvent) => {
      clearTimeout(state.current.tm)

      const time = Date.now()
      const delta = time - state.current.last

      if (delta < delay) {
        onDoublePress?.(e)
      } else {
        if (eagerSingle) {
          onSinglePress?.(e)
        } else {
          state.current.pendingSinglePress = () => {
            onSinglePress?.(e)
            state.current.pendingSinglePress = null
          }
          state.current.tm = setTimeout(state.current.pendingSinglePress, delay)
        }
      }

      state.current.last = time
    }),

    onMouseLeave: useEvent(() => {
      if (state.current.pendingSinglePress) {
        // flush single press on mouse leave
        clearTimeout(state.current.tm)
        state.current.pendingSinglePress?.()
        state.current.pendingSinglePress = null
      }
    }),
  }
}
