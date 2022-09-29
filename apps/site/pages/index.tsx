import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Community } from '@tamagui/site/components/HeroCommunity'
import { FeaturesGrid } from '@tamagui/site/components/HeroFeaturesGrid'
import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import { useState } from 'react'
import { refractor } from 'refractor'
import css from 'refractor/lang/css'
import tsx from 'refractor/lang/tsx'
import { XStack, YStack } from 'tamagui'

import { CocentricCircles } from '../components/CocentricCircles'
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
import { InstallInput } from '../components/InstallInput'
import { Section, SectionTinted, TintSection } from '../components/TintSection'
import { animationCode, compilationCode } from '../lib/codeExamples'
import rehypeHighlightLine from '../lib/rehype-highlight-line'
import rehypeHighlightWord from '../lib/rehype-highlight-word'

export default function Home({ animationCode, compilationExamples }) {
  return (
    <YStack contain="paint" ov="hidden">
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating />
      <TintSection index={3} p={0}>
        <Hero />
      </TintSection>
      <ContainerLarge contain="layout" fd="column" pos="relative" zi={100000}>
        <XStack als="center" pos="absolute" y={-28} jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>
      <HeroBelow />
      {/* <Glow /> inside HeroBelow anchors to it */}
      <TintSection index={0} contain="paint layout" zi={1000}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleCode examples={compilationExamples} />
      </TintSection>
      <TintSection index={1} contain="paint layout" pos="relative" zi={100}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleThemes />
      </TintSection>
      <TintSection index={2} mb={-120} zIndex={1000}>
        <HeroResponsive />
      </TintSection>
      <TintSection p={0} index={3} zIndex={0}>
        <SectionTinted gradient bubble>
          <HeroPerformance />
        </SectionTinted>
      </TintSection>
      <TintSection index={4} zi={100}>
        <YStack fullscreen className="bg-grid mask-gradient-up" />
        <HeroExampleAnimations animationCode={animationCode} />
      </TintSection>
      <TintSection index={5} zi={-1}>
        <FeaturesGrid />
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-up" />
      </TintSection>
      <TintSection my="$-4" p={0} index={6} zIndex={100}>
        <SectionTinted zi={1000} bubble gradient>
          <HeroTypography />
        </SectionTinted>
      </TintSection>
      <TintSection themed index={0} zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleProps />
      </TintSection>
      <Section zi={0}>
        <Community />
      </Section>
    </YStack>
  )
}

export async function getStaticProps() {
  refractor.register(tsx)
  refractor.register(css)

  function codeToHTML(source: string, language: 'tsx' | 'css' | string, line = '0') {
    let result: any = refractor.highlight(source, language)
    result = rehypeHighlightLine(result, rangeParser(line))
    result = rehypeHighlightWord(result)
    result = toHtml(result)
    return result as string
  }

  const compilationExamples = compilationCode.map((item) => {
    return {
      ...item,
      input: {
        ...item.input,
        examples: item.input.examples.map((ex) => {
          return {
            ...ex,
            code: codeToHTML(ex.code, ex.language),
          }
        }),
      },
      output: {
        ...item.output,
        examples: item.output.examples.map((ex) => {
          return {
            ...ex,
            code: codeToHTML(ex.code, ex.language),
          }
        }),
      },
    }
  })

  return {
    props: {
      compilationExamples,
      animationCode: codeToHTML(animationCode, 'tsx'),
    },
  }
}
