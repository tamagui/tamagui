import { useTheme } from '@components/NextTheme'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  useDebounceValue,
} from 'tamagui'

import { ActiveCircle } from './ActiveCircle'
import { CodeInline } from './Code'
import { ContainerLarge } from './Container'
import { MediaPlayer } from './MediaPlayer'

export function HeroExampleCarousel() {
  return (
    <YStack>
      <ContainerLarge space="$3" position="relative">
        <YStack zi={1} space="$2">
          <H2 als="center">Truly flexible themes</H2>
          <H3 ta="center" theme="alt2" als="center" fow="400">
            Unlimited sub-themes, down to the component
          </H3>
        </YStack>

        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
        <MediaPlayerDemoStack />
        {/* </ScrollView> */}

        <YStack mt="$3" ai="center" als="center" maxWidth={480} space="$2">
          {/* <H4 size="$8">Nest sub-themes infinitely</H4> */}
          {/* 
          <Paragraph mb="$3" ta="center" size="$5">
            Dark, light, or [insert yours].
            <br />
            Sprinkle a few <span className="rainbow">color alts</span> for each.
            <br />
            For each color, a <Text o={0.66}>few</Text> <Text o={0.5}>different</Text>{' '}
            <Text o={0.33}>shades</Text>.
            <br />
            For each of those a custom <CodeInline size="$4">&lt;Button /&gt;</CodeInline>.
          </Paragraph> */}

          <Link href="/docs/intro/themes" passHref>
            <Button theme="blue" tag="a">
              Learn how themes work &raquo;
            </Button>
          </Link>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
}

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

const MediaPlayerDemoStack = () => {
  const { setTheme, theme: userTheme } = useTheme()
  const [activeI, setActiveI] = useState([0, 0])
  const [curColorI, curShadeI] = activeI
  const [theme, setSelTheme] = useState('')
  const nextIndex = activeI[0] * (themes[0].length - 2) + activeI[1]
  const curIndex = useDebounceValue(nextIndex, 300)
  const isTransitioning = curIndex !== nextIndex
  const isMidTransition = useDebounceValue(isTransitioning, 150)

  // arrow keys
  useEffect(() => {
    //
  }, [])

  useEffect(() => {
    setSelTheme(userTheme as any)
  }, [userTheme])

  const offset = 30
  const offsetActive = 20
  const offsetTransition = 200
  const offsetX = -nextIndex * (isTransitioning ? offsetTransition : offset)

  const mediaPlayersRow = (
    <XStack
      ai="center"
      jc="center"
      // x={offsetX}
      className="transition-test"
      space="$6"
      pos="relative"
      height={220}
    >
      {themeCombos.map((name, i) => {
        const isCurActive = curIndex === i
        const isNextActive = nextIndex === i
        const isActive = isMidTransition ? isNextActive : isCurActive
        const isBeforeActive = i < curIndex
        const colorI = Math.floor(i / 4)
        const shadeI = i % 4
        const isActiveGroup = colorI === curColorI
        const [color, alt] = name.split('_')
        return (
          <XStack
            key={i}
            className="transition-test"
            zi={(isActive ? 1000 : isBeforeActive ? i : 1000 - i) + (isActiveGroup ? 1000 : 0)}
            pos="absolute"
            x={
              i * offset +
              0 + // (isActiveGroup ? (isBeforeActive ? -1 : 0) * 20 * i : 0)
              (!isTransitioning && isActiveGroup ? offsetActive * shadeI : 0)
            }
            scale={isTransitioning ? 0.6 : 1 + (isActiveGroup ? -0.1 : -0.5) + (isActive ? 0.1 : 0)}
            onPress={() => {
              setActiveI([colorI, shadeI])
            }}
          >
            <Theme name={color as any}>
              <MediaPlayer alt={alt ? +alt.replace('alt', '') : 0} />
            </Theme>
          </XStack>
        )
      })}
    </XStack>
  )

  return (
    <YStack ai="center" jc="center" space="$6">
      <ScrollView
        style={{ maxWidth: 'calc(100% + 40px)', marginHorizontal: -20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
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
                    onPress={() => setActiveI((x) => [i, x[1]])}
                    isActive={isActive}
                    backgroundColor="$colorMid"
                  />
                </Theme>
              )
            })}
          </InteractiveContainer>

          <InteractiveContainer p="$1" br="$10" als="center" space="$1">
            {themes[1].map((name, i) => {
              const isActive = curShadeI === i
              return (
                <ActiveCircle
                  onPress={() => setActiveI((x) => [x[0], i])}
                  key={i}
                  isActive={isActive}
                  backgroundColor={i == 0 ? 'transparent' : `rgba(150,150,150,${1 - (4 - i) / 4})`}
                />
              )
            })}
          </InteractiveContainer>
        </XStack>
      </ScrollView>

      {mediaPlayersRow}

      <Theme name="green">
        <CodeInline my="$2" br="$3" size="$6">
          {/* {theme}_{colorName}_{altName}
          {hoverSectionName ? `_${hoverSectionName}` : ''} */}
        </CodeInline>
      </Theme>
    </YStack>
  )
}
