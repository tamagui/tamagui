import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Community } from '@tamagui/site/components/HeroCommunity'
import { FeaturesGrid } from '@tamagui/site/components/HeroFeaturesGrid'
import { useMemo } from 'react'
import { Separator, XStack, YStack, styled } from 'tamagui'

import { useTint } from '../components/ColorToggleButton'
import { ContainerLarge } from '../components/Container'
import { HeaderFloating } from '../components/HeaderFloating'
import { HeroBelow } from '../components/HeroBelow'
import { HeroExampleAnimations } from '../components/HeroExampleAnimations'
import { HeroExampleCode } from '../components/HeroExampleCode'
import { HeroExampleProps } from '../components/HeroExampleProps'
import { HeroExampleThemes } from '../components/HeroExampleThemes'
import { HeroPerformance } from '../components/HeroPerformance'
import { HeroResponsive } from '../components/HeroResponsive'
import { HeroTypography } from '../components/HeroTypography'
import { HR } from '../components/HR'
import { InstallInput } from '../components/InstallInput'
import { SearchButton } from '../components/Search'

export default function Home() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating isHome />
      <Hero />
      <Separator borderStyle="dotted" />
      <XStack zi={100} theme="alt1" mt={-28} ai="center" jc="center">
        <SearchButton color="$color" width={350} size="$6">
          Search Docs...
        </SearchButton>
      </XStack>
      <YStack py="$7" pb="$11">
        <HeroBelow />
      </YStack>
      <Separator borderStyle="dotted" />
      <ContainerLarge zi={100000}>
        <XStack mt={-28} mb="$-4" jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>
      <Section pos="relative" zi={1000}>
        <YStack fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleThemes />
      </Section>
      <Section pb="$0" zi={10}>
        <HeroResponsive />
      </Section>
      <SectionTinted gradient>
        <HeroPerformance />
      </SectionTinted>
      <SectionTinted zi={100}>
        {/* <YStack fullscreen className="bg-dot-grid mask-gradient-up" /> */}
        <HeroExampleAnimations />
      </SectionTinted>
      <Section zi={10}>
        <YStack fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleCode />
      </Section>
      <Section mt={-100}>
        <FeaturesGrid />
        <YStack fullscreen className="bg-dot-grid mask-gradient-up" />
      </Section>
      <SectionTinted gradient>
        <HeroTypography />
      </SectionTinted>
      <Section>
        <HeroExampleProps />
      </Section>
      <HR />
      <Section>
        <Community />
      </Section>
    </>
  )
}

const Section = styled(YStack, {
  pos: 'relative',
  py: '$12',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  },
})

const SectionTinted = ({ children, gradient, extraPad, ...props }: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])
  const className = gradient ? `gradient-${tint}` : ''
  return (
    <YStack zi={2} contain="paint" pos="relative" py="$12" {...props}>
      <YStack
        fullscreen
        // className={className}
        // o={0.85}
        zi={-1}
        // @ts-ignore
        bc={gradient ? `$${tint}1` : null}
        btw={1}
        bbw={1}
        // @ts-ignore
        boc={`$${tint}3`}
      />
      {childrenMemo}
    </YStack>
  )
}
