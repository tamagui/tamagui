import { useOnIntersecting } from '@tamagui/demos'
import Link from 'next/link'
import React from 'react'
import { useRef, useState } from 'react'
import { Button, Paragraph, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '../components/Container'
import { HomeH2, HomeH3 } from '../components/HomeH2'
import { BenchmarkChartWeb } from './BenchmarkChartWeb'
import { CocentricCircles } from './CocentricCircles'
import { useTint } from './useTint'

export function HeroPerformance() {
  const ref = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useOnIntersecting(ref, ({ isIntersecting }) => {
    if (isIntersecting) {
      setTimeout(() => {
        setShow(true)
      }, 800)
    }
  })

  return (
    <ContainerLarge position="relative">
      <YStack pos="absolute" o={0.15} top={-1000} left={0} right={0} x={500} ai="center">
        <CocentricCircles />
      </YStack>

      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$2">
          <HomeH2 size="$10" maw={500} ref={ref}>
            Automatically fast
          </HomeH2>
          <HomeH3>
            Partial evaluation + tree flattening extract nearly all inline styles at build-time,
            greatly reducing render depth and time.
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
            theme="alt2"
            size="$2"
            $sm={{ display: 'none' }}
          >
            Lower is better. As of February 2022.
          </Paragraph>

          {show && <BenchmarkChartWeb />}
        </YStack>

        <XStack space flexWrap="wrap">
          <BenchmarksLink />
          <CompilerLink />
        </XStack>
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

const CompilerLink = () => {
  const { tint } = useTint()
  return (
    <Link href="/docs/intro/compiler" passHref>
      <Button accessibilityLabel="Compiler" fontFamily="$silkscreen" theme={tint} tag="a">
        About the Compiler &raquo;
      </Button>
    </Link>
  )
}
