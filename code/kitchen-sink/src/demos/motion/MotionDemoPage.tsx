import { Paragraph, Theme, YStack } from 'tamagui'

import { DuckRow } from './DuckRow'
import { useCpuLoad } from './useCpuLoad'
import { animationsMotion, animationsReanimated } from '../../tamagui.config'

export function MotionDemoPage() {
  useCpuLoad(95)

  return (
    <Theme name="dark">
      <YStack
        bg="#0a0a0a"
        flex={1}
        minH="100vh"
        width="100%"
        items="center"
        justify="center"
        gap="$6"
        p="$4"
      >
        <Paragraph fontFamily="$mono" fontSize={10} color="rgba(255,255,255,0.15)">
          cpu 95%
        </Paragraph>

        <YStack gap="$4">
          <DuckRow type="motion" driver={animationsMotion} />
          <DuckRow type="reanimated" driver={animationsReanimated} />
        </YStack>
      </YStack>
    </Theme>
  )
}
