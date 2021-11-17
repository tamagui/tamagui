import { Community } from '@components/Community'
import { FeaturesGrid } from '@components/FeaturesGrid'
import { Header } from '@components/Header'
import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import React from 'react'
import { YStack } from 'tamagui'

import { HeroExample } from '../components/HeroExample'

export default function Home() {
  // return <Hero />
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <YStack>
        <YStack spacing="$8">
          <Hero />
          <YStack spacing="$8" $sm={{ display: 'none' }}>
            <Divider />
            <HeroExample />
          </YStack>
          <Divider />
          <FeaturesGrid />
          <Divider />
          <Community />
        </YStack>
      </YStack>
    </>
  )
}

const Divider = () => (
  <YStack
    mx="auto"
    als="center"
    borderBottomColor="$borderColor"
    borderBottomWidth={1}
    width={100}
    height={0}
  />
)
