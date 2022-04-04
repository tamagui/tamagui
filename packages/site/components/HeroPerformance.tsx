import Link from 'next/link'
import { Button, H3, Paragraph, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { HomeH2 } from '../components/HomeH2'

export function HeroPerformance() {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$1">
          <HomeH2>Intuitively fast</HomeH2>
          <H3 maxWidth={580} ta="center" size="$7" fow="400" theme="alt2">
            Even with inline styles, get amazing performance thanks to an advanced, multi-stage
            optimizing compiler.
          </H3>
        </YStack>

        <YStack p="$2" br="$8" width="100%" ai="stretch">
          <BenchmarkChart
            skipOthers
            large
            data={[
              { name: 'Tamagui', value: 0.02 },
              { name: 'react-native-web', value: 0.063 },
              { name: 'Dripsy', value: 0.108 },
              { name: 'NativeBase', value: 0.73 },
              { name: 'Stitches', value: 0.037 },
              { name: 'Emotion', value: 0.069 },
              { name: 'Styled Components', value: 0.081 },
            ]}
          />
        </YStack>

        <Paragraph mt={-30} theme="alt2" size="$3">
          Lower is better. As of February 2022.
        </Paragraph>

        <Link href="/docs/intro/benchmarks" passHref>
          <Button theme="blue" tag="a">
            Benchmarks &raquo;
          </Button>
        </Link>
      </YStack>
    </ContainerLarge>
  )
}
