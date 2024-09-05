import React from 'react'
import { Keyboard } from 'react-native'

export const useKeyboardVisible = () => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false)

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  return isKeyboardVisible
}
