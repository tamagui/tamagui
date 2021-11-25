import { Container, Factory, NativeBaseProvider, extendTheme } from 'native-base'
import { View } from 'react-native'

export { Text } from 'native-base'

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
}

// extend the theme
const theme = extendTheme({ config })

export const BenchNativeBaseProvider = (props: any) => {
  return (
    <NativeBaseProvider theme={theme}>
      <Container>{props.children}</Container>
    </NativeBaseProvider>
  )
}

export const Button = Factory(View, {
  baseStyle: (props: any) => {
    return {
      alignItems: 'center',
      flexShrink: 0,
      justifyContent: 'center',
      backgroundColor: props.disabled || props.active ? 'gray' : 'white',
      shadowColor: props.disabled ? 'gray' : 'black',
      pointerEvents: props.disabled ? 'none' : 'auto',
      borderColor: '#999',
      borderWidth: 1,
      borderRadius: 3,
      height: 25,
      paddingLeft: 10,
      paddingRight: 10,
      ...(props.size == 1 && {
        borderRadius: '2',
        height: 25,
        paddingHorizontal: 10,
      }),
      ...(props.size == 2 && {
        borderRadius: '3',
        height: 35,
        paddingHorizontal: 15,
      }),
      ...(props.blue && {
        backgroundColor: 'blue',
        borderColor: 'gray',
      }),
      ...(props.red && {
        backgroundColor: 'red',
        borderColor: 'gray',
      }),
    }
  },
})

export const Dot = Factory(View, {
  baseStyle: {
    position: 'absolute',
    cursor: 'pointer',
    width: '0',
    height: '0',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    transform: 'translate(50%, 50%)',
  },
})

const colors = {
  0: '#14171A',
  1: '#AAB8C2',
  2: '#E6ECF0',
  3: '#FFAD1F',
  4: '#F45D22',
  5: '#E0245E',
}

export const Box = Factory(View, {
  baseStyle: (props: any) => ({
    alignSelf: 'flex-start',
    backgroundColor: colors[props.color] || 'transparent',
    flexDirection: props.layout === 'column' ? 'column' : 'row',
    padding: props.outer ? 4 : 0,
    ...(props.fixed && {
      width: 6,
      height: 6,
    }),
  }),
})
