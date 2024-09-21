// TODO

export * from '@tamagui/react-native-use-responder-events'
export * from '@tamagui/react-native-use-pressable'
export * from './index'

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
