import { makeTheme, styled } from 'dripsy'
import { View } from 'react-native-web'

export const dripsyTheme = makeTheme({
  colors: {
    primary: '#41b87a',
    secondary: 'black',
    background: 'white',
    red: 'red',
    green: 'green',
    blue: 'blue',
  },
  text: {
    primary: {
      fontSize: 40,
      color: 'green',
    },
    secondary: {
      fontSize: 60,
      color: 'blue',
    },
  },
  sizes: {
    container: 700,
  },
  shadows: {
    md: {
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.8,
      shadowRadius: 14,
      elevation: 25,
    },
  },
  linearGradients: {
    strong: ['primary', 'secondary'],
    light: ['red', 'green'],
  },
  layout: {
    wide: {
      width: 199,
    },
    narrow: {},
  },
})

export const Button = styled(View)(
  (props: {
    disabled?: boolean
    active?: boolean
    size?: number
    blue?: boolean
    red?: boolean
  }) => ({
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
  })
)

export const Dot = styled(View)(() => ({
  position: 'absolute',
  cursor: 'pointer',
  width: '0',
  height: '0',
  borderColor: 'transparent',
  borderStyle: 'solid',
  borderTopWidth: 0,
  transform: 'translate(50%, 50%)',
}))

const colors = {
  0: '#14171A',
  1: '#AAB8C2',
  2: '#E6ECF0',
  3: '#FFAD1F',
  4: '#F45D22',
  5: '#E0245E',
}

export const Box = styled(View)((props: any) => ({
  alignSelf: 'flex-start',
  backgroundColor: colors[props.color] || 'transparent',
  flexDirection: props.layout === 'column' ? 'column' : 'row',
  padding: props.outer ? 4 : 0,
  ...(props.fixed && {
    width: 6,
    height: 6,
  }),
}))
