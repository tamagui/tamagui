import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { useIsIntersecting } from '@tamagui/demos'
import { tints } from '@tamagui/logo'
import { Community } from '@tamagui/site/components/HeroCommunity'
import { FeaturesGrid } from '@tamagui/site/components/HeroFeaturesGrid'
import { toHtml } from 'hast-util-to-html'
import rangeParser from 'parse-numeric-range'
import React, { useEffect, useMemo, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import { refractor } from 'refractor'
import css from 'refractor/lang/css'
import tsx from 'refractor/lang/tsx'
import { GetProps, Separator, TamaguiElement, ThemeName, XStack, YStack, styled } from 'tamagui'

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
import { setTintIndex, useTint } from '../components/useTint'
import { animationCode, compilationCode } from '../lib/codeExamples'
import rehypeHighlightLine from '../lib/rehype-highlight-line'
import rehypeHighlightWord from '../lib/rehype-highlight-word'

export default function Home({ animationCode, compilationExamples }) {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating />
      <TintSection index={3} p={0}>
        <Hero />
      </TintSection>
      <Separator />
      <Glow />
      <ContainerLarge contain="layout" fd="column" pos="relative" zi={100000}>
        <XStack als="center" pos="absolute" y={-28} jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>
      <YStack pos="relative" zi={2000000} elevation="$1" py="$8" pb="$10">
        <HeroBelow />
      </YStack>
      <Separator />
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
      <TintSection index={4} zi={-1}>
        <FeaturesGrid />
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-up" />
      </TintSection>
      <TintSection my="$-4" p={0} index={5} zIndex={100}>
        <SectionTinted zi={1000} bubble gradient>
          <HeroTypography />
        </SectionTinted>
      </TintSection>
      <TintSection themed index={6} zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroExampleProps />
      </TintSection>
      <Section zi={0}>
        <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={-615} left={0} right={0} ai="center">
          <CocentricCircles />
        </YStack>
        <Community />
      </Section>
    </>
  )
}

const Glow = () => {
  const { tint } = useTint()

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      pe="none"
      animation="lazy"
      key={0}
      zi={-1}
      y={typeof document !== 'undefined' ? document.documentElement?.scrollTop ?? 0 : 0}
    >
      <YStack
        overflow="hidden"
        h="100vh"
        w="100vw"
        maw={1200}
        theme={tint}
        o={0.5}
        fullscreen
        left="calc(50vw - 600px)"
        className="hero-blur"
      />
    </YStack>
  )
}

const TintSection = ({
  children,
  index,
  themed,
  ...props
}: SectionProps & { themed?: boolean; index: number }) => {
  const ref = useRef<HTMLElement>(null)
  const { tint } = useTint()
  const isIntersecting = useIsIntersecting(ref, {
    threshold: 0.6,
  })

  useEffect(() => {
    if (isIntersecting) {
      setTintIndex(index)
    }
  }, [index, isIntersecting])

  return (
    <Section ref={ref} {...(themed && { theme: tint })} {...props}>
      {useMemo(() => children, [children])}
    </Section>
  )
}

const Section = styled(YStack, {
  name: 'Section',
  pos: 'relative',
  className: 'content-visibility-auto',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  } as const,
})

type SectionProps = GetProps<typeof Section>

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
        className="all ease-in ms1000"
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
