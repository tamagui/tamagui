import { Stack, styled } from '@tamagui/core'
import { TextInput } from 'react-native'

export const Form = styled(Stack, {
  tag: 'form',
})

// TODO
// @ts-ignore
export const Input = styled(TextInput, {
  paddingVertical: '$2',
  paddingHorizontal: '$4',
  fontSize: '$4',
})

// TODO
// @ts-ignore
export const TextArea = styled(TextInput, {
  multiline: true,
  numberOfLines: 4,

  paddingVertical: '$2',
  paddingHorizontal: '$4',
  fontSize: '$4',
})

// TODO
// type AutocompleteType =
//   | 'cc-csc'
//   | 'cc-exp'
//   | 'cc-exp-month'
//   | 'cc-exp-year'
//   | 'cc-number'
//   | 'email'
//   | 'name'
//   | 'password'
//   | 'postal-code'
//   | 'street-address'
//   | 'tel'
//   | 'username'
//   | 'off'
