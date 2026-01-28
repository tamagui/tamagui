import { useEffect, useState } from 'react'
import { Configuration, Image, Paragraph, View, XStack, YStack } from 'tamagui'

import type { AnimationDriver } from '@tamagui/web'

type DuckRowProps = {
  type: 'motion' | 'reanimated'
  driver: AnimationDriver
}

const RACE_DISTANCE = 250

// motion duck uses Tamagui animation (compositor thread via WAAPI/CSS)
function MotionDuck() {
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAtEnd((prev) => !prev)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <View transition="500ms" x={atEnd ? RACE_DISTANCE : 0}>
      <Image src="./duck.png" width={48} height={48} />
    </View>
  )
}

export function DuckRow({ type, driver }: DuckRowProps) {
  return (
    <Configuration animationDriver={driver}>
      <YStack gap="$2" items="flex-start">
        <Paragraph fontFamily="$mono" fontSize={11} color="rgba(255,255,255,0.2)">
          {type}
        </Paragraph>
        <XStack width={RACE_DISTANCE + 60}>
          <MotionDuck />
        </XStack>
      </YStack>
    </Configuration>
  )
}
