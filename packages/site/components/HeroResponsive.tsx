import { ChevronLeft, ChevronRight, Lock, MapPin, Monitor, Star } from '@tamagui/feather-icons'
import throttle from 'lodash.throttle'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  Button,
  Circle,
  H3,
  H4,
  H5,
  Image,
  LinearGradient,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
  isTouchable,
  useDebounce,
  useIsomorphicLayoutEffect,
  useMedia,
} from 'tamagui'

import { demoMedia } from '../constants/media'
import { useGet } from '../hooks/useGet'
import favicon from '../public/favicon.svg'
import { Container, ContainerLarge } from './Container'
import { HomeH2 } from './HomeH2'
import { IconStack } from './IconStack'
import { useOnIntersecting } from './useOnIntersecting'

const breakpoints = [
  { name: 'xs', at: demoMedia[0] },
  { name: 'sm', at: demoMedia[1] },
  { name: 'md', at: demoMedia[2] },
  { name: 'lg', at: demoMedia[3] },
]
const browserHeight = 445

export const HeroResponsive = memo(() => {
  const [bounding, setBounding] = useState<DOMRect | null>(null)
  const prevMove = useRef(0)
  const initialWidth = 420
  const [isDragging, setIsDragging] = useState(false)
  const [move, setMove] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const safariRef = useRef<HTMLElement | null>(null)
  const getState = useGet({ move, isDragging, bounding })
  const [sizeI, setSizeI] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const updateBoundings = useDebounce(() => {
    const rect = safariRef.current?.getBoundingClientRect() ?? null
    setBounding(rect)
  }, 350)

  useIsomorphicLayoutEffect(() => {
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

  const onMove = throttle((e: MouseEvent) => {
    const state = getState()
    if (!state.isDragging) return
    if (!state.bounding) {
      updateBoundings()
      return
    }
    if (!state.bounding) return
    setHasInteracted(true)
    const right = state.bounding.width + state.bounding.x
    const x = e.pageX - right
    const maxMove = breakpoints[breakpoints.length - 1].at - initialWidth + 120
    const nextMove = Math.min(maxMove, Math.max(0, x))
    const next = nextMove + (prevMove.current || 0)
    setMove(next)
    prevMove.current = 0
  }, 24)

  const stop = () => {
    prevMove.current = getState().move
    setIsDragging(false)
  }

  useOnIntersecting(
    ref,
    ({ isIntersecting, dispose }, didResize) => {
      dispose?.()
      if (!isIntersecting) return
      const node = safariRef.current
      if (!node) return
      if (didResize) {
        updateBoundings()
      }
      prevMove.current = getState().move - 10
      window.addEventListener('pointermove', onMove)
      return () => {
        onMove.cancel()
        dispose?.()
        window.removeEventListener('pointermove', onMove)
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

  const media = useMedia()
  const [smIndex, setSmIndex] = useState(0)
  const [width, setWidth] = useState(initialWidth)
  const isSmall = initialWidth + Math.max(0, move) < 680

  // ssr compat
  const nextWidth = media.sm ? breakpoints[smIndex].at : initialWidth + Math.max(0, move)
  useEffect(() => {
    setWidth(nextWidth)
  }, [nextWidth])

  const handleMarkerPress = useCallback((name) => {
    const next = (breakpoints.find((x) => x.name === name)?.at ?? 0) - initialWidth + 20
    setMove(next)
    prevMove.current = 0
  }, [])

  const scale = 0.8 - Math.min(0.25, smIndex * 0.18)

  return (
    <YStack ref={ref} y={0} mt={-150} pos="relative">
      <ContainerLarge pos="relative">
        <Header />
        <Spacer size="$6" />
        <YStack h={browserHeight + 80} />
        <XStack
          b={-20}
          pos="absolute"
          zi={1}
          f={1}
          space="$1"
          $sm={{
            scale,
            x: 150 - width / 2 - (smIndex ? (0.9 - scale) * 200 : 0),
            y: -40,
          }}
        >
          <YStack
            zi={2}
            className="unselectable"
            pe={isDragging ? 'none' : 'auto'}
            w={width}
            f={1}
            ref={safariRef}
            onPress={() => {
              if (isTouchable) {
                setHasInteracted(true)
                setSmIndex((i) => (i + 1) % breakpoints.length)
              }
            }}
          >
            <Safari shouldLoad={hasInteracted} isSmall={isSmall} />
          </YStack>

          <Container zi={1} pos="absolute">
            <XStack x={-10} $sm={{ display: 'none' }}>
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
            onPressIn={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsDragging(true)
            }}
            $sm={{
              display: 'none',
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
      <XStack y={-48} ai="flex-start">
        <YStack w={1} h={70} bc="$colorHover" opacity={active ? 0.2 : 0.05} />
        <Button
          accessibilityLabel={`Responsive size ${name}`}
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
        <HomeH2 als="flex-start">Responsive</HomeH2>

        <Spacer size="$6" />

        <XStack jc="center" ai="center" $sm={{ display: 'none' }}>
          <IconStack als="center" theme="alt2" p="$3">
            <Monitor size={26} />
          </IconStack>
        </XStack>
      </XStack>

      <Paragraph size="$7" theme="alt2">
        Responsive on Native & Web, without performance downside.
      </Paragraph>

      <Paragraph maxWidth={450} size="$5" theme="alt3">
        Tamagui compiles to hoisted CSS/StyleSheets, moving styles outside of render/runtime.
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
        elevation="$6"
        f={1}
        ov="hidden"
        br="$4"
        boc="$borderColor"
        borderWidth={1}
        w="100%"
      >
        <YStack bc="$background" px="$4" jc="center" borderBottomWidth={0} h={50}>
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

        <XStack bc="$background" mx={-2}>
          <Tab bc="var(--green7)" btlr={0}>
            Github
          </Tab>
          <Tab bc="var(--pink7)" active>
            Tamagui - React Native & Web UI kits
          </Tab>
          <Tab bc="var(--yellow7)" btrr={0}>
            @natebirdman
          </Tab>
        </XStack>

        <YStack pos="relative" bc="$backgroundStrong" h={browserHeight}>
          <YStack h="100%" pe="none">
            {shouldLoad && (
              <YStack
                fullscreen
                contain="paint"
                opacity={isLoaded ? 1 : 0}
                backgroundColor="$background"
                zIndex={10}
              >
                <iframe
                  title="Responsive demo"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onLoad={() => {
                    setTimeout(() => {
                      setIsLoaded(true)
                    }, 100)
                  }}
                  width="100%"
                  height={browserHeight}
                  src="/responsive-demo"
                />
              </YStack>
            )}

            <YStack zi={0} fullscreen p="$4">
              <XStack ai="center" jc="center" pos="relative" br="$6" ov="hidden">
                <YStack width={800} height={200}>
                  <LinearGradient o={0.1} fullscreen colors={['$yellow10', '$green10']} />
                </YStack>
                <YStack p="$4" pos="absolute" fullscreen f={1}>
                  <YStack f={1} />
                  <XStack>
                    <YStack f={1}>
                      <Spacer $gtSmall={{ display: 'none' }} flex />
                      <H3>Enchanting Garden</H3>
                      <XStack ai="center" space>
                        <MapPin size={12} color="var(--color)" />
                        <H5>Kailua, HI</H5>
                      </XStack>
                    </YStack>
                    <YStack ai="flex-end">
                      <Spacer flex $gtSmall={{ display: 'none' }} />
                      <H4>$45</H4>
                      <Paragraph>/night</Paragraph>
                    </YStack>
                  </XStack>
                </YStack>
              </XStack>

              <Spacer />

              <YStack px="$4">
                <XStack>
                  <XStack ai="center" space>
                    <Paragraph theme="alt2">4 guests</Paragraph>
                    <Paragraph theme="alt2">&middot;</Paragraph>
                    <Paragraph theme="alt2">Entire house</Paragraph>
                  </XStack>
                  <Spacer flex={1} />
                  <XStack ai="center" space>
                    <Star size={20} color="var(--purple10)" />
                    <Paragraph theme="purple_alt2">4.55</Paragraph>
                  </XStack>
                </XStack>

                <Spacer />

                <Paragraph theme="alt1" size="$4">
                  A lovely, private and very clean cottage with all amenities for a comfortable and
                  peaceful stay. We are a 20 minute walk from the Hawaii Tropical Botanical Garden
                  and well situated for touring to Akaka Falls, Volcano National Park, and many
                  other destinations.
                </Paragraph>
              </YStack>
            </YStack>
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
        w="33.33%"
        blw={1}
        brw={1}
        bbw={1}
        bbc={active ? '$borderColor' : 'transparent'}
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
        <Paragraph o={active ? 1 : 0.5} cursor="default" size="$1" ellipse>
          {children}
        </Paragraph>
      </XStack>
    </Theme>
  )
})
