import { useIsIntersecting } from '@tamagui/demos'
import { tints } from '@tamagui/logo'
import { useThemeSetting } from '@tamagui/next-theme'
import { SetStateAction, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Theme,
  ThemeName,
  XGroup,
  XStack,
  YStack,
  debounce,
  useDebounce,
  useEvent,
  useGet,
} from 'tamagui'

import { ActiveCircle } from './ActiveCircle'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'
import { MediaPlayer } from './MediaPlayer'
import { setTintIndex } from './useTint'

const themes: (ThemeName | null)[][] = [tints, [null, 'alt1', 'alt2']]

const themeCombos: string[] = []
for (let i = 0; i < themes[0].length; i++) {
  for (let j = 0; j < themes[1].length; j++) {
    const parts = [themes[0][i], themes[1][j]].filter(Boolean)
    themeCombos.push(parts.join('_'))
  }
}

const max = themes[1].length

const flatToSplit = (i: number) => {
  const colorI = Math.floor(i / max)
  const shadeI = i % max
  return [colorI, shadeI]
}

const splitToFlat = ([a, b]: number[]) => {
  return a * 4 + b
}

export function HeroExampleThemes() {
  return (
    <Theme debug name="purple">
      <MediaPlayer elevation="$3" alt={2} />
      {/* <MediaPlayer elevation="$3" /> */}
    </Theme>
  )

  const themeSetting = useThemeSetting()

  const [activeI, setActiveI] = useState([0, 0])
  const activeIndex = splitToFlat(activeI)

  const [curColorI, curShadeI] = activeI
  const [theme, setSelTheme] = useState('')
  const colorName = themes[0][curColorI]
  const scrollView = useRef<HTMLElement | null>(null)
  const [scrollLock, setScrollLock] = useState<null | 'shouldAnimate' | 'animate' | 'scroll'>(null)
  const getLock = useGet(scrollLock)
  const setTintIndexDebounce = useDebounce(setTintIndex, 100)

  const updateActiveI = (to: SetStateAction<number[]>) => {
    setScrollLock('shouldAnimate')
    setActiveI(to)
  }

  const isIntersecting = useIsIntersecting(scrollView, {
    threshold: 0.2,
  })

  const tintIndex = Math.floor(activeIndex / 4)
  useEffect(() => {
    if (isIntersecting) {
      setTintIndexDebounce(tintIndex)
    }
  }, [isIntersecting, setTintIndexDebounce, tintIndex])

  const move = (dir = 0) => {
    updateActiveI((prev) => {
      const next = Math.min(Math.max(0, splitToFlat(prev) + dir), themeCombos.length - 1)
      const nextSplit = flatToSplit(next)
      return nextSplit
    })
  }

  const moveToIndex = (index: number) => {
    updateActiveI(flatToSplit(index))
  }

  const width = 110
  const scale = 0.5

  const scrollToIndex = useEvent((index: number, force = false) => {
    const node = scrollView.current
    const lock = getLock()
    const isReadyToAnimate = lock === 'shouldAnimate'
    const isForced = force && (isReadyToAnimate || lock === null)
    const shouldPrevent = !isReadyToAnimate && !isForced
    if (!node || shouldPrevent) return
    const left = width * index + width / 2
    if (node.scrollLeft === left) return
    node.scrollTo({ left, top: 0, behavior: 'smooth' })
  })

  useEffect(() => {
    if (scrollLock !== 'shouldAnimate') return
    scrollToIndex(activeIndex)
  }, [activeIndex, scrollLock, scrollToIndex])

  if (typeof document !== 'undefined') {
    // scroll lock unset
    useLayoutEffect(() => {
      const node = scrollView.current
      if (!node) return
      const listener = debounce(() => {
        setScrollLock(null)
      }, 200)
      node.addEventListener('scroll', listener, { passive: true })
      return () => {
        node.removeEventListener('scroll', listener)
      }
    }, [])
  }

  // arrow keys
  useEffect(() => {
    if (!isIntersecting) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        move(1)
      }
      if (e.key === 'ArrowLeft') {
        move(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting])

  const moveToIndexDbc = useDebounce(moveToIndex, 100)

  useEffect(() => {
    if (!isIntersecting) return
    // @ts-ignore
    return onChangeTint((index: nunber) => {
      moveToIndexDbc(index * 3)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting])

  useEffect(() => {
    if (typeof themeSetting.current === 'boolean') return
    setSelTheme(
      themeSetting.current === 'system'
        ? themeSetting.systemTheme || 'light'
        : themeSetting.current || 'light'
    )
  }, [themeSetting])

  return (
    <YStack pos="relative">
      {useMemo(() => {
        return (
          <ContainerLarge position="relative" space="$3">
            <HomeH2>
              A <span className="rainbow clip-text">colorful</span> revolution
            </HomeH2>
            <HomeH3>
              Fully typed themes with nested sub-themes and component themes, all compiled to CSS
              that avoids rendering.
            </HomeH3>
          </ContainerLarge>
        )
      }, [])}

      <YStack my="$8" ai="center" jc="center">
        <XStack className="scroll-horizontal no-scrollbar">
          <XStack px="$4" space="$2">
            <XGroup disablePassBorderRadius bordered p="$2" br="$10" als="center">
              {(['light', 'dark'] as const).map((name, i) => {
                const isActive = theme === name
                return (
                  <ActiveCircle
                    key={name}
                    backgroundColor={name === 'dark' ? '#000' : '#fff'}
                    onPress={() => themeSetting.set(name)}
                    isActive={isActive}
                  />
                )
              })}
            </XGroup>

            <XGroup disablePassBorderRadius bordered p="$2" br="$10" als="center">
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
            </XGroup>

            <XGroup disablePassBorderRadius bordered p="$2" br="$10" als="center">
              <Theme name={colorName}>
                <XStack>
                  {themes[1].map((name, i) => {
                    const isActive = curShadeI === i
                    return (
                      <ActiveCircle
                        onPress={() => updateActiveI([curColorI, i])}
                        key={i}
                        isActive={isActive}
                        opacity={1.2 - (4 - i) / 4}
                        backgroundColor="$colorHover"
                      />
                    )
                  })}
                </XStack>
              </Theme>
            </XGroup>
          </XStack>
        </XStack>

        <YStack
          py="$6"
          my="$3"
          ov="hidden"
          w="100%"
          pos="relative"
          pointerEvents={scrollLock === 'animate' ? 'none' : 'auto'}
          maxWidth={1400}
        >
          <YStack fullscreen pe="none" zIndex={1000000000} className="themes-fader" />
          <XStack
            className="scroll-horizontal no-scrollbar"
            ref={scrollView}
            onScroll={(e: any) => {
              if (scrollLock === 'animate' || scrollLock === 'shouldAnimate') {
                return
              }
              const scrollX = Math.max(0, e.target.scrollLeft)
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
              space="$6"
              pos="relative"
              px={`calc(50vw + 30px)`}
              x={-45 - 30}
            >
              {useMemo(() => {
                return themeCombos.map((name, i) => {
                  const [colorI, shadeI] = flatToSplit(i)
                  const [color, alt] = name.split('_')
                  return (
                    <XStack
                      key={i}
                      width={width}
                      scale={scale}
                      className="all ease ms100"
                      cursor="pointer"
                      hoverStyle={{
                        scale: scale + 0.025,
                      }}
                      $xs={{
                        scale: scale * 0.8,
                      }}
                      onPress={() => {
                        updateActiveI([colorI, shadeI])
                      }}
                    >
                      <Theme name={color as any}>
                        <MediaPlayer
                          elevation="$3"
                          // shac="rgba(0,0,0,0.15)"
                          pointerEvents="none"
                          alt={alt ? +alt.replace('alt', '') : null}
                        />
                      </Theme>
                    </XStack>
                  )
                })
              }, [])}
            </XStack>
          </XStack>

          <YStack pe="none" fullscreen ai="center" jc="center" $xs={{ scale: 0.8 }}>
            <Theme name={colorName}>
              <MediaPlayer
                elevation="$3"
                // shac="rgba(0,0,0,0.15)"
                pointerEvents="none"
                pointerEventsControls="auto"
                alt={curShadeI}
              />
            </Theme>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
