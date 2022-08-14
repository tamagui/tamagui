import { Link } from '@tamagui/unagi'
import React from 'react'
import { Button, Card, Paragraph, Separator, XStack, YStack } from 'tamagui'

import { CodeDemoPreParsed } from '../components/code/CodeDemoPreParsed.server'
import { ContainerLarge } from '../components/Container.server'
import { Header } from '../components/Header.server'
import { HeaderFloating } from '../components/header/HeaderFloating.client'
import { Hero } from '../components/home/Hero.server'
import { HeroAnimations } from '../components/home/HeroAnimations.client'
import { HeroBelow } from '../components/home/HeroBelow.server'
import { HeroCode } from '../components/home/HeroCode.client'
import { HeroCommunity } from '../components/home/HeroCommunity.server'
import { HeroFeatures } from '../components/home/HeroFeatures.server'
import { HeroPerformanceBenchmark } from '../components/home/HeroPerformance.client'
import { HeroProps } from '../components/home/HeroProps.server'
import { HeroResponsive } from '../components/home/HeroResponsive.client'
import { HeroThemes } from '../components/home/HeroThemes.client'
import { HeroTypography } from '../components/home/HeroTypography.client'
import { HomeH2, HomeH3 } from '../components/home/HomeHeading.server'
import { InstallInput } from '../components/home/InstallInput.client'
import { Section, SectionTinted } from '../components/Section.server'
import { CocentricCircles } from '../components/visuals/CocentricCircles.server'

export default function Index() {
  return (
    <>
      <HeaderFloating isHome>
        <ContainerLarge>
          <Header floating />
        </ContainerLarge>
      </HeaderFloating>

      {/* hero */}
      <Hero />

      <Separator />

      {/* install */}
      <ContainerLarge contain="layout" fd="column" pos="relative" zi={100000}>
        <XStack als="center" pos="absolute" y={-28} jc="center" ai="center">
          <InstallInput />
        </XStack>
      </ContainerLarge>

      {/* below hero */}
      <YStack elevation="$1" py="$8" pb="$10">
        <HeroBelow />
      </YStack>

      <Separator />

      {/* themes */}
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

      {/* responsive */}
      <ContainerLarge mt={-80} pos="relative">
        <YStack f={1} space="$3">
          <HomeH2 ta="left" als="flex-start">
            <span className="rainbow clip-text">Responsive</span>, for real.
          </HomeH2>

          <HomeH3 ta="left" als="flex-start" p={0} maxWidth={450} theme="alt3">
            Simple syntax for universal responsive styling - compiled to @media on the web for
            amazing performance.
          </HomeH3>
        </YStack>

        <HeroResponsive />
      </ContainerLarge>

      {/* performance */}
      <PerformanceSection />

      {/* animations */}
      <AnimationsSection />

      {/* code */}
      <CodeSection />

      {/* features */}
      <Section bc="$background" mt="$-10" bbw={1} bbc="$borderColor" mb="$-5">
        <HeroFeatures />
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-up" />
      </Section>

      {/* typography */}
      <TypographySection />

      {/* props */}
      <Section zi={10}>
        <YStack pe="none" zi={0} fullscreen className="bg-dot-grid mask-gradient-down" />
        <HeroProps />
      </Section>

      {/* community */}
      <Section zi={0}>
        <YStack pe="none" zi={-1} pos="absolute" o={0.1} top={-615} left={0} right={0} ai="center">
          <CocentricCircles />
        </YStack>
        <HeroCommunity />
      </Section>
    </>
  )
}

function TypographySection() {
  return (
    <SectionTinted bubble gradient>
      <YStack fullscreen className="bg-grid mask-gradient-both" o={0.1} />
      {/* -5 my to fir grid nicely */}
      <ContainerLarge my={-5} position="relative" space="$8">
        <YStack ai="center" space="$3">
          <HomeH2>
            Beautifully expressive font systems with{' '}
            <span className="clip-text rainbow">rhythm</span>.
          </HomeH2>
        </YStack>

        <XStack
          ai="center"
          jc="center"
          pos="relative"
          space="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'column-reverse',
          }}
        >
          <TypographyCard />

          <YStack
            h={300}
            w="40%"
            space="$0.5"
            jc="center"
            scale={1.1}
            x={-20}
            y={-10}
            $sm={{ y: 0, miw: '110%', ai: 'center', x: 0, scale: 0.9 }}
          >
            <YStack ai="flex-end" h={270}>
              <HeroTypography />
            </YStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </SectionTinted>
  )
}

function TypographyCard() {
  return (
    <Card bw={1} boc="$borderColor" br="$6" elevation="$6" shadowRadius={60}>
      <YStack jc="center" p="$6" space="$5" maw="calc(min(90vw, 400px))" $sm={{ p: '$5' }}>
        <Paragraph ta="left" size="$8" fow="400" ls={-1}>
          Use, swap and share fonts with typed vertical rhythm.
        </Paragraph>

        <Paragraph ta="left" size="$6" theme="alt2" fow="400">
          Typed, sizable fonts with control over every facet - weight, spacing, line-height,
          letter-spacing, color and more.
        </Paragraph>

        <Link to="/docs/intro/configuration">
          <Button accessibilityLabel="Fonts docs" fontFamily="$silkscreen" als="flex-end">
            Fonts &raquo;
          </Button>
        </Link>
      </YStack>
    </Card>
  )
}

function CodeSection() {
  return (
    <>
      <ContainerLarge position="relative">
        <YStack zi={1} space="$6">
          <YStack space="$3">
            <HomeH2>
              Incredible features, <span className="rainbow clip-text">insanely&nbsp;fast</span>.
            </HomeH2>
            <HomeH3>Modern features 🤝 unmatched performance.</HomeH3>
          </YStack>
          <HeroCode examples={[]} />
        </YStack>
      </ContainerLarge>
    </>
  )
}

export async function getStaticProps() {
  // refractor.register(tsx)
  // refractor.register(css)
  // function codeToHTML(source: string, language: 'tsx' | 'css' | string, line = '0') {
  //   let result: any = refractor.highlight(source, language)
  //   result = rehypeHighlightLine(result, rangeParser(line))
  //   result = rehypeHighlightWord(result)
  //   result = toHtml(result)
  //   return result as string
  // }
  // const compilationExamples = compilationCode.map((item) => {
  //   return {
  //     ...item,
  //     input: {
  //       ...item.input,
  //       examples: item.input.examples.map((ex) => {
  //         return {
  //           ...ex,
  //           code: codeToHTML(ex.code, ex.language),
  //         }
  //       }),
  //     },
  //     output: {
  //       ...item.output,
  //       examples: item.output.examples.map((ex) => {
  //         return {
  //           ...ex,
  //           code: codeToHTML(ex.code, ex.language),
  //         }
  //       }),
  //     },
  //   }
  // })
  // return { props: { compilationExamples, animationCode: codeToHTML(animationCode, 'tsx') } }
}

function AnimationsSection() {
  return (
    <ContainerLarge position="relative" space="$8">
      <YStack zi={1} space="$3">
        <HomeH2 pos="relative">
          Universal <span className="rainbow clip-text">Animations</span>
        </HomeH2>
        <HomeH3>
          Better platform targeting with animation drivers that can be changed without changing
          code.
        </HomeH3>
      </YStack>

      <XStack>
        <HeroAnimations>
          <CodeDemoPreParsed
            maxHeight={500}
            height={500}
            maxWidth={530}
            minWidth={530}
            language="tsx"
            source={`animationCode`}
          />
        </HeroAnimations>
      </XStack>

      <XStack als="center" space="$3">
        <Link to="/docs/core/animations#css">
          <Button accessibilityLabel="CSS docs" fontFamily="$silkscreen">
            CSS &raquo;
          </Button>
        </Link>
        <Link to="/docs/core/animations#reanimated">
          <Button accessibilityLabel="Reanimated docs" fontFamily="$silkscreen">
            Reanimated &raquo;
          </Button>
        </Link>
        <Link to="/docs/core/animations">
          <Button accessibilityLabel="Animation docs" fontFamily="$silkscreen">
            Docs &raquo;
          </Button>
        </Link>
      </XStack>
    </ContainerLarge>
  )
}

function PerformanceSection() {
  return (
    <ContainerLarge position="relative">
      <YStack pos="absolute" o={0.15} top={-1000} left={0} right={0} x={500} ai="center">
        <CocentricCircles />
      </YStack>

      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$2">
          <HomeH2 maw={400}>Best in class.</HomeH2>
          <HomeH3 maw={680}>
            Advanced optimizing compilation flattens views & turns all types of styling (even
            inline, logical ones) into fast CSS.
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

          <HeroPerformanceBenchmark />
        </YStack>

        <Link to="/docs/intro/benchmarks">
          <Button
            accessibilityLabel="Performance benchmarks"
            fontFamily="$silkscreen"
            // theme={tint}
            tag="span"
          >
            Benchmarks &raquo;
          </Button>
        </Link>
      </YStack>
    </ContainerLarge>
  )
}
