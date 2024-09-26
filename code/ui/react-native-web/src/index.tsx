// TODO

export * from '@tamagui/react-native-use-responder-events'
export * from '@tamagui/react-native-use-pressable'
export { View, Text } from '@tamagui/web'
import { View, Text } from '@tamagui/web'

export * from './Dimensions'

export const Platform = {
  OS: 'web',

  select(obj) {
    return obj.web
  },
}

export const StyleSheet = {
  create(obj) {
    return obj
  },
}

export const Pressable = () => {
  return null
}

export const Animated = {
  View,
  Text,
}

export const ActivityIndicator = () => {
  return null
}

export const PanResponder = () => {
  return null
}

export const Switch = () => {
  return null
}

export const TextInput = () => {
  return null
}

export const ScrollView = () => {
  return null
}

export const Keyboard = {}

export const Image = () => {
  return null
}

export const Linking = {}
