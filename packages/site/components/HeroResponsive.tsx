import { ChevronLeft, ChevronRight, Lock, Monitor } from '@tamagui/feather-icons'
import throttle from 'lodash.throttle'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Circle, Image, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'

import { useGet } from '../hooks/useGet'
import favicon from '../public/favicon.svg'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { Glow } from './Glow'
import { HomeH2 } from './HomeH2'
import { IconStack } from './IconStack'
import { useOnIntersecting } from './useOnIntersecting'

let bounding: DOMRect | null = null
let prevMove = 0
const breakpoints = [
  { name: 'xs', at: 660 },
  { name: 'sm', at: 800 },
  { name: 'md', at: 1020 },
]
const browserHeight = 445

export const HeroResponsive = memo(() => {
  const [isDragging, setIsDragging] = useState(false)
  const [move, setMove] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const safariRef = useRef<HTMLElement | null>(null)
  const getMove = useGet(move)
  const getIsDragging = useGet(isDragging)
  const [sizeI, setSizeI] = useState(0)

  function updateBoundings() {
    bounding = safariRef.current?.getBoundingClientRect() ?? null
  }

  useOnIntersecting(ref, ({ isIntersecting, dispose }, didResize) => {
    dispose?.()
    if (!isIntersecting) return
    const node = safariRef.current
    if (!node) return
    if (didResize) {
      updateBoundings()
    }
    prevMove = getMove()
    const onMove = throttle((e: MouseEvent) => {
      if (!getIsDragging() || !bounding) return
      const right = bounding.width + bounding.x
      const x = e.pageX - right
      // console.log('wut is', { x, right, px: e.pageX, bw: bounding.width, bx: bounding.x })
      const move = Math.min(600, Math.max(0, x))
      const next = move + (prevMove || 0)
      const width = bounding.width + x
      setMove(next)
      prevMove = 0
      if (width) {
        const nextSizeI =
          width > breakpoints[2].at
            ? 3
            : width > breakpoints[1].at
            ? 2
            : width > breakpoints[0].at
            ? 1
            : 0
        setSizeI(nextSizeI)
      }
    }, 16)
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
    }
  })

  useEffect(() => {
    const handler = (_e: MouseEvent) => {
      prevMove = getMove()
      setIsDragging(false)
    }
    window.addEventListener('mouseup', handler)
    return () => {
      window.removeEventListener('mouseup', handler)
    }
  }, [])

  const width = `calc(500px + ${move}px)`
  const isSmall = 500 + move < 680
  const { tint } = useTint()

  const handleMarkerPress = useCallback((name) => {
    // todo animate to width
  }, [])

  return (
    <YStack y={0} my="$-12" py="$12" pos="relative">
      <ContainerLarge pos="relative">
        <Header />

        <Spacer size="$8" />
        <div ref={ref} />

        <XStack zi={1} f={1} space>
          <YStack
            className="unselectable"
            pe={isDragging ? 'none' : 'auto'}
            // w="100%"
            maw={width}
            f={1}
            ref={safariRef}
            theme={tint}
          >
            <Safari isSmall={isSmall} />
          </YStack>

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
              height={34}
            />
          </YStack>
        </XStack>

        <YStack pos="absolute" zi={0} t={220} l={-1000} r={-1000} b={-75} ai="center" jc="center">
          <XStack pos="absolute" t={0} l={0} r={0} bbw={1} boc="$color" opacity={0.2} />

          <YStack pos="relative" f={1} h="100%" w="100%">
            <YStack fullscreen className="bg-grid mask-gradient-down" zi={-1} />
            <ContainerLarge pos="relative">
              <YStack zi={-1} pe="none" pos="absolute" top={-100} right={0}>
                <Glow />
              </YStack>
              <XStack>
                <Marker
                  onPress={handleMarkerPress}
                  active={sizeI > 0}
                  name={breakpoints[0].name}
                  l={breakpoints[0].at}
                />
                <Marker
                  onPress={handleMarkerPress}
                  active={sizeI > 1}
                  name={breakpoints[1].name}
                  l={breakpoints[1].at}
                />
                <Marker
                  onPress={handleMarkerPress}
                  active={sizeI > 2}
                  name={breakpoints[2].name}
                  l={breakpoints[2].at}
                />
              </XStack>
            </ContainerLarge>
          </YStack>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
})

const Marker = memo(({ name, active, onPress, ...props }: any) => {
  return (
    <Theme className="unselectable" name={active ? 'blue' : null}>
      <YStack pos="absolute" l={800} {...props}>
        <XStack pe="none" y={-80} ai="flex-start" space>
          <YStack w={1} h={80} bc="$colorHover" opacity={active ? 0.5 : 0.2} />
          <Button
            borderWidth={1}
            size="$3"
            onPress={() => {
              onPress(name)
            }}
          >
            {name}
          </Button>
        </XStack>
      </YStack>
    </Theme>
  )
})

const Header = memo(() => {
  return (
    <XStack f={1}>
      <XStack $sm={{ display: 'none' }}>
        <IconStack y={-10} theme="green_alt2" p="$4">
          <Monitor size={20} />
        </IconStack>
        <Spacer size="$6" />
      </XStack>

      <YStack f={1} space="$2">
        <HomeH2 als="flex-start">Responsive, done right</HomeH2>
        <Paragraph maxWidth={500} size="$5" theme="alt2">
          Sharing responsive designs between web and native saves time, but hooks are slow to write,
          and run.
        </Paragraph>

        <Paragraph maxWidth={500} size="$5" theme="alt2">
          Tamagui styles and hooks compile away to efficient CSS media queries, or hoist to
          StyleSheet.create on native.
        </Paragraph>
      </YStack>
    </XStack>
  )
})

const Safari = memo(({ isSmall }: { isSmall: boolean }) => {
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
        <Tab btlr={0}>Tamagui - React Native & Web UI kits</Tab>
        <Tab active>Tamagui - React Native & Web UI kits</Tab>
        <Tab btrr={0}>Tamagui - React Native & Web UI kits</Tab>
      </XStack>

      <YStack bc="$background" h={browserHeight}>
        <BrowserPane />
      </YStack>
    </YStack>
  )
})

const Tab = memo(({ active, children, ...props }: any) => {
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
        py="$0.5"
        px="$2"
        ai="center"
        {...props}
      >
        <Image width={16} height={16} src={favicon} />
        <Spacer size="$2" />
        <Paragraph cursor="default" size="$2" ellipse>
          {children}
        </Paragraph>
      </XStack>
    </Theme>
  )
})

const BrowserPane = memo(() => {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  if (typeof document !== 'undefined') {
    // only load iframe after scroll + timeout
    useEffect(() => {
      let tm

      if (window.scrollY > 800) {
        tm = setTimeout(() => {
          setIsMounted(true)
        }, 30)
        return
      }

      const onScroll = () => {
        window.removeEventListener('scroll', onScroll)
        tm = setTimeout(() => {
          setIsMounted(true)
        }, 30)
      }

      window.addEventListener('scroll', onScroll)
      return () => {
        clearTimeout(tm)
        window.removeEventListener('scroll', onScroll)
      }
    }, [])
  }

  return (
    <YStack h="100%" pe="none" bc="$background">
      {!!isMounted && (
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
  )
})
