import React from 'react'
import {
  FontSizeTokens,
  H1,
  Paragraph,
  Theme,
  ThemeName,
  YStack,
  useComposedRefs,
} from 'tamagui'

import { Code, CodeInline } from './Code'
import { DocCodeBlock } from './DocsCodeBlock'
import { useHoverGlow } from './HoverGlow'

export type SlideProps = {
  title?: React.ReactNode
  steps: TextContent[]
  variant?: 1
  theme?: ThemeName
}

type TextItem =
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
      content: TextItem[]
    }

type TextContent = TextItem[]

export function Slide(props: SlideProps) {
  const glows = useGlows(props.variant)

  return (
    <Theme name={props.theme}>
      <YStack fullscreen zi={-1}>
        {glows.elements}
      </YStack>
      <YStack ref={glows.ref as any} space="$10" w="100%" h="100%" p="$12">
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

        {props.steps.map((step, index) => {
          return (
            <React.Fragment key={index}>
              <YStack space="$10">
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

function getTextContent(text: TextContent, { size }: { size?: FontSizeTokens } = {}) {
  return (
    <div style={{ display: 'inline-block' }}>
      {text.map((item) => {
        switch (item.type) {
          case 'bullet-point':
            return (
              <>
                {getTextContent([{ type: 'text', content: '· ' }, ...item.content], {
                  size: size ?? '$9',
                })}
              </>
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
