import React from 'react'
import {
  FontSizeTokens,
  H1,
  H2,
  Paragraph,
  Theme,
  ThemeName,
  XStack,
  YStack,
  useComposedRefs,
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
      type: 'image'
      image: {
        width: number
        height: number
        src: string
      }
    }
  | {
      type: 'text'
      content: React.ReactNode
    }
  | {
      type: 'code' | 'code-inline'
      content: string
      lang?: 'tsx'
    }
  | {
      type: 'bullet-point'
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
        {glint.Component()}
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
          case 'image':
            return (
              <img
                style={{ width: item.image.width * 0.5, height: item.image.height * 0.5 }}
                src={item.image.src}
              />
            )
          case 'split-horizontal':
            return (
              <XStack h="100%" ai="center" f={1} gap="$6">
                <YStack ai="center" jc="center" maw="50%" f={1} ov="hidden">
                  {getTextContent([item.content[0]], options)}
                </YStack>
                <YStack ai="center" jc="center" maw="50%" f={1} ov="hidden">
                  {getTextContent([item.content[1]], options)}
                </YStack>
              </XStack>
            )

          case 'bullet-point':
            return (
              <YStack pl="$8" pt="$4" mb="$-4">
                {getTextContent([{ type: 'text', content: '· ' }, ...item.content], {
                  size: size ?? '$9',
                })}
              </YStack>
            )
          case 'code-inline':
            return <Code size={size ?? '$9'}>{item.content}&nbsp;</Code>
          case 'code':
            return (
              <DocCodeBlock isHighlightingLines size={size ?? '$6'}>
                {item.content}&nbsp;
              </DocCodeBlock>
            )
          case 'text':
            return <Paragraph size={size ?? '$9'}>{item.content}&nbsp;</Paragraph>
        }
      })}
    </div>
  )
}
