import React from 'react'
import { useState } from 'react'
import { Pressable, PressableProps } from 'react-native'

import { VStack } from './Stacks'

export const TouchableOpacity = (props: PressableProps) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <VStack opacity={isPressed ? 0.5 : 1}>
      <Pressable
        {...props}
        onPressIn={combineFns(() => setIsPressed(true), props.onPressIn)}
        onPress={combineFns(() => setIsPressed(false), props.onPress)}
      />
    </VStack>
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
