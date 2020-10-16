import React from 'react'
import { View } from 'react-native'

export function Color(props: { of: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: props.of,
      }}
    />
  )
}
