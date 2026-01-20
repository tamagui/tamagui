import { useTint } from '@tamagui/logo'
import { useRef, useState } from 'react'
import { Button, Paragraph, XStack, YStack } from 'tamagui'
import { Link } from '~/components/Link'

import { ContainerLarge } from '~/components/Containers'
import { BenchmarkChartWeb } from '~/features/site/benchmarks/BenchmarkChartWeb'
import { useOnIntersecting } from '~/hooks/useOnIntersecting'
import { HomeH2, HomeH3 } from './HomeHeaders'

export function HomePerformance() {
  const ref = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useOnIntersecting(ref, ([entry]) => {
    if (entry?.isIntersecting) {
      setTimeout(() => {
        setShow(true)
      }, 800)
    }
  })

  return (
    <ContainerLarge position="relative">
      <YStack items="center" z={1} gap="$4">
        <YStack items="center" gap="$2">
          <HomeH2 size="$10" maxW={500} ref={ref}>
            Automatically fast
          </HomeH2>
          <HomeH3>
            Partial evaluation, tree flattening, hoisting and
            dead-code&nbsp;elimination&nbsp;✅
          </HomeH3>
        </YStack>

        <YStack
          position="relative"
          px="$2"
          $sm={{ px: '$0', mx: -20, width: 'calc(100% + 40px)' }}
          height={131}
          rounded="$8"
          width="100%"
          items="stretch"
          justify="center"
        >
          <Paragraph
            position="absolute"
            b={-20}
            r={20}
            mt={-20}
            color="$color9"
            size="$2"
            $sm={{ display: 'none' }}
          >
            Lower is better. As of February 2022.
          </Paragraph>

          {show && <BenchmarkChartWeb />}
        </YStack>

        <XStack gap="$4" flexWrap="wrap">
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
    <Link href="/docs/intro/benchmarks">
      <Button aria-label="Performance benchmarks" theme={tint as any}>
        <Button.Text fontFamily="$silkscreen">Benchmarks &raquo;</Button.Text>
      </Button>
    </Link>
  )
}

const CompilerLink = () => {
  const { tint } = useTint()
  return (
    <Link href="/docs/intro/why-a-compiler">
      <Button aria-label="Compiler" theme={tint as any}>
        <Button.Text fontFamily="$silkscreen">About &raquo;</Button.Text>
      </Button>
    </Link>
  )
}
