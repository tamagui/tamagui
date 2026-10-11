import React from 'react'

/**
 * On mobile web the soft keyboard is not an event, it is a shrunken visual
 * viewport: the layout viewport stays put and `visualViewport.height` drops by
 * the height of the keyboard. Anything smaller than that is a scroll or a
 * pinch, hence the threshold.
 *
 * Desktop browsers never shrink it, so this stays false there, which is what
 * the react-native version reported on web before this file existed.
 */
const KEYBOARD_MIN_HEIGHT = 150

const isKeyboardOpen = () => {
  const viewport = window.visualViewport
  if (!viewport) return false
  return document.documentElement.clientHeight - viewport.height > KEYBOARD_MIN_HEIGHT
}

export const useKeyboardVisible = (): boolean => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false)

  React.useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => setKeyboardVisible(isKeyboardOpen())
    update()

    viewport.addEventListener('resize', update)
    return () => viewport.removeEventListener('resize', update)
  }, [])

  return isKeyboardVisible
}
