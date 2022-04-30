// debug
import { ChevronLeft, ChevronRight, Lock, Monitor } from '@tamagui/feather-icons'
import throttle from 'lodash.throttle'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Circle, Image, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'

import { demoMedia } from '../constants/media'
import { useGet } from '../hooks/useGet'
import favicon from '../public/favicon.svg'
import { Container, ContainerLarge } from './Container'
import { HomeH2 } from './HomeH2'
import { IconStack } from './IconStack'
import { useOnIntersecting } from './useOnIntersecting'

// const Marker = memo(({ name, active, onPress, ...props }: any) => {
//   return (
//     <YStack className="unselectable" theme={active ? 'pink' : null} pos="absolute" {...props}>
//       <XStack pe="none" y={-80} ai="flex-start" space>
//         <YStack w={1} h={100} bc="$colorHover" opacity={active ? 0.5 : 0.1} />
//         <Button
//           borderWidth={1}
//           size="$4"
//           circular
//           pos="absolute"
//           top={0}
//           left={0}
//           y={-20}
//           x={-19}
//           fontSize={12}
//           onPress={() => {
//             onPress(name)
//           }}
//         >
//           {name}
//         </Button>
//       </XStack>
//     </YStack>
//   )
// })

const breakpoints = [
  { name: 'xs', at: demoMedia[0] },
  { name: 'sm', at: demoMedia[1] },
  { name: 'md', at: demoMedia[2] },
  { name: 'lg', at: demoMedia[3] },
]
const browserHeight = 445

export const HeroResponsive = memo(() => {
  const [bounding, setBounding] = useState<DOMRect | null>(null)
  const [prevMove, setPrevMove] = useState(0)
  const initialWidth =
    typeof window !== 'undefined' ? Math.max(400, Math.min(500, window.innerWidth / 2)) : 500
  const [hasIntersected, setHasIntersected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [move, setMove] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const safariRef = useRef<HTMLElement | null>(null)
  const getState = useGet({ move, isDragging })
  const [sizeI, setSizeI] = useState(0)

  useEffect(() => {
    if (!bounding) {
      updateBoundings()
      return
    }
    const width = bounding.width + move - 10
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (width > breakpoints[i].at) {
        setSizeI(i + 1)
        return
      }
    }
  }, [move, bounding])

  useEffect(() => {
    window.addEventListener('resize', updateBoundings)
    return () => {
      window.removeEventListener('resize', updateBoundings)
    }
  }, [])

  function updateBoundings() {
    const rect = safariRef.current?.getBoundingClientRect() ?? null
    setBounding(rect)
  }

  const onMove = throttle((e: MouseEvent) => {
    if (!getState().isDragging) return
    if (!bounding) {
      updateBoundings()
      return
    }
    if (!bounding) return
    const right = bounding.width + bounding.x
    const x = e.pageX - right
    const maxMove = breakpoints[breakpoints.length - 1].at - initialWidth + 120
    const nextMove = Math.min(maxMove, Math.max(0, x))
    const next = nextMove + (prevMove || 0)
    setMove(next)
    setPrevMove(0)
  }, 16)

  const stop = () => {
    setPrevMove(getState().move)
    setIsDragging(false)
  }

  useOnIntersecting(
    ref,
    ({ isIntersecting, dispose }, didResize) => {
      dispose?.()
      if (!isIntersecting) return
      setHasIntersected(true)
      const node = safariRef.current
      if (!node) return
      if (didResize) {
        updateBoundings()
      }
      setPrevMove(getState().move - 10)
      window.addEventListener('mousemove', onMove)
      return () => {
        onMove.cancel()
        dispose?.()
        window.removeEventListener('mousemove', onMove)
        stop()
      }
    },
    {
      threshold: 0.01,
    }
  )

  useEffect(() => {
    window.addEventListener('mouseup', stop)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('mouseup', stop)
      window.removeEventListener('blur', stop)
    }
  }, [])

  const width = `calc(${initialWidth}px + ${move}px)`
  const isSmall = initialWidth + move < 680

  const handleMarkerPress = useCallback((name) => {
    // todo animate to width
  }, [])

  return (
    <YStack ref={ref} y={0} mt={-180} pos="relative">
      <ContainerLarge pos="relative">
        <Header />
        <Spacer size="$6" />
        <YStack h={browserHeight + 80} />
        <XStack b={-20} pos="absolute" zi={1} f={1} space="$1">
          <YStack
            className="unselectable"
            pe={isDragging ? 'none' : 'auto'}
            w={width}
            f={1}
            ref={safariRef}
            theme="alt1"
          >
            <Theme name="pink">
              <Safari shouldLoad={hasIntersected} isSmall={isSmall} />
            </Theme>
          </YStack>

          <Container zi={-1} pos="absolute">
            <XStack x={-10}>
              {breakpoints.map((bp, i) => {
                return (
                  <Marker
                    key={i}
                    onPress={handleMarkerPress}
                    active={i === 0 ? true : sizeI > i}
                    name={breakpoints[i].name}
                    l={breakpoints[i].at}
                  />
                )
              })}
            </XStack>
          </Container>

          <YStack
            jc="center"
            cursor="ew-resize"
            onPressIn={() => {
              setIsDragging(true)
            }}
          >
            <YStack
              bc="$color"
              opacity={0.35}
              hoverStyle={{ opacity: 0.4 }}
              br="$8"
              w={8}
              height={134}
            />
          </YStack>
        </XStack>

        <YStack
          pos="absolute"
          zi={0}
          h={browserHeight + 120}
          l={-1000}
          r={-1000}
          b={-75}
          ai="center"
          jc="center"
        >
          <XStack pos="absolute" t={0} l={0} r={0} bbw={1} boc="$color" opacity={0.1} />
          <YStack pos="relative" f={1} h="100%" w="100%">
            <YStack theme="darker" fullscreen className="mask-gradient-down" zi={-1}>
              <YStack fullscreen className="bg-grid" opacity={0.5} />
            </YStack>
          </YStack>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
})

const Marker = memo(({ name, active, onPress, ...props }: any) => {
  return (
    <YStack className="unselectable" theme={active ? 'pink' : null} pos="absolute" {...props}>
      <XStack pe="none" y={-50} ai="flex-start">
        <YStack w={1} h={70} bc="$colorHover" opacity={active ? 0.5 : 0.1} />
        <Button
          borderWidth={1}
          size="$4"
          circular
          pos="absolute"
          top={0}
          left={0}
          y={-20}
          x={-19}
          fontSize={12}
          onPress={() => {
            onPress(name)
          }}
        >
          {name}
        </Button>
      </XStack>
    </YStack>
  )
})

const Header = memo(() => {
  return (
    <YStack f={1} space="$3">
      <XStack>
        <HomeH2 als="flex-start">Responsive.</HomeH2>

        <Spacer size="$6" />

        <XStack jc="center" ai="center" $sm={{ display: 'none' }}>
          <IconStack als="center" theme="alt2" p="$3">
            <Monitor size={26} />
          </IconStack>
        </XStack>
      </XStack>

      <Paragraph maxWidth={450} size="$7" theme="alt2">
        Sharing responsive designs saves time, but hooks are verbose and expensive to run.
      </Paragraph>

      <Paragraph maxWidth={450} size="$5" theme="alt2">
        Tamagui compiles to CSS media queries and hoists dynamic media style outside the render.
      </Paragraph>
    </YStack>
  )
})

export const Safari = memo(
  ({ isSmall, shouldLoad }: { isSmall?: boolean; shouldLoad?: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
      <YStack
        className="unselectable"
        contain="paint"
        bc="$background"
        f={1}
        ov="hidden"
        elevation="$4"
        br="$4"
        boc="$borderColor"
        borderWidth={1}
        w="100%"
      >
        <YStack px="$4" jc="center" borderBottomWidth={0} h={50} bc="$background">
          <XStack pos="relative" ai="center" space="$4">
            <XStack space="$2">
              <Circle bc="$red10" size={10} />
              <Circle bc="$yellow10" size={10} />
              <Circle bc="$green10" size={10} />
            </XStack>

            {!isSmall && (
              <XStack space="$1">
                <ChevronLeft size={20} color="var(--color)" opacity={0.25} />
                <ChevronRight size={20} color="var(--color)" opacity={0.25} />
              </XStack>
            )}

            <XStack fullscreen ai="center">
              <XStack f={1} />
              {/* @ts-ignore */}
              <XStack
                h={30}
                f={2}
                br="$2"
                borderWidth={1}
                boc="$borderColor"
                bc="$backgroundPress"
                ai="center"
                px="$2"
                jc="center"
                space
              >
                <Lock color="var(--colorPress)" size={12} />
                <Paragraph theme="alt1" size="$2">
                  tamagui.dev
                </Paragraph>
              </XStack>
              <XStack f={1} />
            </XStack>
          </XStack>
        </YStack>

        <XStack>
          <Tab bc="var(--green7)" btlr={0}>
            Tamagui - React Native & Web UI kits
          </Tab>
          <Tab bc="var(--pink7)" active>
            Tamagui - React Native & Web UI kits
          </Tab>
          <Tab bc="var(--yellow7)" btrr={0}>
            Tamagui - React Native & Web UI kits
          </Tab>
        </XStack>

        <YStack bc="$background" h={browserHeight}>
          <YStack h="100%" pe="none" bc="$background">
            {!!shouldLoad && (
              <iframe
                style={{ display: isLoaded ? 'flex' : 'none' }}
                onLoad={() => {
                  setIsLoaded(true)
                }}
                width="100%"
                height={browserHeight}
                src="/responsive-demo"
              />
            )}
          </YStack>
        </YStack>
      </YStack>
    )
  }
)

const Tab = memo(({ active, children, bc, ...props }: any) => {
  return (
    <Theme name={active ? null : 'darker'}>
      <XStack
        btw={1}
        boc={active ? 'transparent' : '$borderColor'}
        blw={1}
        brw={1}
        bbw={1}
        bbc={active ? '$borderColorPress' : '$borderColor'}
        btlr={active ? 0 : 4}
        btrr={active ? 0 : 4}
        bc="$background"
        ov="hidden"
        f={1}
        py="$1"
        px="$2"
        ai="center"
        jc="center"
        {...props}
      >
        <Circle size={16} bc={bc}>
          <Image width={12} height={12} src={favicon.src} />
        </Circle>
        <Spacer size="$2" />
        <Paragraph cursor="default" size="$2" ellipse>
          {children}
        </Paragraph>
      </XStack>
    </Theme>
  )
})
