import { ThemeProvider, createBox, createTheme } from '@shopify/restyle'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Stack, Text, XStack, YStack, styled } from 'tamagui'

import { TimedRender } from '../components/TimedRender'

export const Benchmark = () => {
  return (
    <>
      <BenchmarkOne name="rn" />
      <BenchmarkOne name="tama" />
      <BenchmarkOne name="restyle" />
    </>
  )
}

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A906E',

  black: '#0B0B0B',
  white: '#F0F2F3',
}

const theme = createTheme({
  colors: {
    red: 'red',
    mainBackground: palette.white,
    cardPrimaryBackground: palette.purplePrimary,
  },
  spacing: {
    s: 5,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
})

const Box = createBox<any>()

const StyledStack = styled(Stack, {
  borderColor: 'red',
  borderWidth: 2,
  padding: 5,
})

const BenchmarkOne = ({ name }) => {
  const [x, setX] = useState(0)

  return (
    <>
      <Text style={{ marginTop: 20 }}>{name}</Text>
      <Button onPress={() => setX(Math.random())}>Go</Button>
      <YStack ov="hidden">
        {name === 'rn' && (
          <XStack>
            <BenchRN key={x} />
          </XStack>
        )}
        {name === 'restyle' && (
          <XStack>
            <ThemeProvider theme={theme}>
              <BenchRestyle key={x} />
            </ThemeProvider>
          </XStack>
        )}
        {name === 'tama' && (
          <XStack>
            <BenchTama key={x} />
          </XStack>
        )}
      </YStack>
    </>
  )
}

const BenchTama = () => {
  return (
    <TimedRender>
      {new Array(1000).fill(0).map((_, i) => (
        <StyledStack key={i} />
      ))}
    </TimedRender>
  )
}

const BenchRestyle = () => {
  return (
    <TimedRender>
      {new Array(1000).fill(0).map((_, i) => (
        <Box borderColor="red" borderWidth={2} padding="s" key={i} />
      ))}
    </TimedRender>
  )
}

const styles = StyleSheet.create({
  style: {
    borderColor: 'red',
    borderWidth: 2,
    padding: 5,
  },
})

const BenchRN = () => {
  return (
    <TimedRender>
      {new Array(1000).fill(0).map((_, i) => (
        <View style={styles.style} key={i} />
      ))}
    </TimedRender>
  )
}
