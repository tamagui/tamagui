import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { startTransition } from '@tamagui/start-transition'
import * as React from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'

/**
 * Native has no autoupdate, so the floating position is recomputed by hand
 * whenever the two things that invalidate it change: the window (orientation,
 * scale) and the soft keyboard.
 */
export const useRepositionOnNative = (
  update: () => void,
  passThrough: boolean | undefined
) => {
  const dimensions = useWindowDimensions()

  const [keyboardOpen, setKeyboardOpen] = React.useState(false)
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      startTransition(() => {
        setKeyboardOpen(true)
      })
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      startTransition(() => {
        setKeyboardOpen(false)
      })
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (passThrough) return
    update()
  }, [passThrough, dimensions, keyboardOpen])
}
