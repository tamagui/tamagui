import { ThemeTint, useTint } from '@tamagui/logo'
import { FastForward } from '@tamagui/lucide-icons'
import { memo, useState } from 'react'
import { Button, Heading, Paragraph, ScrollView, XGroup, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { HomeH2, HomeH3 } from './HomeHeaders'
import { IconStack } from './IconStack'
import { Theme } from 'tamagui'

const defaultExample = {
  input: {
    description: '',
  },
  output: {
    description: '',
    examples: [],
  },
}

export const HomeExamples = memo(
  ({ examples, onlyDemo }: { examples: any; onlyDemo?: boolean }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    if (!examples) {
      console.error(`Missing examples!`)
      return null
    }

    const activeExample = examples[activeIndex] ?? defaultExample
    const subtitles = [
      'SSR-first atomic CSS',
      'eliminating inline style logic',
      'flattening your component tree',
      'removing dead code entirely',
    ]

    if (!activeExample) {
      return null
    }

    return (
      <ContainerLarge position="relative">
        <YStack z={1} gap="$6" mb="$4">
          {!onlyDemo && (
            <YStack items="center" gap="$3">
              <HomeH2>A powerful style system</HomeH2>
              <HomeH3 items="center" justify="center">
                A multi-faceted optimizing compiler enables
                <br />
                <strong>{subtitles[activeIndex]}</strong>.
              </HomeH3>
            </YStack>
          )}

          <ThemeTint>
            <XGroup
              scrollable
              borderWidth={1}
              borderColor="$borderColor"
              bg="$color2"
              maxW="100%"
              self="center"
              overflow="hidden"
              {...(onlyDemo && {
                mt: '$-6',
              })}
            >
              {examples.map((example, i) => {
                return (
                  <XGroup.Item key={i}>
                    <Button
                      aria-label="See example"
                      onPress={() => setActiveIndex(i)}
                      theme={i === activeIndex ? 'surface2' : null}
                      chromeless={i !== activeIndex}
                      rounded={0}
                      size="$3"
                    >
                      <Button.Text fontFamily="$silkscreen" size="$3" fontWeight="600">
                        {example.name}
                      </Button.Text>
                    </Button>
                  </XGroup.Item>
                )
              })}
            </XGroup>
          </ThemeTint>

          <XStack
            theme="surface1"
            position="relative"
            justify="space-between"
            $sm={{ flexDirection: 'column' }}
            {...(onlyDemo && {
              flexDirection: 'column',
            })}
          >
            <YStack
              key={`input${activeIndex}`}
              flex={1}
              maxW="50%"
              {...(onlyDemo && { maxW: '100%' })}
              $sm={{ maxW: '100%' }}
              px="$2"
              gap="$4"
            >
              <Paragraph
                maxW={480}
                self="center"
                size="$5"
                minH={50}
                text="center"
                px="$6"
              >
                <span style={{ opacity: 0.65 }}>{activeExample.input.description}</span>
              </Paragraph>
              <CodeExamples title="Input" {...activeExample.input} />
            </YStack>

            <YStack
              $sm={{ display: 'none' }}
              {...(onlyDemo && { display: 'none' })}
              position="absolute"
              l={0}
              r={0}
              items="center"
              justify="center"
              t="55%"
              theme="alt2"
              z={1000}
              pointerEvents="none"
            >
              <IconStack items="center" p="$2.5" mb={0} elevation="$2">
                <FastForward color="var(--colorHover)" size="$1" />
              </IconStack>
            </YStack>
            <YStack
              key={`output${activeIndex}`}
              flex={1}
              maxW="50%"
              {...(onlyDemo && { maxW: '100%', mt: '$6' })}
              $sm={{ maxW: '100%', mt: '$6' }}
              px="$2"
              gap="$4"
            >
              <Paragraph
                maxW={480}
                self="center"
                size="$5"
                minH={50}
                text="center"
                px="$6"
              >
                <span style={{ opacity: 0.65 }}>{activeExample.output.description}</span>
              </Paragraph>
              <CodeExamples title="Output" {...activeExample.output} />
            </YStack>
          </XStack>
        </YStack>
      </ContainerLarge>
    )
  }
)

const CodeExamples = memo(({ examples = [], title }: any) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const example = examples[activeIndex] || defaultExample
  const { tint } = useTint()

  return (
    <YStack overflow="hidden" flex={1} flexBasis="auto">
      <>
        <ScrollView
          self="center"
          items="center"
          z={10}
          horizontal
          showsHorizontalScrollIndicator={false}
          mb="$-2.5"
          maxW="100%"
        >
          <XStack px="$4" shrink={0} gap="$4">
            <Theme name="accent">
              <Heading
                bg="$color1"
                color="$color12"
                py="$1"
                size="$5"
                px="$4"
                rounded="$4"
                elevation={3}
              >
                {title}
              </Heading>
            </Theme>
            <XGroup size="$2" borderWidth={1} borderColor="$borderColor">
              {examples.map((example, i) => (
                <XGroup.Item key={i}>
                  <Button
                    aria-label="See example"
                    onPress={() => setActiveIndex(i)}
                    theme={i === activeIndex ? (tint as any) : 'alt1'}
                    size="$2"
                    rounded={0}
                  >
                    <Button.Text size="$2">{example.name}</Button.Text>
                  </Button>
                </XGroup.Item>
              ))}
            </XGroup>
          </XStack>
        </ScrollView>
      </>
      <XStack maxW="100%" flex={1} flexBasis="auto">
        <YStack flex={1} maxW="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
          <CodeDemoPreParsed
            flexBasis="auto"
            height={325}
            maxH={325}
            flex={1}
            language={example.language}
            source={example.code}
          />
        </YStack>
      </XStack>
    </YStack>
  )
})
