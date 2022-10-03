import { ChevronRight, FastForward } from '@tamagui/feather-icons'
import Link from 'next/link'
import React from 'react'
import { memo, useState } from 'react'
import { Button, H5, Paragraph, XGroup, XStack, YStack, useMedia } from 'tamagui'

import { CodeInline } from './Code'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'
import { IconStack } from './IconStack'
import { useTint } from './useTint'

export function HeroExampleCode({ examples, onlyDemo }: { examples: any; onlyDemo?: boolean }) {
  const { tint } = useTint()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeExample = examples[activeIndex]
  const subtitles = ['atomic CSS', 'partial evaluation', 'tree flattening', 'code elimination']

  return (
    <>
      <ContainerLarge position="relative">
        <YStack zi={1} space="$6">
          {!onlyDemo && (
            <YStack ai="center" space="$3">
              <HomeH2 size="$10">Less syntax, better performance</HomeH2>
              {/* <Link passHref href="/blog/how-tamagui-optimizes"> */}
              <HomeH3 maw={500} tag="a" ai="center" jc="center">
                Optimized with <strong>{subtitles[activeIndex]}</strong>.
              </HomeH3>
              {/* </Link> */}
            </YStack>
          )}

          <XGroup
            scrollable
            bordered
            bc="$color2"
            chromeless
            theme={tint}
            maxWidth="100%"
            als="center"
          >
            {examples.map((example, i) => {
              return (
                <Button
                  accessibilityLabel="See example"
                  onPress={() => setActiveIndex(i)}
                  theme={i === activeIndex ? 'active' : null}
                  o={i === activeIndex ? 1 : 0.5}
                  key={i}
                  borderRadius={0}
                  size="$4"
                  fontFamily="$silkscreen"
                  chromeless
                >
                  {example.name}
                </Button>
              )
            })}
          </XGroup>

          <XStack
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
              space="$4"
            >
              <H5 als="center">Input</H5>
              <Paragraph size="$5" minHeight={50} ta="center" px="$6">
                <span style={{ opacity: 0.65 }}>{activeExample.input.description}</span>
              </Paragraph>
              <CodeExamples {...activeExample.input} />
            </YStack>

            <YStack
              $sm={{ display: 'none' }}
              {...(onlyDemo && { display: 'none' })}
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
              {...(onlyDemo && { maxWidth: '100%', mt: '$6' })}
              $sm={{ maxWidth: '100%', mt: '$6' }}
              px="$2"
              space="$4"
            >
              <H5 als="center">Output</H5>
              <Paragraph size="$5" minHeight={50} ta="center" px="$6">
                <span style={{ opacity: 0.65 }}>{activeExample.output.description}</span>
              </Paragraph>
              <CodeExamples {...activeExample.output} />
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
  const { tint } = useTint()

  return (
    <YStack overflow="hidden" flex={1}>
      <>
        <XGroup size="$2" theme={tint} bordered zi={10} mb="$-3" als="center">
          {examples.map((example, i) => (
            <Button
              accessibilityLabel="See example"
              onPress={() => setActiveIndex(i)}
              theme={i === activeIndex ? 'active' : 'alt1'}
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
