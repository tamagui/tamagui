import { createContext } from 'react'

export { createElement as unstable_createElement } from './createElement/index'
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

export { TouchableOpacity as Touchable, TouchableOpacity } from './TouchableOpacity'
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

// minimal stub for Animated - satisfies imports but does nothing
export const Animated = {
  View: 'div',
  Text: 'span',
  Image: 'img',
  ScrollView: 'div',
  FlatList: 'div',
  SectionList: 'div',
  Value: class {
    constructor() {}
  },
  ValueXY: class {
    constructor() {}
  },
  timing: () => ({ start: () => {} }),
  spring: () => ({ start: () => {} }),
  decay: () => ({ start: () => {} }),
  sequence: () => ({ start: () => {} }),
  parallel: () => ({ start: () => {} }),
  stagger: () => ({ start: () => {} }),
  loop: () => ({ start: () => {} }),
  event: () => () => {},
  add: () => new (class {})(),
  subtract: () => new (class {})(),
  multiply: () => new (class {})(),
  divide: () => new (class {})(),
  modulo: () => new (class {})(),
  diffClamp: () => new (class {})(),
  delay: () => ({ start: () => {} }),
  createAnimatedComponent: (c: any) => c,
}

// minimal stub for Easing - satisfies imports but does nothing
export const Easing = {
  step0: () => 0,
  step1: () => 1,
  linear: (t: number) => t,
  ease: (t: number) => t,
  quad: (t: number) => t * t,
  cubic: (t: number) => t * t * t,
  poly: () => (t: number) => t,
  sin: (t: number) => t,
  circle: (t: number) => t,
  exp: (t: number) => t,
  elastic: () => (t: number) => t,
  back: () => (t: number) => t,
  bounce: (t: number) => t,
  bezier: () => (t: number) => t,
  in: (fn: any) => fn,
  out: (fn: any) => fn,
  inOut: (fn: any) => fn,
}

export const findNodeHandle = (component: any) => {
  throw new Error('not supported - use ref instead')
}

// compat with rn:
export { unstable_batchedUpdates } from 'react-dom'

export const RootTagContext = createContext(null)
