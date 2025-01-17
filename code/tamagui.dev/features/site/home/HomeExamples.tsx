import { ThemeTint, useTint } from '@tamagui/logo'
import { FastForward } from '@tamagui/lucide-icons'
import { memo, useState } from 'react'
import { Button, Paragraph, ScrollView, XGroup, XStack, YStack } from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { HomeH2, HomeH3 } from './HomeHeaders'
import { IconStack } from './IconStack'

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
        <YStack zi={1} space="$6" mb="$4">
          {!onlyDemo && (
            <YStack ai="center" space="$3">
              <HomeH2>A powerful style system</HomeH2>
              <HomeH3 ai="center" jc="center">
                A multi-faceted optimizing compiler enables
                <br />
                <strong>{subtitles[activeIndex]}</strong>.
              </HomeH3>
            </YStack>
          )}

          <ThemeTint>
            <XGroup
              scrollable
              bordered
              bg="$color2"
              maxWidth="100%"
              als="center"
              ov="hidden"
              {...(onlyDemo && {
                mt: '$-6',
              })}
            >
              {examples.map((example, i) => {
                return (
                  <XGroup.Item key={i}>
                    <Button
                      accessibilityLabel="See example"
                      onPress={() => setActiveIndex(i)}
                      theme={i === activeIndex ? 'surface2' : null}
                      chromeless={i !== activeIndex}
                      borderRadius={0}
                      size="$3"
                      fontFamily="$silkscreen"
                    >
                      {example.name}
                    </Button>
                  </XGroup.Item>
                )
              })}
            </XGroup>
          </ThemeTint>

          <XStack
            theme="surface1"
            pos="relative"
            jc="space-between"
            $sm={{ fd: 'column' }}
            {...(onlyDemo && {
              fd: 'column',
            })}
          >
            <YStack
              key={`input${activeIndex}`}
              f={1}
              maxWidth="50%"
              {...(onlyDemo && { maxWidth: '100%' })}
              $sm={{ maxWidth: '100%' }}
              px="$2"
              space
            >
              <Paragraph
                maw={480}
                als="center"
                size="$5"
                minHeight={50}
                ta="center"
                px="$6"
              >
                <span style={{ opacity: 0.65 }}>{activeExample.input.description}</span>
              </Paragraph>
              <CodeExamples title="Input" {...activeExample.input} />
            </YStack>

            <YStack
              $sm={{ display: 'none' }}
              {...(onlyDemo && { display: 'none' })}
              pos="absolute"
              left={0}
              right={0}
              ai="center"
              jc="center"
              top="55%"
              theme="alt2"
              zIndex={1000}
              pe="none"
            >
              <IconStack als="center" p="$2.5" mb={0} elevation="$2">
                <FastForward color="var(--colorHover)" size="$1" />
              </IconStack>
            </YStack>
            <YStack
              key={`output${activeIndex}`}
              f={1}
              maxWidth="50%"
              {...(onlyDemo && { maxWidth: '100%', mt: '$6' })}
              $sm={{ maxWidth: '100%', mt: '$6' }}
              px="$2"
              space
            >
              <Paragraph
                maw={480}
                als="center"
                size="$5"
                minHeight={50}
                ta="center"
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
    <YStack overflow="hidden" flex={1}>
      <>
        <ScrollView
          als="center"
          ai="center"
          zi={10}
          horizontal
          showsHorizontalScrollIndicator={false}
          mb="$-2.5"
          maw="100%"
        >
          <XStack px="$4" fs={0} space>
            <Button disabled size="$2" fontSize="$4" px="$4">
              {title}
            </Button>
            <XGroup size="$2" bordered>
              {examples.map((example, i) => (
                <XGroup.Item key={i}>
                  <Button
                    accessibilityLabel="See example"
                    onPress={() => setActiveIndex(i)}
                    theme={i === activeIndex ? (tint as any) : 'alt1'}
                    size="$2"
                    borderRadius="$0"
                  >
                    {example.name}
                  </Button>
                </XGroup.Item>
              ))}
            </XGroup>
          </XStack>
        </ScrollView>
      </>
      <XStack maxWidth="100%" f={1}>
        <YStack f={1} maxWidth="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
          <CodeDemoPreParsed
            height={325}
            maxHeight={325}
            f={1}
            language={example.language}
            source={example.code}
          />
        </YStack>
      </XStack>
    </YStack>
  )
})
