// debug
import React from 'react'
import { Button, RefreshControlBase, StyleSheet, View } from 'react-native'
import { Stack, Text, XStack, styled } from 'tamagui'

// 123

// disabling to avoid dep
import { ThemeProvider, createBox } from '@shopify/restyle'
const Box = createBox<any>()

import { TimedRender } from '../components/TimedRender'
// import { CheckboxDemo } from '@tamagui/demos'

export const Benchmark = () => {
  return (
    <>
      <Stack
        // debug="verbose"
        style={[{ backgroundColor: 'red', width: 100, height: 100 }]}
      />
      <BenchStyled />
    </>
  )
}

const BenchStyled = () => {
  return (
    <>
      <BenchRN />
      <BenchTama />
      <BenchRestyle />
    </>
  )
}

const StyledStack = styled(Stack, {
  backgroundColor: 'red',
  paddingTop: 5,
  paddingBottom: 5,
  width: 20,
})

const BenchmarkFrame = ({ name, children }) => {
  const [x, setX] = React.useState(0)

  return (
    <>
      <>
        <Text style={{ marginTop: 20 }}>{name}</Text>
        <Text>run: {x}</Text>
        <Button title="Go" onPress={() => setX(Math.random())} />
      </>

      <TimedRender key={x}>{children}</TimedRender>
    </>
  )
}

const iterArr = new Array(1000).fill(0)

const BenchTama = () => {
  return (
    <BenchmarkFrame name="tamagui">
      <View style={{ flexDirection: 'row' }}>
        {iterArr.map((_, i) => (
          <StyledStack key={i} />
        ))}
      </View>
    </BenchmarkFrame>
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

const theme = {
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
}

const BenchRestyle = () => {
  return (
    <ThemeProvider theme={theme}>
      <BenchmarkFrame name="restyle">
        <View style={{ flexDirection: 'row' }}>
          {iterArr.map((_, i) => (
            <Box
              backgroundColor="red"
              paddingTop="s"
              paddingBottom="s"
              width={20}
              key={i}
            />
          ))}
        </View>
      </BenchmarkFrame>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'red',
    paddingTop: 5,
    paddingBottom: 5,
    width: 20,
  },
})

const BenchRN = () => {
  return (
    <BenchmarkFrame name="rn">
      <View style={{ flexDirection: 'row' }}>
        {iterArr.map((_, i) => (
          <View style={styles.style} key={i} />
        ))}
      </View>
    </BenchmarkFrame>
  )
}
