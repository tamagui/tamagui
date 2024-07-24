import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronLeft, ChevronRight, Lightbulb } from '@tamagui/lucide-icons'
import React, { useRef, useState } from 'react'
import type { ScrollViewProps, XStackProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  Paragraph,
  Separator,
  Stack,
  ScrollView,
  XStack,
  YStack,
  styled,
} from 'tamagui'

type PanelProps = XStackProps & {
  title?: React.ReactNode
  afterTitle?: React.ReactNode
  icon?: React.ReactNode
  steps?: React.ReactNode[]
  chromeless?: boolean
}

const Panel = ({
  children,
  title,
  icon,
  afterTitle,
  chromeless,
  ...props
}: PanelProps) => {
  return (
    <NoticeFrame
      {...props}
      {...(chromeless && {
        borderWidth: 0,
        padding: 0,
      })}
    >
      {!!title && (
        <>
          <XStack ai="center" jc="space-between" mb="$3">
            <Paragraph size="$6" fow="600">
              {title}
            </Paragraph>
            <XStack ai="center" gap="$4">
              {afterTitle}
              {icon}
            </XStack>
          </XStack>
          <Separator bc="$color5" />
        </>
      )}

      <XStack f={1}>
        <YStack f={1} gap="$2">
          {typeof children === 'string' ? (
            <NoticeParagraph>{children}</NoticeParagraph>
          ) : (
            children
          )}
        </YStack>

        <YStack>{!title && icon}</YStack>
      </XStack>
    </NoticeFrame>
  )
}

export const StudioNotice = ({ children, steps, ...props }: PanelProps) => {
  const [[page, direction], setPage] = useState([0, 0])
  const total = steps?.length ?? 0
  const index = wrap(0, total, page)
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }
  const enterVariant = direction === 1 || direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'

  return (
    <Panel
      icon={<Lightbulb size="$1" color="$color7" />}
      afterTitle={
        !steps ? null : (
          <XStack gap="$2" ai="center">
            <Paragraph mr="$2" size="$2" theme="alt2">
              {index + 1}/{total}
            </Paragraph>

            <Button
              accessibilityLabel="Carousel left"
              icon={ChevronLeft}
              size="$2"
              circular
              elevation="$0.5"
              onPress={() => paginate(-1)}
            />
            <Button
              accessibilityLabel="Carousel left"
              icon={ChevronRight}
              size="$2"
              circular
              elevation="$0.5"
              onPress={() => paginate(1)}
            />
          </XStack>
        )
      }
      {...props}
    >
      {children ? (
        children
      ) : steps ? (
        <YStack f={1} ov="hidden" mx="$-4" my="$-2">
          <ScrollViewWithFade showsVerticalScrollIndicator={false}>
            <AnimatePresence
              initial={false}
              enterVariant={enterVariant}
              exitVariant={exitVariant}
            >
              <YStackEnterable
                key={page}
                animation="quicker"
                gap="$3"
                pos="absolute"
                p="$4"
              >
                {steps[index]}
              </YStackEnterable>
            </AnimatePresence>
          </ScrollViewWithFade>
        </YStack>
      ) : null}
    </Panel>
  )
}

interface Size {
  width: number
  height: number
}

const ScrollViewWithFade = ({
  children,
  scrollFadeThreshold = 0,
  ...props
}: ScrollViewProps & {
  scrollFadeThreshold?: number
}) => {
  const state = useRef<{
    contentSize?: Size
    outerSize?: Size
    scrollPosition: Offset
  }>({
    scrollPosition: {
      x: 0,
      y: 0,
    },
  })

  const [status, setStatus] = useState<
    'fade-top' | 'fade-bottom' | 'fade-both' | 'no-fade'
  >('no-fade')

  function update() {
    const horizontal = !!props.horizontal
    const contentSize = state.current?.contentSize
    const outerSize = state.current?.outerSize
    const contentOffset = state.current?.scrollPosition

    if (!contentSize || !outerSize) return

    const isScrollable = horizontal
      ? contentSize.width > outerSize.width
      : contentSize.height > outerSize.height

    if (!isScrollable) {
      setStatus('no-fade')
      return
    }

    const check: CheckScrollPositionProps = {
      contentOffset,
      contentSize,
      horizontal,
      threshold: scrollFadeThreshold,
      outerSize,
    }

    const atStart = isAtStart(check)
    const atEnd = isAtEnd(check)

    if (!atStart && !atEnd) {
      setStatus('fade-both')
      return
    }

    if (atStart) {
      setStatus('fade-bottom')
      return
    }

    setStatus('fade-top')
  }

  return (
    <Stack f={1} pos="relative">
      {(status === 'fade-top' || status === 'fade-both') && (
        <LinearGradient
          pe="none"
          zi={1000}
          position="absolute"
          l={0}
          r={0}
          h="20%"
          colors={['$background', '$background0']}
        />
      )}

      {(status === 'fade-bottom' || status === 'fade-both') && (
        <LinearGradient
          pe="none"
          zi={1000}
          position="absolute"
          l={0}
          r={0}
          h="20%"
          b={0}
          colors={['$background0', '$background']}
        />
      )}

      <ScrollView
        {...props}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flex: 1,
        }}
        onLayout={(e) => {
          if (!state.current.outerSize) {
            state.current.outerSize = e.nativeEvent.layout
            update()
          }
        }}
        onScroll={(e) => {
          state.current.contentSize = e.nativeEvent.contentSize
          state.current.outerSize = e.nativeEvent.layoutMeasurement
          state.current.scrollPosition = e.nativeEvent.contentOffset
          update()
        }}
      >
        <YStack
          f={1}
          onLayout={(e) => {
            if (!state.current.contentSize) {
              state.current.contentSize = {
                height: e.nativeEvent.layout.height + 10,
                width: e.nativeEvent.layout.width,
              }
              update()
            }
          }}
        >
          {children}
        </YStack>
      </ScrollView>
    </Stack>
  )
}

interface ScrollLayout {
  height: number
  width: number
}

interface Offset {
  x: number
  y: number
}

interface CheckScrollPositionProps {
  threshold: number
  horizontal?: boolean
  outerSize: ScrollLayout
  contentOffset: Offset
  contentSize: Size
}

function isAtStart({ horizontal, contentOffset, threshold }: CheckScrollPositionProps) {
  return horizontal ? contentOffset.x <= threshold : contentOffset.y <= threshold
}

function isAtEnd({
  horizontal,
  outerSize,
  contentOffset,
  contentSize,
  threshold,
}: CheckScrollPositionProps) {
  return horizontal
    ? outerSize.width + contentOffset.x >= contentSize.width - threshold
    : outerSize.height + contentOffset.y >= contentSize.height - threshold
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -30, opacity: 0 } },
    isRight: { true: { x: 30, opacity: 0 } },
  } as const,
})

export const StudioSuccess = (props: PanelProps) => {
  return <Panel theme="green" icon={<Check size="$1" color="$color7" />} {...props} />
}

export const NoticeParagraph = styled(Paragraph, {
  pr: '$4',
  size: '$3',
  color: '$color11',
})

const NoticeFrame = styled(YStack, {
  className: 'no-opacity-fade',
  borderWidth: 2,
  borderColor: '$color6',
  p: '$4',
  py: '$3',
  bg: '$background',
  br: '$4',
  space: '$3',
  pos: 'relative',
})
