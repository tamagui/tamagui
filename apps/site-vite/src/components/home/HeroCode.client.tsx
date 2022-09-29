import { FastForward } from '@tamagui/feather-icons'
import React from 'react'
import { memo, useState } from 'react'
import { Button, Paragraph, XGroup, XStack, YStack } from 'tamagui'

import { CodeInline } from '../code/Code'
import { CodeDemoPreParsed } from '../code/CodeDemoPreParsed'
import { useTint } from '../header/ColorToggleButton.client'

export function HeroCode({ examples }) {
  const { tint } = useTint()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeExample = examples[activeIndex]

  if (!activeExample) {
    return null
  }

  return (
    <>
      <XGroup bordered theme={tint} maxWidth="100%" als="center" scrollable>
        {examples.map((example, i) => {
          return (
            <Button
              accessibilityLabel="See example"
              onPress={() => setActiveIndex(i)}
              theme={i === activeIndex ? 'active' : null}
              key={i}
              borderRadius={0}
              size="$3"
              fontFamily="$silkscreen"
            >
              {example.name}
            </Button>
          )
        })}
      </XGroup>

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
            <span style={{ opacity: 0.65 }}>&nbsp;－&nbsp;{activeExample.input.description}</span>
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
          {/* <IconStack als="center" p="$3" mb={0}>
            <FastForward color="var(--colorHover)" size={22} />
          </IconStack> */}
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
            <span style={{ opacity: 0.65 }}>&nbsp;－&nbsp;{activeExample.output.description}</span>
          </Paragraph>
        </YStack>
      </XStack>
    </>
  )
}

const CodeExamples = memo(({ examples }: any) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const example = examples[activeIndex]
  const { tint } = useTint()

  return (
    <YStack overflow="hidden" flex={1}>
      <>
        <XGroup theme={tint} bordered zi={10} mb="$-3" als="center">
          {examples.map((example, i) => (
            <Button
              accessibilityLabel="See example"
              onPress={() => setActiveIndex(i)}
              theme={i === activeIndex ? 'active' : 'alt1'}
              size="$2"
              key={i}
              borderRadius="$0"
            >
              {example.name}
            </Button>
          ))}
        </XGroup>
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
