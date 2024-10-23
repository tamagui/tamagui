export { default as unstable_createElement } from './createElement/index'
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
  AccessibilityUtil,
  InteractionManager,
  LocaleProvider,
  createDOMProps,
  normalizeColor,
  usePlatformMethods,
  useLayoutEffect,
  processStyle,
  StyleSheet,
  clickProps,
  TextAncestorContext,
  flattenStyle,
} from '@tamagui/react-native-web-internals'
export { default as render } from './render/index'
export { unmountComponentAtNode } from 'react-dom'
export { default as NativeModules } from './NativeModules/index'
export { findNodeHandle } from './findNodeHandle'

// animated
export { default as Easing } from './vendor/react-native/Animated/Easing'
export { default as Animated } from './vendor/react-native/Animated/Animated'

// react-native
export { default as NativeEventEmitter } from './vendor/react-native/NativeEventEmitter/index'

// APIs
export { default as AccessibilityInfo } from './AccessibilityInfo/index'
export { default as Alert } from './Alert/index'
export { default as Appearance } from './Appearance/index'
export { default as AppRegistry } from './AppRegistry/index'
export { default as AppState } from './AppState/index'
export { default as BackHandler } from './BackHandler/index'
export { default as Clipboard } from './Clipboard/index'
export { default as DeviceInfo } from './DeviceInfo/index'
export { default as DeviceEmitter } from './DeviceEmitter'
export { default as DeviceEventEmitter } from './DeviceEmitter'
export { default as Dimensions } from './Dimensions/index'
export { default as I18nManager } from './I18nManager/index'
export { default as Keyboard } from './Keyboard/index'

export { default as Linking } from './Linking/index'
export { default as PanResponder } from './PanResponder/index'
export { default as PixelRatio } from './PixelRatio/index'
export { default as Share } from './Share/index'
export { default as Vibration } from './Vibration/index'

// unimplemented
export { default as DrawerLayoutAndroid } from './UnimplementedView'
export { default as Switch } from './UnimplementedView'
export { default as VirtualizedList } from './vendor/react-native/VirtualizedList'
export { default as FlatList } from './FlatList'
export { default as TouchableHighlight } from './UnimplementedView'
export { default as TouchableNativeFeedback } from './UnimplementedView'
export { default as SectionList } from './UnimplementedView'

export { default as Touchable } from './TouchableOpacity'
export { default as TouchableOpacity } from './TouchableOpacity'
export { default as TouchableWithoutFeedback } from './TouchableWithoutFeedback'

// components
export { default as ActivityIndicator } from './ActivityIndicator/index'
export { default as Image } from './Image/index'
export { default as ImageBackground } from './ImageBackground/index'
export { default as KeyboardAvoidingView } from './KeyboardAvoidingView/index'
export { default as Modal } from './Modal/index'
export { default as Pressable } from './Pressable/index'
export { default as RefreshControl } from './RefreshControl/index'
export { default as SafeAreaView } from './SafeAreaView/index'
export { default as ScrollView } from './ScrollView/index'
export { default as StatusBar } from './StatusBar/index'
export { default as Text } from './Text/index'
export { default as TextInput } from './TextInput/index'
export { default as View } from './View/index'
export { default as LogBox } from './LogBox/index'

// hooks
export { default as useColorScheme } from './useColorScheme/index'
export { useLocaleContext } from './useLocaleContext/index'
export { default as useWindowDimensions } from './useWindowDimensions/index'

export function requireNativeComponent(name: string) {
  return function FakeComponent() {
    return null
  }
}
