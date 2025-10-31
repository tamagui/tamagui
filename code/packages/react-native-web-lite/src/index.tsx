import { createContext } from 'react'

export {
  AccessibilityUtil,
  canUseDOM,
  clickProps,
  createDOMProps,
  dismissKeyboard,
  flattenStyle,
  ImageLoader,
  InteractionManager,
  isWebColor,
  LocaleProvider,
  mergeRefs,
  normalizeColor,
  Platform,
  processColor,
  processStyle,
  StyleSheet,
  TextAncestorContext,
  UIManager,
  useEvent,
  useHover,
  useLayoutEffect,
  useMergeRefs,
  usePlatformMethods,
} from '@tamagui/react-native-web-internals'
export { createElement as unstable_createElement } from './createElement/index'
export { NativeModules } from './NativeModules/index'
export { render } from './render/index'

// animated - keep default as these are vendor files
export { default as Animated } from './vendor/react-native/Animated/Animated'
export { default as Easing } from './vendor/react-native/Animated/Easing'

// react-native - keep default as these are vendor files
export { default as NativeEventEmitter } from './vendor/react-native/EventEmitter/NativeEventEmitter'

// APIs
export { AccessibilityInfo } from './AccessibilityInfo/index'
export { Alert } from './Alert/index'
export { Appearance } from './Appearance/index'
export { AppRegistry } from './AppRegistry/index'
export { AppState } from './AppState/index'
export { BackHandler } from './BackHandler/index'
export { Clipboard } from './Clipboard/index'
export { DeviceEmitter, DeviceEmitter as DeviceEventEmitter } from './DeviceEmitter'
export { DeviceInfo } from './DeviceInfo/index'
export { Dimensions } from './Dimensions/index'
export { I18nManager } from './I18nManager/index'
export { Keyboard } from './Keyboard/index'

export { Linking } from './Linking/index'
export { PanResponder } from './PanResponder/index'
export { PixelRatio } from './PixelRatio/index'
export { Share } from './Share/index'
export { Vibration } from './Vibration/index'

// implemented components
export { FlatList } from './FlatList'
export { SectionList } from './SectionList'
export { VirtualizedList } from './VirtualizedList'
export { TouchableNativeFeedback } from './TouchableNativeFeedback'

// unimplemented
export {
  UnimplementedView as DrawerLayoutAndroid,
  UnimplementedView as Switch,
  UnimplementedView as TouchableHighlight,
} from './UnimplementedView'

export { TouchableOpacity as Touchable, TouchableOpacity } from './TouchableOpacity'
export { TouchableWithoutFeedback } from './TouchableWithoutFeedback'

// components
export { ActivityIndicator } from './ActivityIndicator/index'
export { Image } from './Image/index'
export { ImageBackground } from './ImageBackground/index'
export { KeyboardAvoidingView } from './KeyboardAvoidingView/index'
export { LogBox } from './LogBox/index'
export { Modal } from './Modal/index'
export { Pressable } from './Pressable/index'
export { RefreshControl } from './RefreshControl/index'
export { SafeAreaView } from './SafeAreaView/index'
export { ScrollView } from './ScrollView/index'
export { StatusBar } from './StatusBar/index'
export { Text } from './Text/index'
export { TextInput } from './TextInput/index'
export { View } from './View/index'

// hooks
export { useColorScheme } from './useColorScheme/index'
export { useLocaleContext } from './useLocaleContext/index'
export { useWindowDimensions } from './useWindowDimensions/index'

export function requireNativeComponent(name: string) {
  return function FakeComponent() {
    return null
  }
}

export const findNodeHandle = (component: any) => {
  throw new Error('not supported - use ref instead')
}

// compat with rn:

export { unstable_batchedUpdates } from 'react-dom'

export const RootTagContext = createContext(null)
