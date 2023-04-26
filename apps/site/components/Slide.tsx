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

import { Code } from './Code'
import { useHoverGlow } from './HoverGlow'

export type SlideProps = {
  title?: React.ReactNode
  steps: SlideSteps[]
  variant?: 1
  theme?: ThemeName
}

type TextItem = {
  type: 'code' | 'text'
  content: React.ReactNode
}

type TextContent = TextItem[]

type SlideSteps = {
  text?: React.ReactNode
  bulletPoints?: TextContent[]
}

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
              {step.bulletPoints && (
                <YStack space="$10">
                  {step.bulletPoints?.map((point, index) => {
                    return (
                      <React.Fragment key={index}>
                        {getTextContent([{ type: 'text', content: '· ' }, ...point], {
                          size: '$9',
                        })}
                      </React.Fragment>
                    )
                  })}
                </YStack>
              )}
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
  { size = '$6' }: { size?: FontSizeTokens } = {}
) {
  return (
    <div style={{ display: 'inline-block' }}>
      {text.map((item) => {
        switch (item.type) {
          case 'code':
            return <Code size={size}>{item.content}&nbsp;</Code>
          case 'text':
            return <Paragraph size={size}>{item.content}&nbsp;</Paragraph>
        }
      })}
    </div>
  )
}
