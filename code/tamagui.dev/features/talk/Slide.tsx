import React, { createContext, useContext, useEffect, useState } from 'react'
import type {
  FontSizeTokens,
  SizableTextProps,
  SizeTokens,
  SpaceTokens,
  ThemeName,
  YStackProps,
} from 'tamagui'
import {
  H1,
  H2,
  H4,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
  useComposedRefs,
  usePresence,
  useThemeName,
} from 'tamagui'
import { useHoverGlow, type DivProps } from '~/components/HoverGlow'
import { DocCodeBlock } from '../docs/DocsCodeBlock'
import { Code } from '~/components/Code'

export type SlideProps = {
  title?: React.ReactNode
  subTitle?: any
  steps: TextContent[]
  stepsStrategy?: 'replace' | 'additive'
  variant?: 1
  theme?: ThemeName
}

const superBouncyOpacityClamped = [
  'superBouncy',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as any

const lessBouncyOpacityClamped = [
  'slow',
  {
    opacity: {
      overshootClamping: true,
    },
    delay: 1000,
  },
] as any

export type SlideStepItem =
  | {
      type: 'fullscreen'
      content: any
    }
  | {
      type: 'space'
      size?: SpaceTokens
    }
  | {
      type: 'callout'
      content: any
      size?: SizeTokens
      image?: string
    }
  | {
      type: 'content'
      content: any
    }
  | {
      type: 'centered'
      content: any
    }
  | {
      type: 'image'
      variant?: 'circled' | 'centered'
      fullscreen?: boolean
      image: string
    }
  | {
      type: 'vertical'
      title?: any
      variant?: 'center-vertically'
      content: SlideStepItem[]
    }
  | {
      type: 'horizontal'
      title?: any
      content: SlideStepItem[]
    }
  | {
      type: 'text-overlay'
      props?: SizableTextProps
      variant?: 'good' | 'bad'
      content: React.ReactNode
    }
  | {
      type: 'text'
      props?: SizableTextProps
      content: React.ReactNode
    }
  | {
      type: 'text-bold'
      props?: SizableTextProps
      content: React.ReactNode
    }
  | {
      type: 'code' | 'code-inline'
      props?: SizableTextProps
      content: string
      lang?: 'tsx'
      title?: any
    }
  | {
      type: 'bullet-point'
      size?: FontSizeTokens
      slim?: boolean
      props?: YStackProps
      content: SlideStepItem[]
    }
  | {
      type: 'split-horizontal'
      variant?: 'centered'
      content: SlideStepItem[]
    }

type TextContent = SlideStepItem[]

export const SlideContext = createContext({
  registerSlide(next: (inc: number, fixStep?: number) => boolean) {},
})

export function Slide(props: SlideProps) {
  return (
    <Theme name={props.theme}>
      <SlideInner {...props} />
    </Theme>
  )
}

const SlideInner = (props: SlideProps) => {
  const showAllSteps = useContext(ShowAllStepsContext)
  const glows = useGlows(props.variant)
  const [isPresent] = usePresence()
  const max = props.steps.length
  const [step, setStep] = useState(max > 1 ? 0 : 1)
  const context = useContext(SlideContext)

  useEffect(() => {
    if (!isPresent) return
    return context.registerSlide((inc, setAt) => {
      const next = setAt ?? step + inc
      if (next >= 1 && next <= max) {
        setStep(next)
        return false
      }
      return true
    })
  }, [step, isPresent])

  const getStep = (step: TextContent) =>
    step?.map((item, index) => {
      return (
        <React.Fragment key={index}>
          {getTextContent([item], {
            wrapperStyle:
              props.stepsStrategy === 'replace'
                ? {}
                : {
                    display: 'contents',
                  },
          })}
        </React.Fragment>
      )
    })

  const stepsContent =
    props.stepsStrategy === 'replace'
      ? getStep(props.steps[step - 1])
      : props.steps
          .slice(0, showAllSteps ? Infinity : step)
          .map((s, i) => <React.Fragment key={i}>{getStep(s)}</React.Fragment>)

  const nextStepPreload = getStep(props.steps[step])

  return (
    <>
      <YStack fullscreen zi={-1}>
        {showAllSteps ? null : glows.elements}
      </YStack>
      <YStack ref={glows.ref as any} space="$7" w="90%" h="100%" p="$12">
        <YStack gap="$4">
          {Boolean(props.title) && (
            <H1
              fontSize={75}
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
            <H2 size="$10" theme="alt2" als="center">
              {props.subTitle}
            </H2>
          )}
        </YStack>

        <YStack f={1} gap="$10" maxHeight="100%" flexWrap="wrap" w="100%">
          {stepsContent}
        </YStack>

        <YStack pos="absolute" o={0} zi={-1}>
          {nextStepPreload}
        </YStack>
      </YStack>
    </>
  )
}

export const ShowAllStepsContext = createContext(false)

const colors = ['red', 'orange', 'blue', 'purple', 'green', 'pink', 'yellow']

function useGlows(variant: SlideProps['variant']) {
  const colorThemeName = useThemeName().replace('dark_', '').replace('light_', '')
  const next = colors.indexOf(colorThemeName) + 1
  const nextIndex = next % colors.length
  const altColorName = colors[nextIndex]

  const glow = useHoverGlow({
    resist: 65,
    size: 1000,
    strategy: 'blur',
    blurPct: 100,
    color: 'var(--color10)',
    opacity: 0.3,
    background: 'transparent',
    offset: {
      x: -100,
      y: 100,
    },
  })

  const glint = useHoverGlow({
    resist: 90,
    size: 800,
    strategy: 'blur',
    color: `var(--${altColorName}10)`,
    blurPct: 100,
    offset: {
      x: 350,
      y: -340,
    },
    opacity: 0.2,
    background: 'transparent',
    inverse: true,
  })

  const ref = useComposedRefs(glow.parentRef, glint.parentRef)

  return {
    ref,
    elements: (
      <>
        <YStack className="rotate-slow-right">
          <glow.Component />
        </YStack>
        <YStack className="rotate-slow-left">
          <glint.Component />
        </YStack>
      </>
    ),
  }
}

function getTextContent(
  text: TextContent,
  options: { size?: FontSizeTokens; wrapperStyle?: DivProps['style'] } = {}
) {
  const { size, wrapperStyle } = options

  const noWrapper = text.length === 1
  const content = text.map((item, index) => {
    return (
      <React.Fragment key={index}>
        {(() => {
          switch (item.type) {
            case 'content':
              return item.content

            case 'image':
              return (
                <YStack
                  f={1}
                  ai="center"
                  className="fade-image-in"
                  {...(item.variant === 'circled' && {
                    bg: '$background',
                    minWidth: 600,
                    minHeight: 600,
                    maxWidth: 600,
                    maxHeight: 600,
                    ai: 'center',
                    jc: 'center',
                    borderRadius: 10000,
                    als: 'center',
                    mx: 'auto',
                    elevation: '$6',
                    ov: 'hidden',
                    bw: 5,
                    bc: '$borderColor',
                  })}
                  {...(item.variant === 'centered' && {
                    als: 'center',
                    ai: 'center',
                    jc: 'center',
                    h: '100%',
                    maw: '90%',
                    minWidth: '90%',
                  })}
                  {...(item.fullscreen && {
                    scale: 2,
                    zi: 10000,
                  })}
                >
                  <div
                    style={{
                      alignSelf: 'center',
                      minWidth: '100%',
                      minHeight: '100%',
                      maxHeight: '100%',
                      maxWidth: '100%',
                      backgroundImage: `url(${item.image})`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      flex: 1,
                      backgroundSize: item.variant === 'circled' ? 'cover' : 'contain',
                    }}
                  />
                </YStack>
              )

            case 'vertical':
              return (
                <YStack
                  h="100%"
                  {...(item.variant === 'center-vertically' && {
                    ai: 'center',
                    jc: 'center',
                  })}
                >
                  {!!item.title && (
                    <H4 size="$10" als="center" mb="$4" color="$color9">
                      {item.title}
                    </H4>
                  )}
                  {getTextContent(item.content)}
                </YStack>
              )

            case 'horizontal':
              return (
                <XStack ai="center" jc="center" h="100%">
                  {!!item.title && (
                    <H4 size="$10" als="center" mb="$4" color="$color9">
                      {item.title}
                    </H4>
                  )}
                  <XStack>{getTextContent(item.content)}</XStack>
                </XStack>
              )

            case 'split-horizontal':
              return (
                <XStack
                  maw="100%"
                  ov="hidden"
                  h="100%"
                  ai="center"
                  f={1}
                  gap="$6"
                  {...(item.variant === 'centered' && {
                    my: 120,
                  })}
                >
                  <YStack jc="center" als="stretch" maw="50%" f={1} ov="hidden">
                    {getTextContent([item.content[0]], options)}
                  </YStack>
                  <YStack jc="center" als="stretch" maw="50%" f={1} ov="hidden">
                    {getTextContent([item.content[1]], options)}
                  </YStack>
                </XStack>
              )

            case 'bullet-point':
              return (
                <YStack
                  pl="$8"
                  pt="$2"
                  pr="$8"
                  mb="$-1.5"
                  {...(item.slim && {
                    pl: '$2',
                    pr: '$2',
                    pt: '$0',
                  })}
                  animation={superBouncyOpacityClamped}
                  enterStyle={{
                    o: 0,
                    y: -10,
                  }}
                  y={0}
                  o={1}
                  {...item.props}
                >
                  {getTextContent([{ type: 'text', content: '· ' }, ...item.content], {
                    size: item.size ?? size ?? '$9',
                  })}
                </YStack>
              )
            case 'code-inline':
              return (
                <Code
                  bg="$color8"
                  // @ts-ignore
                  color="$color11"
                  px="$3"
                  py="$2"
                  mr="$4"
                  // @ts-ignore
                  fontSize={32}
                  {...(size && {
                    size,
                  })}
                  {...item.props}
                >
                  {item.content}
                </Code>
              )

            case 'space':
              return <Spacer />

            case 'code': {
              const content = (
                <YStack mx="$6">
                  <DocCodeBlock
                    disableCopy
                    isHighlightingLines
                    size={size ?? '$8'}
                    fontSize={26}
                    lineHeight={36}
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </DocCodeBlock>
                </YStack>
              )

              if (item.title) {
                return (
                  <YStack ai="center" space>
                    <H4 size="$9">{item.title}</H4>
                    {content}
                  </YStack>
                )
              }

              return content
            }

            case 'callout': {
              let size = item.size ?? ('$12' as any)

              if (!item.size) {
                if (typeof item.content === 'string') {
                  const sizeNum = Math.min(
                    Math.max(11, Math.round(430 / item.content.length)),
                    15
                  )
                  size = `$${sizeNum}`
                }
              }

              return (
                <YStack
                  className="fade-image-in"
                  mah="100%"
                  f={1}
                  ai="center"
                  jc="center"
                  px="$8"
                  als="center"
                  maw={1200}
                  // animation={lessBouncyOpacityClamped}
                  // enterStyle={{
                  //   o: 0,
                  //   scale: 0.9,
                  // }}
                  // scale={1}
                  // o={1}
                >
                  <Paragraph
                    color="$color11"
                    als="center"
                    className="callout"
                    ta="center"
                    p="$10"
                    scale={1.3}
                    size={size}
                  >
                    {item.content}&nbsp;
                  </Paragraph>

                  {item.image && (
                    <img
                      className="fade-image-in"
                      style={{
                        alignSelf: 'center',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        position: 'absolute',
                        zIndex: -1,
                        transform: `scale(2)`,
                      }}
                      src={item.image}
                    />
                  )}
                </YStack>
              )
            }

            case 'centered': {
              let size = '$10' as any

              if (typeof item.content === 'string') {
                const sizeNum = Math.min(
                  Math.max(8, Math.round(700 / item.content.length)),
                  16
                )
                size = `$${sizeNum}`
              }

              return (
                <YStack f={1} ai="center" jc="center" px="$6">
                  <Paragraph als="center" ta="center" size={size}>
                    {item.content}&nbsp;
                  </Paragraph>
                </YStack>
              )
            }

            case 'fullscreen':
              return <YStack fullscreen>{item.content}</YStack>

            case 'text':
              return (
                <Paragraph fos={36} fow="400" lh="$10" {...item.props}>
                  {item.content}&nbsp;
                </Paragraph>
              )

            case 'text-bold':
              return (
                <Paragraph
                  fow="800"
                  fontSize={44}
                  {...(size && { size })}
                  lh="$10"
                  {...item.props}
                >
                  {item.content}&nbsp;
                </Paragraph>
              )

            case 'text-overlay':
              return (
                <Paragraph
                  pos="absolute"
                  t="0%"
                  r="0%"
                  shadowColor="$shadowColor"
                  shadowRadius="$5"
                  zi={100000}
                  fow="800"
                  size={size ?? '$9'}
                  backgroundColor={
                    item.variant === 'good'
                      ? '$green8'
                      : item.variant === 'bad'
                        ? '$red8'
                        : '$background'
                  }
                  p="$2"
                  br="$6"
                  lh="$10"
                  rotate="10deg"
                  {...item.props}
                >
                  {item.content}&nbsp;
                </Paragraph>
              )
          }
        })()}
      </React.Fragment>
    )
  })

  if (noWrapper) {
    return content
  }

  return (
    <div
      style={{
        display: 'inline',
        flex: 1,
        maxHeight: '100%',
        ...wrapperStyle,
      }}
    >
      {content}
    </div>
  )
}
