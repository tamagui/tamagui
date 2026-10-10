import { useEffect, useMemo, useRef } from 'react'
import { Pressable } from 'react-native'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { ScrollView, Text, View, type ThemeName } from 'tamagui'
import { AnimatedView } from '../AnimatedPrimitives'
import { useTheme } from './ChatContext'

const WIDTH = 100
const gap = 24

type Theme = {
  emoji: string
  theme: ThemeName
}

type ThemePicker = {
  themeColor: ThemeName
  setThemeColor: (color: ThemeName) => void
}

const themes: Theme[] = [
  {
    emoji: '🌙',
    theme: 'level2',
  },
  {
    emoji: '🐝',
    theme: 'blue',
  },
  {
    emoji: '🦋',
    theme: 'green',
  },
  {
    emoji: '🥑',
    theme: 'teal',
  },
  {
    emoji: '🌋',
    theme: 'red',
  },
]

const space = 6
const SELECTED_THEME_WIDTH = WIDTH + space * 2
const ASPECT_RATIO = 1 / 1.2

const SPRING_CONFIG = {
  damping: 18,
  mass: 0.5,
  stiffness: 180,
}

export const ThemePicker = () => {
  const { theme, setTheme } = useTheme()
  const x = useSharedValue(0)
  const ref = useRef<ScrollView>(null)

  const offset = useMemo(() => {
    const index = themes.findIndex((t) => t.theme === theme)

    return (index < 0 ? 0 : index) * (WIDTH + gap)
  }, [theme])

  useEffect(() => {
    x.value = withSpring(offset, SPRING_CONFIG)
    ref.current?.scrollTo({ x: offset / 2, y: 0, animated: true })
  }, [offset])

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
    }
  }, [x])

  return (
    <ScrollView
      ref={ref}
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{ gap, px: 18 }}
      py={space * 2}
      position="relative"
    >
      {themes.map((theme) => (
        <ThemeItem key={theme.theme} {...theme} setTheme={setTheme} />
      ))}
      <AnimatedView
        width={SELECTED_THEME_WIDTH}
        aspectRatio={ASPECT_RATIO}
        theme={theme}
        rounded="6"
        borderCurve="circular"
        borderColor="color-9"
        gap="3"
        l={18 - space}
        t={-space - 1}
        position="absolute"
        borderWidth={1.5}
        style={style}
      />
    </ScrollView>
  )
}

const ThemeItem = ({
  emoji,
  theme,
  setTheme,
}: Theme & { setTheme: (theme: ThemeName) => void }) => {
  return (
    <Pressable onPress={() => setTheme(theme)}>
      <View
        overflow="hidden"
        width={WIDTH}
        aspectRatio={ASPECT_RATIO}
        bg="background"
        rounded="4"
        p="2"
        gap="2"
        position="relative"
        theme={theme}
      >
        <View height="1" rounded="3" borderCurve="circular" bg="color-9" width="80%" />

        <View
          bg="color-3"
          height="1"
          rounded="3"
          width="60%"
          self="flex-end"
          borderCurve="circular"
        />

        <Text
          position="absolute"
          l={0}
          r={0}
          b="2"
          text="center"
          fontSize="8"
          fontWeight="bold"
        >
          {emoji}
        </Text>
      </View>
    </Pressable>
  )
}
