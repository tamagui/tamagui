import React from "react";
import { StyleSheet, View } from 'react-native';
import { Button, Stack, Text, styled } from 'tamagui';

// disabling to avoid dep
// import { ThemeProvider, createBox } from '@shopify/restyle'
// const Box = createBox<any>()
const ThemeProvider = (Stack as any);
const Box = (Stack as any);

import { TimedRender } from '../components/TimedRender';

export const Benchmark = () => {
  return (
    <>
      <BenchmarkOne name="rn" />
      <BenchmarkOne name="tama" />
      <BenchmarkOne name="restyle" />
    </>);

};

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A906E',

  black: '#0B0B0B',
  white: '#F0F2F3'
};

const theme = {
  colors: {
    red: 'red',
    mainBackground: palette.white,
    cardPrimaryBackground: palette.purplePrimary
  },
  spacing: {
    s: 5,
    m: 16,
    l: 24,
    xl: 40
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34
    },
    body: {
      fontSize: 16,
      lineHeight: 24
    },
    defaults: {

      // We can define a default text variant here.
    } }
};

const StyledStack = styled(Stack, {
  borderColor: 'red',
  borderWidth: 2,
  padding: 5
});

const BenchmarkOne = ({ name }) => {
  const [x, setX] = React.useState(0);

  return (
    <>
      {React.useMemo(() => {
        return (
          <>
            <Text style={{ marginTop: 20 }}>{name}</Text>
            <Button onPress={() => setX(Math.random())}>Go</Button>
          </>);

      }, [])}
      <>
        {name === 'rn' &&
        <>
            <BenchRN key={x} />
          </>}

        {name === 'restyle' &&
        <>
            <ThemeProvider theme={theme}>
              <BenchRestyle key={x} />
            </ThemeProvider>
          </>}

        {name === 'tama' &&
        <>
            <BenchTama key={x} />
          </>}

      </>
    </>);

};

const iterArr = new Array(1000).fill(0);

const BenchTama = () => {
  return (
    <TimedRender>
      {iterArr.map((_, i) =>
      <StyledStack key={i} />
      )}
    </TimedRender>);

};

const BenchRestyle = () => {
  return (
    <TimedRender>
      {iterArr.map((_, i) =>
      <Box borderColor="red" borderWidth={2} padding="s" key={i} />
      )}
    </TimedRender>);

};

const styles = StyleSheet.create({
  style: {
    borderColor: 'red',
    borderWidth: 2,
    padding: 5
  }
});

const BenchRN = () => {
  return (
    <TimedRender>
      {iterArr.map((_, i) =>
      <View style={styles.style} key={i} />
      )}
    </TimedRender>);

};