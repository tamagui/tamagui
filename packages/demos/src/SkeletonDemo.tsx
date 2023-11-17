import { MotiView } from '@tamagui/animations-moti'
import { Skeleton } from '@tamagui/skeleton'
import { Paragraph, Spacer, XStack } from 'tamagui'

// TODO: do packages/tamagui/src pattern for Skeleton
// import { Skeleton } from 'tamagui/skeleton'

export function SkeletonDemo() {
  const colorMode = 'light'
  return (
    <XStack space>
      <MotiView
        transition={{
          type: 'timing',
        }}
      >
        <Skeleton colorMode={colorMode} radius="round" height={75} width={75} />
        <Spacer />
        <Skeleton colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
        <Spacer height={8} />
        <Skeleton colorMode={colorMode} width={'100%'} />
      </MotiView>
    </XStack>
  )
}
