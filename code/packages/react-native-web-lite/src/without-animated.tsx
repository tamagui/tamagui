export { createElement as unstable_createElement } from './createElement/index'
export {
  processColor,
  Platform,
  UIManager,
  canUseDOM,
  dismissKeyboard,
  isWebColor,
  mergeRefs,
  useMergeRefs,
  useEvent,
  useHover,
  ImageLoader,
} from '@tamagui/react-native-web-internals'
export { render } from './render/index'
export { NativeModules } from './NativeModules/index'

// react-native
export { default as NativeEventEmitter } from './vendor/react-native/EventEmitter/NativeEventEmitter'

// APIs
export { AccessibilityInfo } from './AccessibilityInfo/index'
export { Alert } from './Alert/index'
export { Appearance } from './Appearance/index'
export { AppRegistry } from './AppRegistry/index'
export { AppState } from './AppState/index'
export { BackHandler } from './BackHandler/index'
export { Clipboard } from './Clipboard/index'
export { DeviceInfo } from './DeviceInfo/index'
export { DeviceEmitter } from './DeviceEmitter'
export { DeviceEmitter as DeviceEventEmitter } from './DeviceEmitter'
export { Dimensions } from './Dimensions/index'
export { I18nManager } from './I18nManager/index'
export { Keyboard } from './Keyboard/index'

export { Linking } from './Linking/index'
export { PanResponder } from './PanResponder/index'
export { PixelRatio } from './PixelRatio/index'
export { Share } from './Share/index'
export { Vibration } from './Vibration/index'

// unimplemented
export { UnimplementedView as DrawerLayoutAndroid } from './UnimplementedView'
export { UnimplementedView as Switch } from './UnimplementedView'
export { UnimplementedView as VirtualizedList } from './UnimplementedView'
export { UnimplementedView as FlatList } from './UnimplementedView'
export { UnimplementedView as TouchableHighlight } from './UnimplementedView'
export { UnimplementedView as TouchableNativeFeedback } from './UnimplementedView'
export { UnimplementedView as SectionList } from './UnimplementedView'

export { TouchableOpacity } from './TouchableOpacity'
export { TouchableWithoutFeedback } from './TouchableWithoutFeedback'

// components
export { ActivityIndicator } from './ActivityIndicator/index'
export { Image } from './Image/index'
export { ImageBackground } from './ImageBackground/index'
export { KeyboardAvoidingView } from './KeyboardAvoidingView/index'
export { Modal } from './Modal/index'
export { Pressable } from './Pressable/index'
export { RefreshControl } from './RefreshControl/index'
export { SafeAreaView } from './SafeAreaView/index'
export { ScrollView } from './ScrollView/index'
export { StatusBar } from './StatusBar/index'
export { Text } from './Text/index'
export { TextInput } from './TextInput/index'
export { View } from './View/index'
export { LogBox } from './LogBox/index'

// hooks
export { useColorScheme } from './useColorScheme/index'
export { useLocaleContext } from './useLocaleContext/index'
export { useWindowDimensions } from './useWindowDimensions/index'

// // useful internals
export * from '@tamagui/react-native-web-internals'

export function requireNativeComponent(name: string) {
  return function FakeComponent() {
    return null
  }
}
