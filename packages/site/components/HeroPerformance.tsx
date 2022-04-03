import Link from 'next/link'
import { Button, Paragraph, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { HomeH2 } from '../components/HomeH2'

export function HeroPerformance() {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$1">
          <HomeH2>Unmatched Performance</HomeH2>
          <Paragraph maxWidth={580} ta="center" size="$6" theme="alt2">
            Even using inline styles, get unparalleled performance - thanks to an advanced,
            multi-stage optimizing compiler.
          </Paragraph>
        </YStack>

        <YStack p="$2" br="$8" width="100%" ai="stretch">
          <BenchmarkChart
            large
            data={[
              { name: 'Tamagui', value: 0.02 },
              { name: 'react-native-web', value: 0.063 },
              { name: 'Dripsy', value: 0.108 },
              { name: 'NativeBase', value: 0.73 },
              { name: 'Stitches', value: 0.037 },
              { name: 'Emotion', value: 0.069 },
              { name: 'SC', value: 0.081 },
            ]}
          />
        </YStack>

        <Paragraph mt={-20} theme="alt3" size="$3">
          Lower is better. As of February 2022.
        </Paragraph>

        <Link href="/docs/intro/benchmarks" passHref>
          <Button theme="blue" tag="a">
            See the benchmarks
          </Button>
        </Link>
      </YStack>
    </ContainerLarge>
  )
}
