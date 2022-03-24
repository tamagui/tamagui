import { Community } from '@components/Community'
import { FeaturesGrid } from '@components/FeaturesGrid'
import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import Link from 'next/link'
import React from 'react'
import { Button, H2, H3, Paragraph, XStack, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { HeroExample } from '../components/HeroExample'
import { HeroExampleCarousel } from '../components/HeroExampleCarousel'

export default function Home() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <YStack>
        <YStack space="$8">
          <Hero />
          <Divider />
          <HeroExampleCarousel />
          <YStack space="$8" $sm={{ display: 'none' }}>
            <Divider />
            <HeroExample />
          </YStack>
          <Divider />
          <Performance />
          <Divider />
          <FeaturesGrid />
          <Divider />
          <Community />
        </YStack>
      </YStack>
    </>
  )
}

function Performance() {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$2">
          <H2>Unmatched performance</H2>
          <H3 theme="alt2" fow="400">
            3-10x speed, even with inline styling.
          </H3>
        </YStack>
        <YStack width="100%" ai="stretch">
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

        <Paragraph theme="alt3" size="$3">
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

const Divider = () => (
  <YStack
    mt="$5"
    mb="$3"
    mx="auto"
    als="center"
    borderBottomColor="$borderColor"
    borderBottomWidth={3}
    width={100}
    height={0}
  />
)
