import { useTheme } from '@components/NextTheme'
import Link from 'next/link'
import { SetStateAction, memo, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  H2,
  H3,
  InteractiveContainer,
  Theme,
  ThemeName,
  XStack,
  YStack,
  debounce,
  useDebounceValue,
} from 'tamagui'

import { useGet } from '../hooks/useGet'
import { ActiveCircle } from './ActiveCircle'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { MediaPlayer } from './MediaPlayer'

const themes: (ThemeName | null)[][] = [
  ['orange', 'red', 'pink', null, 'green', 'teal', 'blue'],
  [null, 'alt1', 'alt2', 'alt3'],
]

const themeCombos: string[] = []
for (let i = 0; i < themes[0].length; i++) {
  for (let j = 0; j < themes[1].length; j++) {
    const parts = [themes[0][i], themes[1][j]].filter(Boolean)
    themeCombos.push(parts.join('_'))
  }
}

const flatToSplit = (i: number) => {
  const colorI = Math.floor(i / 4)
  const shadeI = i % 4
  return [colorI, shadeI]
}

const splitToFlat = ([a, b]: number[]) => {
  return a * 4 + b
}

export function HeroExampleThemes() {
  const { setTheme, theme: userTheme } = useTheme()
  const [activeI, setActiveI] = useState([0, 0])
  const [curColorI, curShadeI] = activeI
  const [theme, setSelTheme] = useState('')
  const nextIndex = splitToFlat(activeI)
  const curIndex = useDebounceValue(nextIndex, 300)
  // const isTransitioning = curIndex !== nextIndex
  // const isMidTransition = useDebounceValue(isTransitioning, 150)
  // const altName = themes[1][curShadeI]
  const colorName = themes[0][curColorI]
  const scrollView = useRef<HTMLElement | null>(null)
  const [scrollLock, setScrollLock] = useState<null | 'shouldAnimate' | 'animate' | 'scroll'>(null)
  const getLock = useGet(scrollLock)

  const updateActiveI = (to: SetStateAction<number[]>) => {
    setScrollLock('shouldAnimate')
    setActiveI(to)
  }

  const move = (dir = 0) => {
    updateActiveI((prev) => {
      const next = Math.min(Math.max(0, splitToFlat(prev) + dir), themeCombos.length - 1)
      const nextSplit = flatToSplit(next)
      return nextSplit
    })
  }

  const width = 180
  const scale = 0.6

  useEffect(() => {
    if (scrollLock !== 'shouldAnimate') return
    const node = scrollView.current
    if (!node) return
    const x = (width + 30) * nextIndex + width / 2 + 30
    if (node.scrollLeft === x) return
    setScrollLock('animate')
    // @ts-ignore
    node.scrollTo({ x, y: 0 })
  }, [nextIndex, scrollLock])

  // const onScroll = useMemo(
  //   () =>
  //     throttle(
  //       ({ percent }) => {
  //         if (getLock() !== null) return
  //         const node = scrollView.current
  //         if (!node) return
  //         const x = 20 * percent
  //         // @ts-ignore
  //         node.scrollTo(0, x, false)
  //       },
  //       10,
  //       {
  //         leading: true,
  //       }
  //     ),
  //   []
  // )

  // useScrollPosition({
  //   ref: scrollView,
  //   onScroll,
  // })

  // scroll lock unset
  useEffect(() => {
    const node = scrollView.current
    if (!node) return
    const listener = debounce(() => {
      setScrollLock(null)
    }, 200)
    node.addEventListener('scroll', listener)
    return () => {
      node.removeEventListener('scroll', listener)
    }
  }, [])

  // arrow keys
  useEffect(() => {
    const node = scrollView.current
    if (!node) return
    // only when carousel is fully in viewport
    let dispose: Function | null = null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        move(1)
      }
      if (e.key === 'ArrowLeft') {
        move(-1)
      }
    }

    const io = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          window.addEventListener('keydown', onKey)
          dispose = () => {
            window.removeEventListener('keydown', onKey)
          }
        } else {
          dispose?.()
        }
      },
      {
        threshold: 1,
      }
    )

    io.observe(node)

    return () => {
      dispose?.()
      io.disconnect()
    }
  }, [scrollView.current])

  useEffect(() => {
    setSelTheme(userTheme as any)
  }, [userTheme])

  const scrollContents = useMemo(() => {
    return themeCombos.map((name, i) => {
      const isCurActive = curIndex === i
      const isNextActive = nextIndex === i
      // const isActive = isMidTransition ? isNextActive : isCurActive
      // const isBeforeActive = i < curIndex
      const [colorI, shadeI] = flatToSplit(i)
      // const isActiveGroup = colorI === curColorI
      const [color, alt] = name.split('_')
      return (
        <XStack key={i} width={width}>
          <XStack
            // zi={(isActive ? 1000 : isBeforeActive ? i : 1000 - i) + (isActiveGroup ? 1000 : 0)}
            // pos="absolute"
            // x={
            //   i * offset + 0 // (isActiveGroup ? (isBeforeActive ? -1 : 0) * 20 * i : 0)
            //   // (!isTransitioning && isActiveGroup ? offsetActive * shadeI : 0)
            // }
            // scale={isTransitioning ? 0.6 : 1 + (isActiveGroup ? -0.1 : -0.5) + (isActive ? 0.1 : 0)}
            // mx={-scale * 180}
            scale={scale}
            cursor="pointer"
            className="transition-test"
            hoverStyle={{
              scale: scale + 0.025,
            }}
            onPress={() => {
              updateActiveI([colorI, shadeI])
            }}
          >
            <Theme name={color as any}>
              <MediaPlayer pointerEvents="none" alt={alt ? +alt.replace('alt', '') : 0} />
            </Theme>
          </XStack>
        </XStack>
      )
    })
  }, [])

  const titleElements = useMemo(() => {
    return (
      <ContainerLarge space="$3" position="relative">
        <YStack zi={1} space="$2">
          <H2 als="center">Truly flexible themes</H2>
          <H3 ta="center" theme="alt2" als="center" fow="400">
            Unlimited sub-themes, down to the component
          </H3>
        </YStack>
      </ContainerLarge>
    )
  }, [])

  return (
    <YStack>
      {titleElements}

      <YStack mt="$3" ai="center" jc="center" space="$6">
        <ScrollView style={{ maxWidth: '100%' }} horizontal showsHorizontalScrollIndicator={false}>
          <XStack px="$4" space="$4">
            <InteractiveContainer p="$1" br="$10" als="center" space="$1">
              {['light', 'dark'].map((name, i) => {
                const selected = i === 0 ? 'light' : 'dark'
                const isActive = theme === selected
                return (
                  <Theme key={name} name={selected}>
                    <ActiveCircle onPress={() => setTheme(selected)} isActive={isActive} />
                  </Theme>
                )
              })}
            </InteractiveContainer>

            <InteractiveContainer p="$1" br="$10" als="center" space="$1">
              {themes[0].map((color, i) => {
                const isActive = curColorI === i
                return (
                  <Theme key={color} name={color}>
                    <ActiveCircle
                      onPress={() => updateActiveI([i, curShadeI])}
                      isActive={isActive}
                      backgroundColor="$colorMid"
                    />
                  </Theme>
                )
              })}
            </InteractiveContainer>

            <InteractiveContainer p="$1" br="$10" als="center">
              <Theme name={colorName}>
                <XStack space="$1">
                  {themes[1].map((name, i) => {
                    const isActive = curShadeI === i
                    return (
                      <ActiveCircle
                        onPress={() => updateActiveI([curColorI, i])}
                        key={i}
                        isActive={isActive}
                        opacity={1.2 - (4 - i) / 4}
                        backgroundColor="$colorHover"
                        // backgroundColor={i == 0 ? 'transparent' : `rgba(150,150,150,${)`}
                      />
                    )
                  })}
                </XStack>
              </Theme>
            </InteractiveContainer>
          </XStack>
        </ScrollView>

        <YStack
          mt={-20}
          py="$7"
          ov="hidden"
          w="100%"
          pos="relative"
          pointerEvents={scrollLock === 'animate' ? 'none' : 'auto'}
        >
          <ScrollView
            style={{ width: '100%', overflow: 'hidden' }}
            horizontal
            showsHorizontalScrollIndicator={false}
            // @ts-ignore
            ref={scrollView}
            scrollEventThrottle={16}
            onScroll={(e) => {
              if (scrollLock === 'animate' || scrollLock === 'shouldAnimate') {
                return
              }
              const scrollX = Math.max(0, e.nativeEvent.contentOffset.x)
              const itemI = Math.min(Math.floor(scrollX / (width + 30)), themeCombos.length - 1)
              const [n1, n2] = flatToSplit(itemI)
              const [c1, c2] = activeI
              if (n1 !== c1 || n2 !== c2) {
                setScrollLock('scroll')
                setActiveI([n1, n2])
              }
            }}
          >
            <XStack
              ai="center"
              jc="center"
              // x={offsetX}
              // className="transition-test"
              space="$6"
              pos="relative"
              px={`calc(50vw + 30px)`}
              x={-45 - 30}
            >
              {scrollContents}
            </XStack>
          </ScrollView>

          <YStack pe="none" fullscreen ai="center" jc="center" $sm={{ scale: 0.85 }}>
            <Theme name={colorName}>
              <MediaPlayer pointerEvents="none" pointerEventsControls="auto" alt={curShadeI} />
            </Theme>
          </YStack>
        </YStack>

        <Theme name={colorName}>
          {/* <CodeInline my="$2" br="$3" size="$5"> */}
          {/* causing ssr issues */}
          {/* {theme} */}
          {/* {colorName ? `_${colorName}` : ''} */}
          {/* {altName ? `_${altName}` : ''} */}
          {/* {hoverSectionName ? `_${hoverSectionName}` : ''} */}
          {/* </CodeInline> */}
        </Theme>
      </YStack>

      <Bottom />
    </YStack>
  )
}

const Bottom = memo(() => {
  const { tint } = useTint()

  return (
    <ContainerLarge space="$3" position="relative">
      <YStack mt="$3" ai="center" als="center" maxWidth={480} space="$2">
        <Link href="/docs/intro/themes" passHref>
          <Button theme={tint} tag="a">
            Learn how themes work &raquo;
          </Button>
        </Link>
      </YStack>
    </ContainerLarge>
  )
})
