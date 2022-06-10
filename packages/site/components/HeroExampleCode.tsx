import { FastForward } from '@tamagui/feather-icons'
import { memo, useState } from 'react'
import { Button, Group, Paragraph, XStack, YStack } from 'tamagui'

import { CodeInline } from './Code'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'
import { IconStack } from './IconStack'

export function HeroExampleCode({ examples }) {
  const { tint } = useTint()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeExample = examples[activeIndex]

  return (
    <>
      <ContainerLarge position="relative">
        <YStack zi={1} space="$6">
          <YStack space="$2">
            <HomeH2>DX 🤝 UX</HomeH2>
            <HomeH3>
              Maintainable, cross-platform, performant + easier&nbsp;to&nbsp;use and debug.
            </HomeH3>
          </YStack>

          <Group bordered theme={tint} maxWidth="100%" als="center" scrollable>
            {examples.map((example, i) => {
              return (
                <Button
                  accessibilityLabel="See example"
                  onPress={() => setActiveIndex(i)}
                  theme={i === activeIndex ? 'active' : null}
                  key={i}
                  borderRadius={0}
                  size="$4"
                  fontFamily="$silkscreen"
                  // fontWeight={i === activeIndex ? '700' : '400'}
                >
                  {example.name}
                </Button>
              )
            })}
          </Group>

          <XStack pos="relative" $sm={{ flexDirection: 'column' }} mt="$2" jc="space-between">
            <YStack
              key={`input${activeIndex}`}
              f={1}
              maxWidth="50%"
              $sm={{ maxWidth: '100%' }}
              px="$2"
              space="$4"
            >
              <CodeExamples {...activeExample.input} />
              <Paragraph size="$4" minHeight={50} ta="center" px="$7">
                <CodeInline size="$4">Input</CodeInline>
                <span style={{ opacity: 0.65 }}>
                  &nbsp;－&nbsp;{activeExample.input.description}
                </span>
              </Paragraph>
            </YStack>

            <YStack
              $sm={{ display: 'none' }}
              pos="absolute"
              left={0}
              right={0}
              ai="center"
              jc="center"
              top={95}
              theme="alt2"
              zIndex={1000}
              pe="none"
            >
              <IconStack als="center" p="$3" mb={0}>
                <FastForward color="var(--colorHover)" size={22} />
              </IconStack>
            </YStack>
            <YStack
              key={`output${activeIndex}`}
              f={1}
              maxWidth="50%"
              $sm={{ maxWidth: '100%', mt: '$6' }}
              px="$2"
              space="$4"
            >
              <CodeExamples {...activeExample.output} />
              <Paragraph size="$4" minHeight={50} ta="center" px="$6">
                <CodeInline size="$4">Output</CodeInline>
                <span style={{ opacity: 0.65 }}>
                  &nbsp;－&nbsp;{activeExample.output.description}
                </span>
              </Paragraph>
            </YStack>
          </XStack>
        </YStack>
      </ContainerLarge>
    </>
  )
}

const CodeExamples = memo(({ examples }: any) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const example = examples[activeIndex]

  return (
    <YStack overflow="hidden" flex={1}>
      <>
        <Group bordered zi={10} mb="$-4" als="center">
          {examples.map((example, i) => (
            <Button
              accessibilityLabel="See example"
              onPress={() => setActiveIndex(i)}
              theme={i === activeIndex ? 'active' : 'alt1'}
              size="$3"
              key={i}
              borderRadius="$0"
              fontWeight="800"
            >
              {example.name}
            </Button>
          ))}
        </Group>
      </>
      <XStack maxWidth="100%" f={1}>
        <YStack f={1} maxWidth="100%" opacity={0.9} hoverStyle={{ opacity: 1 }}>
          <CodeDemoPreParsed
            height={300}
            theme="Card"
            maxHeight={300}
            f={1}
            language={example.language}
            source={example.code}
          />
        </YStack>
      </XStack>
    </YStack>
  )
})
