import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Community } from '@tamagui/site/components/HeroCommunity'
import { FeaturesGrid } from '@tamagui/site/components/HeroFeaturesGrid'
import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import { useMemo } from 'react'
import { refractor } from 'refractor'
import css from 'refractor/lang/css'
import tsx from 'refractor/lang/tsx'
import { Separator, Square, XStack, YStack, styled } from 'tamagui'

import { CocentricCircles } from '../components/CocentricCircles'
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
import { InstallInput } from '../components/InstallInput'
import { animationCode, compilationCode } from '../lib/codeExamples'
import rehypeHighlightLine from '../lib/rehype-highlight-line'
import rehypeHighlightWord from '../lib/rehype-highlight-word'

export default function Home({ animationCode, compilationExamples }) {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating isHome />
      <Hero />
      <Separator o={0.65} />
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
        <HeroExampleThemes />
      </Section>
      <Section pb="$0" zi={10}>
        <HeroResponsive />
      </Section>
      <SectionTinted contain="paint layout" gradient bubble>
        <HeroPerformance />
      </SectionTinted>
      <SectionTinted contain="paint layout" noBorderTop zi={100}>
        <YStack fullscreen className="bg-grid mask-gradient-up" />
        <HeroExampleAnimations animationCode={animationCode} />
      </SectionTinted>
      <Section bc="$background" contain="paint layout" zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid-big mask-gradient-down" />
        <HeroExampleCode examples={compilationExamples} />
      </Section>
      <Section bc="$background" mt="$-10" bbw={1} bbc="$borderColor" mb="$-5">
        <FeaturesGrid />
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-up" />
      </Section>
      <SectionTinted contain="paint layout" bubble gradient>
        <HeroTypography />
      </SectionTinted>
      <Section zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleProps />
      </Section>
      <Section zi={0}>
        <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={-615} left={0} right={0} ai="center">
          <CocentricCircles />
        </YStack>
        <Community />
      </Section>
    </>
  )
}

const Section = styled(YStack, {
  name: 'Section',
  pos: 'relative',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  },
})

const SectionTinted = ({ children, gradient, extraPad, bubble, noBorderTop, ...props }: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])

  return (
    <YStack
      zi={2}
      contain="paint"
      pos="relative"
      py="$14"
      elevation="$2"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: `$${tint}4`,
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        zi={-1}
        bc={gradient ? `$${tint}2` : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: `$${tint}3`,
        })}
      />
      {childrenMemo}
    </YStack>
  )
}

refractor.register(tsx)
refractor.register(css)

export async function getStaticProps() {
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

  return { props: { compilationExamples, animationCode: codeToHTML(animationCode, 'tsx') } }
}
