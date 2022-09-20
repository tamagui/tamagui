import { useEffect, useState } from 'react'
import { data } from './data'
import * as Tamagui from './BenchTamagui'
import * as ReactNative from './BenchReactNative'
import * as NativeBase from './BenchNativeBase'
import { ScrollView, Text } from 'react-native'

const benchmarks = {
  Tamagui,
  ReactNative,
  NativeBase,
}

export function UserDetailScreen({ route }: any) {
  const [time, setTime] = useState(0)
  const Bench = benchmarks[route.params.id]

  if (!Bench) {
    // eslint-disable-next-line no-console
    console.error(`No bench`)
    return null
  }

  useEffect(() => {
    setTime(new Date().getTime() - route.params.now)
    // eslint-disable-next-line no-console
    console.timeEnd(`${route.params.id}`)
  }, [setTime, route.params.now, route.params.id])

  return (
    <ScrollView>
      <Text>{time}ms</Text>
      <Bench.Provider>
        {data.map((item) => {
          return <Bench.ListItem key={item.id} item={item} />
        })}
      </Bench.Provider>
    </ScrollView>
  )
}
