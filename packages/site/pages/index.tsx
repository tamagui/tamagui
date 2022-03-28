import { Community } from '@components/Community'
import { FeaturesGrid } from '@components/FeaturesGrid'
import { Hero } from '@components/Hero'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import Link from 'next/link'
import { Button, H2, H3, Image, Paragraph, Text, Theme, XStack, YStack } from 'tamagui'

import { BenchmarkChart } from '../components/BenchmarkChart'
import { ContainerLarge } from '../components/Container'
import { Features } from '../components/Features'
import { HeroExampleAnimations } from '../components/HeroExampleAnimations'
import { HeroExampleCode } from '../components/HeroExampleCode'
import { HeroExampleCarousel } from '../components/HeroExampleThemes'

export default function Home() {
  // return (
  //   <Theme debug name="blue">
  //     <Button>hello</Button>
  //   </Theme>
  // )

  console.warn('render home')

  return (
    <>
      <TitleAndMetaTags title="Tamagui — React Native + Web UI kit" />
      <YStack>
        <YStack space="$8">
          <Hero />
          <Divider />
          <HeroExampleCarousel />
          <Divider />
          <HeroExampleAnimations />
          <Divider />
          <HeroExampleCode />
          <Divider />
          <Performance />
          <Divider />
          <FeaturesItems />
          <Divider />
          <FeaturesGrid />
          <Divider />
          <Community />
        </YStack>
      </YStack>
    </>
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
        <H2>Fully-loaded views</H2>
        <Paragraph maxWidth={400} ta="center" size="$6" theme="alt3">
          Features built into the lowest level views that lead to huge savings in code.
        </Paragraph>
      </YStack>

      <XStack p="$6" space="$4" $sm={{ flexDirection: 'column' }}>
        <YStack w="50%" $sm={{ w: '100%' }}>
          <Features
            items={[
              <FeatureItem label="Press & hover events">
                Tamagui provides onHoverIn, onHoverOut, onPressIn, and onPressOut on all views,
                bringing the convenience of web to native.
              </FeatureItem>,
              <FeatureItem label="Pseudo styles">
                Style hover, press, and focus for all views, another typical big pain point in
                styling native. Works in combination with media queries.
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
                The theme prop lets you change the theme directly on each view, instead of adding
                nesting all over.
              </FeatureItem>,
              <FeatureItem label="Animations">
                Custom animations at the view level solve another big pain point in native and code
                sharing between native and web.
              </FeatureItem>,
              <FeatureItem label="DOM escape hatches">
                Pass className and any other HTML property directly to views. On native they are
                ignored.
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
          <H2>... it's really fast</H2>
          <H3 theme="alt2" fow="400">
            Incredible performance, even with inline styles
          </H3>
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

const Divider = () => (
  <YStack
    mt="$4"
    mb="$2"
    mx="auto"
    als="center"
    borderBottomColor="$borderColor"
    borderBottomWidth={1}
    width={100}
    height={0}
  />
)
