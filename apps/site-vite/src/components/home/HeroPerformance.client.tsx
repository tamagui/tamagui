import { useOnIntersecting } from '@tamagui/demos'
import { useRef, useState } from 'react'
import { YStack } from 'tamagui'

import { BenchmarkChart } from '../BenchmarkChart.client'

export function HeroPerformanceBenchmark() {
  const ref = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useOnIntersecting(ref, ({ isIntersecting }) => {
    if (isIntersecting) {
      setTimeout(() => {
        setShow(true)
      }, 100)
    }
  })

  return (
    <YStack ref={ref} fullscreen>
      {show && (
        <BenchmarkChart
          animateEnter
          skipOthers
          large
          data={[
            { name: 'Tamagui', value: 0.02 },
            { name: 'react-native-web', value: 0.063 },
            { name: 'Dripsy', value: 0.108 },
            { name: 'NativeBase', value: 0.73 },
          ]}
        />
      )}
    </YStack>
  )
}
