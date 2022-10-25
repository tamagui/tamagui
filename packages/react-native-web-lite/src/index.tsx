export { default as unstable_createElement } from './createElement/index.js'
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
} from 'react-native-web-internals'
export { default as render } from './render/index.js'
export { unmountComponentAtNode } from 'react-dom'
export { default as NativeModules } from './NativeModules/index.js'
export { findNodeHandle } from './findNodeHandle.js'
export { default as Easing } from './vendor/react-native/Animated/Easing.js'

// APIs
export { default as AccessibilityInfo } from './AccessibilityInfo/index.js'
export { default as Alert } from './Alert/index.js'
export { default as Appearance } from './Appearance/index.js'
export { default as AppRegistry } from './AppRegistry/index.js'
export { default as AppState } from './AppState/index.js'
export { default as BackHandler } from './BackHandler/index.js'
export { default as Clipboard } from './Clipboard/index.js'
export { default as DeviceInfo } from './DeviceInfo/index.js'
export { default as DeviceEmitter } from './DeviceEmitter.js'
export { default as DeviceEventEmitter } from './DeviceEmitter.js'
export { default as Dimensions } from './Dimensions/index.js'
export { default as I18nManager } from './I18nManager/index.js'
export { default as Keyboard } from './Keyboard/index.js'

export { default as Linking } from './Linking/index.js'
export { default as PanResponder } from './PanResponder/index.js'
export { default as PixelRatio } from './PixelRatio/index.js'
export { default as Share } from './Share/index.js'
export { default as Vibration } from './Vibration/index.js'

// unimplemented
export { default as DrawerLayoutAndroid } from './UnimplementedView.js'
export { default as Switch } from './UnimplementedView.js'
export { default as VirtualizedList } from './UnimplementedView.js'
export { default as FlatList } from './UnimplementedView.js'
export { default as TouchableOpacity } from './UnimplementedView.js'
export { default as TouchableWithoutFeedback } from './UnimplementedView.js'
export { default as TouchableHighlight } from './UnimplementedView.js'
export { default as TouchableNativeFeedback } from './UnimplementedView.js'
export { default as SectionList } from './UnimplementedView.js'
export { default as Modal } from './UnimplementedView.js'

export { default as NativeEventEmitter } from './vendor/react-native/NativeEventEmitter/index.js'
export { default as Animated } from './vendor/react-native/Animated/Animated.js'

// components
export { default as ActivityIndicator } from './ActivityIndicator/index.js'
export { default as Image } from './Image/index.js'
export { default as ImageBackground } from './ImageBackground/index.js'
export { default as KeyboardAvoidingView } from './KeyboardAvoidingView/index.js'
export { default as Pressable } from './Pressable/index.js'
export { default as RefreshControl } from './RefreshControl/index.js'
export { default as SafeAreaView } from './SafeAreaView/index.js'
export { default as ScrollView } from './ScrollView/index.js'
export { default as StatusBar } from './StatusBar/index.js'
export { default as Text } from './Text/index.js'
export { default as TextInput } from './TextInput/index.js'
export { default as View } from './View/index.js'
export { default as LogBox } from './LogBox/index.js'

// hooks
export { default as useColorScheme } from './useColorScheme/index.js'
export { useLocaleContext } from './useLocaleContext/index.js'
export { default as useWindowDimensions } from './useWindowDimensions/index.js'

// // useful internals
export * from 'react-native-web-internals'

export function requireNativeComponent(name: string) {
  return function FakeComponent() {
    return null
  }
}
