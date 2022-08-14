import React from 'react'
import { Separator, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '../components/Container.server'
import { Header } from '../components/Header.server'
import { HeaderFloating } from '../components/header/HeaderFloating.client'
import { Hero } from '../components/home/Hero.server'
import { HeroBelow } from '../components/home/HeroBelow.server'
import { HeroThemes } from '../components/home/HeroThemes.client'
import { HomeH2, HomeH3 } from '../components/home/HomeHeading.server'
import { InstallInput } from '../components/home/InstallInput.client'
import { Section } from '../components/Section.server'

export default function Index() {
  return (
    <>
      <HeaderFloating isHome>
        <ContainerLarge>
          <Header floating />
        </ContainerLarge>
      </HeaderFloating>
      <Hero />
      <Separator />
      <ContainerLarge contain="layout" fd="column" pos="relative" zi={100000}>
        <XStack als="center" pos="absolute" y={-28} jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>
      <YStack elevation="$1" py="$8" pb="$10">
        <HeroBelow />
      </YStack>
      <Separator />
      <Section contain="paint layout" pos="relative" zi={1000}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <ContainerLarge position="relative" space="$3">
          <HomeH2>
            A colorful <span className="rainbow clip-text">revolution.</span>
          </HomeH2>
          <HomeH3>
            Next-generation theme system that compiles to CSS. Unlimited sub-themes down to the
            element.
          </HomeH3>
        </ContainerLarge>
        <HeroThemes />
      </Section>
    </>
  )
}
