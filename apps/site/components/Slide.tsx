import { RootStore } from '@tamagui/site/app/(protected)/studio/state/RootStore'
import React from 'react'
import {
  FontSizeTokens,
  H1,
  H2,
  Paragraph,
  SpaceTokens,
  Spacer,
  Theme,
  ThemeName,
  XStack,
  YStack,
  useComposedRefs,
  useThemeName,
} from 'tamagui'

import { Code } from './Code'
import { DocCodeBlock } from './DocsCodeBlock'
import { DivProps, useHoverGlow } from './HoverGlow'

export type SlideProps = {
  title?: React.ReactNode
  subTitle?: string
  steps: TextContent[]
  variant?: 1
  theme?: ThemeName
}

type SlideStepItem =
  | {
      type: 'space'
      size?: SpaceTokens
    }
  | {
      type: 'callout'
      content: any
    }
  | {
      type: 'content'
      content: any
    }
  | {
      type: 'image'
      image: {
        width: number
        height: number
        src: string
      }
    }
  | {
      type: 'vertical'
      content: SlideStepItem[]
    }
  | {
      type: 'text'
      content: React.ReactNode
    }
  | {
      type: 'text-bold'
      content: React.ReactNode
    }
  | {
      type: 'code' | 'code-inline'
      content: string
      lang?: 'tsx'
    }
  | {
      type: 'bullet-point'
      size?: FontSizeTokens
      slim?: boolean
      content: SlideStepItem[]
    }
  | {
      type: 'split-horizontal'
      content: SlideStepItem[]
    }

type TextContent = SlideStepItem[]

export function Slide(props: SlideProps) {
  const glows = useGlows(props.variant)

  return (
    <Theme name={props.theme}>
      <YStack fullscreen zi={-1}>
        {glows.elements}
      </YStack>
      <YStack ref={glows.ref as any} space="$8" w="100%" h="100%" p="$12">
        <YStack space="$4">
          {Boolean(props.title) && (
            <H1
              fontSize={90}
              lh={120}
              textShadowColor="$shadowColor"
              textShadowRadius={10}
              textShadowOffset={{ height: 10, width: 0 }}
              als="center"
            >
              {props.title}
            </H1>
          )}

          {Boolean(props.subTitle) && (
            <H2 size="$9" theme="alt2" als="center">
              {props.subTitle}
            </H2>
          )}
        </YStack>

        {props.steps.map((step, index) => {
          return (
            <React.Fragment key={index}>
              <YStack f={1} space="$10">
                {step.map((item, index) => {
                  return (
                    <React.Fragment key={index}>{getTextContent([item])}</React.Fragment>
                  )
                })}
              </YStack>
            </React.Fragment>
          )
        })}
      </YStack>
    </Theme>
  )
}

function useGlows(variant: SlideProps['variant']) {
  const themeName = useThemeName()
  const next = RootStore.colors.indexOf(themeName) + 1
  // todo use for glint
  const altColorName = RootStore.colors[next % RootStore.colors.length]

  const glow = useHoverGlow({
    resist: 65,
    size: 700,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.4,
    background: 'transparent',
  })

  const glint = useHoverGlow({
    resist: 90,
    size: 200,
    strategy: 'blur',
    color: 'var(--color2)',
    blurPct: 10,
    offset: {
      x: 200,
      y: -200,
    },
    opacity: 0.5,
    background: 'transparent',
    inverse: true,
  })

  const ref = useComposedRefs(glow.parentRef, glint.parentRef)

  return {
    ref,
    elements: (
      <>
        {glow.Component()}
        <Theme name={altColorName as any}>{glint.Component()}</Theme>
      </>
    ),
  }
}

function getTextContent(
  text: TextContent,
  options: { size?: FontSizeTokens; wrapperStyle?: DivProps['style'] } = {}
) {
  const { size, wrapperStyle } = options
  return (
    <div
      style={{
        display: 'inline-block',
        ...wrapperStyle,
      }}
    >
      {text.map((item) => {
        switch (item.type) {
          case 'content':
            return item.content

          case 'image':
            return (
              <YStack f={1} ai="center">
                <img
                  style={{
                    alignSelf: 'center',
                    maxWidth: '100%',
                    width: item.image.width * 0.5,
                  }}
                  src={item.image.src}
                />
              </YStack>
            )

          case 'vertical':
            return <YStack>{getTextContent(item.content)}</YStack>

          case 'split-horizontal':
            return (
              <XStack h="100%" ai="center" f={1} gap="$6">
                <YStack jc="center" maw="50%" f={1} ov="hidden">
                  {getTextContent([item.content[0]], options)}
                </YStack>
                <YStack jc="center" maw="50%" f={1} ov="hidden">
                  {getTextContent([item.content[1]], options)}
                </YStack>
              </XStack>
            )

          case 'bullet-point':
            return (
              <YStack
                pl="$10"
                pt="$4"
                pr="$10"
                {...(item.slim && {
                  pl: '$2',
                  pr: '$2',
                  mb: '$0',
                })}
              >
                {getTextContent([{ type: 'text', content: '· ' }, ...item.content], {
                  size: item.size ?? size ?? '$9',
                })}
              </YStack>
            )
          case 'code-inline':
            return (
              <Code bc="$color8" color="$color11" size={size ?? '$9'} px="$3" py="$2">
                {item.content}
              </Code>
            )

          case 'space':
            return <Spacer />

          case 'code':
            return (
              <DocCodeBlock isHighlightingLines size={size ?? '$6'}>
                {item.content}
              </DocCodeBlock>
            )

          case 'callout':
            return (
              <YStack f={1} ai="center" jc="center" h="60vh">
                <Paragraph
                  theme="yellow"
                  color="$color10"
                  als="center"
                  ta="center"
                  p="$10"
                  size="$13"
                >
                  {item.content}&nbsp;
                </Paragraph>
              </YStack>
            )

          case 'text':
            return (
              <Paragraph size={size ?? '$9'} fow="400" lh="$10">
                {item.content}&nbsp;
              </Paragraph>
            )

          case 'text-bold':
            return (
              <Paragraph fow="800" size={size ?? '$9'} lh="$10">
                {item.content}&nbsp;
              </Paragraph>
            )
        }
      })}
    </div>
  )
}
