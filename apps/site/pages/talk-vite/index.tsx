import { LogoWords, TamaguiLogo } from '@tamagui/logo'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { Spacer, XStack, YStack } from 'tamagui'

import { Slide, SlideStepItem } from '../../components/Slide'
import { Slides, slideDimensions } from '../../components/Slides'
import { ThemeToggle } from '../../components/ThemeToggle'
import slideWhy from '../talk/slides/slide-why'
import TitleSlide from '../talk/slides/slide1'

export default function TamaguiViteTalk() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <YStack {...slideDimensions}>
      <NextSeo title="Tamagui Vite Talk" description="Tamagui Vite Talk" />
      <XStack pos="absolute" t="$0" l="$0" r="$0" p="$4" zi={1000}>
        <YStack>
          <TamaguiLogo y={15} x={10} downscale={2} />
        </YStack>

        <YStack fullscreen ai="center" jc="center">
          <LogoWords />
        </YStack>

        <Spacer flex />

        <ThemeToggle borderWidth={0} chromeless />
      </XStack>

      <YStack pos="absolute" {...slideDimensions} ov="hidden">
        <YStack o={0.6} fullscreen>
          <YStack fullscreen className="bg-grid" />
        </YStack>
        {/* <RibbonContainer /> */}
      </YStack>

      <Slides
        slides={[
          SlideGuy,
          Slide1,
          () => (
            <Slide
              theme="yellow"
              steps={[
                [
                  {
                    type: 'callout',
                    size: '$13',
                    content: `What if... we could write native and web apps with`,
                  },
                ],
              ]}
            />
          ),
          () => (
            <Slide
              theme="green"
              steps={[
                [
                  {
                    type: 'callout',
                    size: '$15',
                    content: `...a single codebase...`,
                  },
                ],
              ]}
            />
          ),
          () => (
            <Slide
              theme="blue"
              steps={[
                [
                  {
                    type: 'callout',
                    size: '$15',
                    content: `...a single bundler...`,
                  },
                ],
              ]}
            />
          ),
          () => (
            <Slide
              theme="purple"
              steps={[
                [
                  {
                    type: 'callout',
                    size: '$15',
                    content: `...a single set of file routes...`,
                  },
                ],
              ]}
            />
          ),
          () => (
            <Slide
              theme="pink"
              steps={[
                [
                  {
                    type: 'callout',
                    size: '$14',
                    content: `...and (maybe) a single data abstraction...`,
                  },
                ],
              ]}
            />
          ),
          () => <Slide title="How?" theme="purple" steps={[bp4, bp3, bp1, bp2]} />,
          () => (
            <Slide
              theme="pink"
              steps={[
                [
                  {
                    type: 'horizontal',
                    content: [
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 200,
                        },
                        content: 'V',
                      },
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 200,
                        },
                        content: 'E',
                      },
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 200,
                        },
                        content: 'R',
                      },
                      {
                        type: 'code-inline',
                        props: {
                          fontSize: 200,
                        },
                        content: 'T',
                      },
                    ],
                  },
                ],
              ]}
            />
          ),
        ]}
      />
    </YStack>
  )
}

const bp1 = [
  {
    type: 'bullet-point',
    content: [
      {
        type: 'code-inline',
        props: {
          size: '$12',
        },
        content: 'React Native',
      },
      {
        type: 'text',
        props: {
          fontSize: 60,
        },
        content: 'Single platform.',
      },
    ],
  } satisfies SlideStepItem,
]

const bp2 = [
  {
    type: 'bullet-point',
    content: [
      {
        type: 'code-inline',
        props: {
          size: '$12',
        },
        content: 'Tamagui',
      },
      {
        type: 'text',
        props: {
          fontSize: 60,
        },
        content: 'Single performant UI kit.',
      },
    ],
  } satisfies SlideStepItem,
]

const bp3 = [
  {
    type: 'bullet-point',
    content: [
      {
        type: 'code-inline',
        props: {
          size: '$12',
        },
        content: 'Expo Router',
      },
      {
        type: 'text',
        props: {
          fontSize: 60,
        },
        content: 'Single FS routes.',
      },
    ],
  } satisfies SlideStepItem,
]

const bp4 = [
  {
    type: 'bullet-point',
    content: [
      {
        type: 'code-inline',
        props: {
          size: '$12',
        },
        content: 'Vite',
      },
      {
        type: 'text',
        props: {
          fontSize: 60,
        },
        content: 'Single bundler.',
      },
    ],
  } satisfies SlideStepItem,
]

const SlideGuy = () => (
  <Slide
    steps={[
      [
        {
          type: 'centered',
          content: [<TamaguiLogo scale={3} />],
        },
      ],
    ]}
  />
)

const Slide1 = () => {
  return <TitleSlide subTitle=" " />
}
