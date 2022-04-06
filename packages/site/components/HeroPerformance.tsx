import Link from 'next/link'
import { Button, Paragraph, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { HomeH2, HomeH3 } from '../components/HomeH2'
import { useTint } from './ColorToggleButton'

export function HeroPerformance() {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$1">
          <HomeH2>A word with our racing team</HomeH2>
          <HomeH3 maw={580}>
            They're proud of the achievement. Tamagui extracts 90% of reachable properties to css,
            and fully flattens 30% of all views down to just a DOM property.
          </HomeH3>
        </YStack>

        <YStack pos="relative" px="$2" h={181} br="$8" width="100%" ai="stretch" jc="center">
          <YStack fullscreen zi={-1} className="bg-grid mask-gradient-right" />

          <Paragraph
            pos="absolute"
            b={20}
            r={20}
            mt={-20}
            theme="alt3"
            size="$2"
            $sm={{ display: 'none' }}
          >
            Lower is better. As of February 2022.
          </Paragraph>

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

        <BenchmarksLink />
      </YStack>
    </ContainerLarge>
  )
}

const BenchmarksLink = () => {
  const { tint } = useTint()
  return (
    <Link href="/docs/intro/benchmarks" passHref>
      <Button theme={tint} tag="a">
        Benchmarks &raquo;
      </Button>
    </Link>
  )
}
