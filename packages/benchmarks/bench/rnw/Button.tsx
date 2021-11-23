import React from 'react'
import { StyleSheet, View } from 'react-native-web'

export const Button = (props) => (
  <View
    style={[
      sheet.button,
      props.isEven ? sheet.blue : sheet.red,
      props.isEven ? sheet.size1 : sheet.size2,
      props.style,
    ]}
  >
    {props.children}
  </View>
)

const sheet = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 3,
    height: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },

  disabled: {
    backgroundColor: 'gray',
    shadowColor: 'gray',
    pointerEvents: 'none',
  },

  size1: {
    borderRadius: '2',
    height: 25,
    paddingHorizontal: 10,
  },

  size2: {
    borderRadius: '3',
    height: 35,
    paddingHorizontal: 15,
  },

  blue: {
    backgroundColor: 'blue',
    borderColor: 'gray',
  },

  red: {
    backgroundColor: 'red',
    borderColor: 'gray',
  },
})
