// debug-verbose
// import './wdyr'

import { memo, useState } from 'react'
import { View } from 'react-native'
import {
  AnimatePresence,
  Button,
  Stack,
  Text,
  XStack,
  XStackProps,
  styled,
} from 'tamagui'

const AnimatedNumbers = () => {
  const [numbers, setNumbers] = useState(10_000)

  return (
    <>
      <Button onPress={() => setNumbers(Math.round(Math.random() * 10_000))}>Next</Button>

      <Stack importantForAccessibility="auto" />

      <AnimatePresence enterVariant="fromTop" exitVariant="toBottom">
        {`${numbers}`.split('').map((num, i) => {
          return <AnimatedNumber key={`${num}${i}`}>{num}2</AnimatedNumber>
        })}
      </AnimatePresence>
    </>
  )
}

const AnimatedNumber = styled(Text, {
  fontSize: 20,
  color: '$color',

  variants: {
    fromTop: {
      true: {
        y: -10,
        o: 0,
      },
    },

    toBottom: {
      true: {
        y: 10,
        o: 0,
      },
    },
  } as const,
})

export const Sandbox = () => {
  const [disabled, setDisabled] = useState(true)

  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <ThemeTestSquare theme="yellow">
          <ThemeTestSquare theme="green">
            <ThemeTestSquare theme="alt1">
              <ThemeTestSquare bc="$color10" />
              <ThemeTestSquare animation="bouncy" bc="$color10" />
            </ThemeTestSquare>
          </ThemeTestSquare>
        </ThemeTestSquare>
      </>
    </View>
  )
}

const ThemeTestSquare = memo(({ children, ...props }: XStackProps) => {
  const [theme, setTheme] = useState(props.theme)

  return (
    <XStack
      width="80%"
      height="50%"
      bc="$color5"
      {...props}
      theme={theme}
      onPress={(e) => {
        setTheme(theme === 'red' ? props.theme : 'red')
        e.stopPropagation()
      }}
    >
      {children}
    </XStack>
  )
})
