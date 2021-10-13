import React from 'react'
import { useState } from 'react'
import { Pressable, PressableProps } from 'react-native'

import { YStack } from './Stacks'

export const TouchableOpacity = (props: PressableProps) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <YStack opacity={isPressed ? 0.5 : 1}>
      <Pressable
        {...props}
        onPressIn={combineFns(() => setIsPressed(true), props.onPressIn)}
        onPress={combineFns(() => setIsPressed(false), props.onPress)}
        onPressOut={combineFns(() => setIsPressed(false), props.onPressOut)}
      />
    </YStack>
  )
}

const combineFns = (...fns: any[]) => {
  return (...args: any[]) => {
    for (const fn of fns) {
      if (typeof fn === 'function') {
        fn(...args)
      }
    }
  }
}
