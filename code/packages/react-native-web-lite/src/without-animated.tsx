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
export type { ScrollViewRef, ScrollViewMethods } from './ScrollView/index'
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

import { View as _View } from './View/index'
import { Text as _Text } from './Text/index'
import { Image as _Image } from './Image/index'
import { ScrollView as _ScrollView } from './ScrollView/index'

// minimal stub for Animated.Value that holds a number and supports listeners
class AnimatedValue {
  _value: number
  _offset: number
  _listeners: Record<string, (state: { value: number }) => void>
  _nextId: number

  constructor(value: number = 0) {
    this._value = value
    this._offset = 0
    this._listeners = {}
    this._nextId = 0
  }

  setValue(value: number) {
    this._value = value
    this._notifyListeners()
  }

  setOffset(offset: number) {
    this._offset = offset
  }

  flattenOffset() {
    this._value += this._offset
    this._offset = 0
  }

  extractOffset() {
    this._offset = this._value
    this._value = 0
  }

  addListener(callback: (state: { value: number }) => void): string {
    const id = String(this._nextId++)
    this._listeners[id] = callback
    return id
  }

  removeListener(id: string) {
    delete this._listeners[id]
  }

  removeAllListeners() {
    this._listeners = {}
  }

  stopAnimation(callback?: (value: number) => void) {
    callback?.(this._value)
  }

  resetAnimation(callback?: (value: number) => void) {
    callback?.(this._value)
  }

  interpolate(config: any) {
    return new AnimatedValue(this._value)
  }

  _notifyListeners() {
    for (const key in this._listeners) {
      this._listeners[key]({ value: this._value })
    }
  }

  __getValue() {
    return this._value + this._offset
  }
}

class AnimatedValueXY {
  x: AnimatedValue
  y: AnimatedValue

  constructor(value?: { x?: number; y?: number }) {
    this.x = new AnimatedValue(value?.x ?? 0)
    this.y = new AnimatedValue(value?.y ?? 0)
  }

  setValue(value: { x: number; y: number }) {
    this.x.setValue(value.x)
    this.y.setValue(value.y)
  }

  setOffset(offset: { x: number; y: number }) {
    this.x.setOffset(offset.x)
    this.y.setOffset(offset.y)
  }

  flattenOffset() {
    this.x.flattenOffset()
    this.y.flattenOffset()
  }

  stopAnimation(callback?: (value: { x: number; y: number }) => void) {
    callback?.({ x: this.x._value, y: this.y._value })
  }

  addListener(callback: (value: { x: number; y: number }) => void): string {
    const xId = this.x.addListener(() => {
      callback({ x: this.x._value, y: this.y._value })
    })
    this.y.addListener(() => {
      callback({ x: this.x._value, y: this.y._value })
    })
    return xId
  }

  removeAllListeners() {
    this.x.removeAllListeners()
    this.y.removeAllListeners()
  }

  getLayout() {
    return { left: this.x, top: this.y }
  }

  getTranslateTransform() {
    return [{ translateX: this.x }, { translateY: this.y }]
  }
}

const noopAnim = {
  start: (cb?: any) => cb?.({ finished: true }),
  stop: () => {},
  reset: () => {},
}

// minimal stub for Animated - uses real components so props get filtered
export const Animated = {
  View: _View,
  Text: _Text,
  Image: _Image,
  ScrollView: _ScrollView,
  FlatList: _View,
  SectionList: _View,
  Value: AnimatedValue,
  ValueXY: AnimatedValueXY,
  timing: () => noopAnim,
  spring: () => noopAnim,
  decay: () => noopAnim,
  sequence: () => noopAnim,
  parallel: () => noopAnim,
  stagger: () => noopAnim,
  loop: () => noopAnim,
  event: () => () => {},
  add: (a: any, b: any) => new AnimatedValue(0),
  subtract: (a: any, b: any) => new AnimatedValue(0),
  multiply: (a: any, b: any) => new AnimatedValue(0),
  divide: (a: any, b: any) => new AnimatedValue(0),
  modulo: (a: any, b: any) => new AnimatedValue(0),
  diffClamp: (a: any, min: number, max: number) => new AnimatedValue(0),
  delay: () => noopAnim,
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
