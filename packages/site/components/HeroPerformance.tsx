import { useOnIntersecting } from '@tamagui/demos'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Button, Paragraph, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { HomeH2, HomeH3 } from '../components/HomeH2'
import { CocentricCircles } from './CocentricCircles'
import { useTint } from './ColorToggleButton'

export function HeroPerformance() {
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
    <ContainerLarge position="relative">
      <YStack pos="absolute" o={0.1} top={-1000} left={0} right={0} x={500} ai="center">
        <CocentricCircles />
      </YStack>

      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$2">
          <HomeH2 ref={ref}>Less time debugging performance.</HomeH2>
          <HomeH3 maw={580}>
            Media queries, themes and inline, logical styles all compile to performant atomic CSS.
          </HomeH3>
        </YStack>

        <YStack
          pos="relative"
          px="$2"
          $sm={{ px: '$0', mx: -20, width: 'calc(100% + 40px)' }}
          h={131}
          br="$8"
          width="100%"
          ai="stretch"
          jc="center"
        >
          <Paragraph
            pos="absolute"
            b={-20}
            r={20}
            mt={-20}
            theme="alt3"
            size="$2"
            $sm={{ display: 'none' }}
          >
            Lower is better. As of February 2022.
          </Paragraph>

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

        <BenchmarksLink />
      </YStack>
    </ContainerLarge>
  )
}

const BenchmarksLink = () => {
  const { tint } = useTint()
  return (
    <Link href="/docs/intro/benchmarks" passHref>
      <Button
        accessibilityLabel="Performance benchmarks"
        fontFamily="$silkscreen"
        theme={tint}
        tag="a"
      >
        Benchmarks &raquo;
      </Button>
    </Link>
  )
}
