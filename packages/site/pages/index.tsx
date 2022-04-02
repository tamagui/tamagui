import { Community } from '@components/Community'
import { FeaturesGrid } from '@components/FeaturesGrid'
import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, H2, H3, Image, Paragraph, Text, Theme, XStack, YStack, debounce } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { Features } from '../components/Features'
import { Header } from '../components/Header'
import { HeroExampleAnimations } from '../components/HeroExampleAnimations'
import { HeroExampleCode } from '../components/HeroExampleCode'
import { HeroExampleThemes } from '../components/HeroExampleThemes'
import { HomeH2, HomeH3 } from '../components/HomeH2'
import { InstallInput } from '../components/InstallInput'
import { PageSeparator } from '../components/PageSeparator'
import { ThemeTint } from '../components/ThemeTint'

export default function Home() {
  // return <HeroExampleAnimations />

  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <HeaderFloating />
      <YStack>
        <YStack space="$8">
          <Hero />
          <ContainerLarge>
            <XStack my="$3" ai="center">
              <PageSeparator />
              <ThemeTint>
                <InstallInput />
              </ThemeTint>
              <PageSeparator />
            </XStack>
          </ContainerLarge>
          {/* <PageSeparator /> */}
          <HeroExampleThemes />
          <PageSeparator />
          <HeroExampleAnimations />
          <PageSeparator />
          <HeroExampleCode />
          <PageSeparator />
          <Performance />
          <PageSeparator />
          <FeaturesItems />
          <PageSeparator />
          <FeaturesGrid />
          <PageSeparator />
          <Community />
        </YStack>
      </YStack>
    </>
  )
}

const HeaderFloating = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  if (typeof document !== 'undefined') {
    useEffect(() => {
      const onScroll = throttle(() => {
        setIsScrolled(window.scrollY > 250)
      }, 50)
      window.addEventListener('scroll', onScroll)
      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <Theme name="dark">
      <XStack
        className="ease-out all ms200"
        y={isScrolled ? 0 : -50}
        py={2}
        bbw={1}
        bbc="$borderColor"
        zi={1000}
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bc="$background"
      >
        <ContainerLarge>
          <Header floating />
        </ContainerLarge>
      </XStack>
    </Theme>
  )
}

const FeatureItem = ({ label, children }) => {
  return (
    <Paragraph>
      <Text fow="800">{label}</Text>&nbsp;&nbsp;—&nbsp;&nbsp;
      <Paragraph theme="alt3">{children}</Paragraph>
    </Paragraph>
  )
}

const FeaturesItems = () => {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" space="$2">
        <HomeH2>More to every component</HomeH2>
        <HomeH3>Time-saving props on every view</HomeH3>
      </YStack>

      <XStack p="$6" space="$4" $sm={{ flexDirection: 'column' }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            items={[
              <FeatureItem label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem label="Pseudo styles">
                hoverStyle, pressStyle, and focusStyle. Works in combination with media queries.
              </FeatureItem>,
              <FeatureItem label="Media queries">
                Every style can be adjusted based on screen sizes, written inline without losing
                performance.
              </FeatureItem>,
            ]}
          />
        </YStack>
        <YStack w="50%" $sm={{ w: `100%` }}>
          <Features
            items={[
              <FeatureItem label="Themes">
                Change themes with a single prop on all components.
              </FeatureItem>,
              <FeatureItem label="Animations">
                One line animations, easy to configure down to the property.
              </FeatureItem>,
              <FeatureItem label="DOM escape hatches">
                Pass className and HTML attributes directly. On native they are ignored.
              </FeatureItem>,
            ]}
          />
        </YStack>
      </XStack>
    </ContainerLarge>
  )
}

function Performance() {
  return (
    <ContainerLarge position="relative">
      <YStack ai="center" zi={1} space="$4">
        <YStack ai="center" space="$2">
          <HomeH2>Build more ambitious apps</HomeH2>
          <HomeH3>UX, meet DX - inline styles that run fast</HomeH3>
        </YStack>

        <YStack
          // borderStyle="dashed"
          // borderWidth={1}
          // borderColor="$colorTranslucent"
          p="$2"
          br="$8"
          width="100%"
          ai="stretch"
        >
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
