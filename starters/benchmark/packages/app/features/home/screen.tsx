import React from 'react'
import { Button } from 'react-native'

const benchmarks = ['Tamagui', 'ReactNative', 'NativeBase']

export const HomeScreen = ({ navigation }: any) => {
  return (
    <>
      {benchmarks.map((name) => {
        return <BenchButton key={name} navigation={navigation} name={name} />
      })}
    </>
  )
}

const BenchButton = ({ name, navigation }) => {
  return (
    <Button
      key={name}
      title={name}
      onPress={() => {
        // eslint-disable-next-line no-console
        const now = new Date()
        navigation.navigate(`user-detail`, { id: name, now: now.getTime() })
      }}
    />
  )
}
