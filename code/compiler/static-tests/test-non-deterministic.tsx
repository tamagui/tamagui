import React from 'react'
import { View, Text } from '@tamagui/core'

// Test cases for non-deterministic evaluation detection

export function TestNonDeterministic() {
  // These should bail (return FAILED_EVAL)
  const randomValue = Math.random()
  const currentTime = Date.now()
  const newDate = new Date()
  const dateTime = new Date().getTime()
  const perfNow = performance.now()
  
  // These should work fine (deterministic)
  const slicedString = "hello".slice(1)
  const mathFloor = Math.floor(4.5)
  const mathMax = Math.max(1, 2, 3)
  const specificDate = new Date('2024-01-01')
  const stringLength = "test".length
  const arrayJoin = ["a", "b"].join("-")
  
  return (
    <View>
      {/* Non-deterministic - should bail */}
      <Text fontSize={Math.random() * 16}>Random font size</Text>
      <Text opacity={Date.now() % 2}>Time-based opacity</Text>
      <Text color={`hsl(${Math.random() * 360}, 50%, 50%)`}>Random color</Text>
      
      {/* Deterministic - should work */}
      <Text fontSize={Math.floor(16.5)}>Fixed font size</Text>
      <Text maxWidth={"hello".slice(0, 3).length * 100}>String operations</Text>
      <Text padding={[1,2,3].reduce((a, b) => a + b, 0)}>Array operations</Text>
      <Text margin={Math.min(10, 20)}>Math operations</Text>
    </View>
  )
}