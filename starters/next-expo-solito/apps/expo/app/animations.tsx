import { AnimationScreen } from 'app/features/animations/screen'
import { Stack } from 'expo-router'
import React from 'react'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <AnimationScreen />
    </>
  )
}
