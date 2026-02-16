import type { ImageProps } from 'react-native'
import type { SFSymbol } from 'sf-symbols-typescript'

type ImageOptions = {
  tint?: string
}

export type NativeMenuProps = {
  children: React.ReactNode
  native?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Callback function indicating that the menu intends to open or close. Passes a `willOpen` boolean argument indicating whether it is opening or closing.
   * Unlike `onOpenChange`, this is called before the animation begins.
   * @platform `ios`
   */
  onOpenWillChange?: (willOpen: boolean) => void
}

/**
 * Props for the auxiliary view that can be shown alongside a context menu on iOS
 * @platform ios
 */
export type NativeContextMenuAuxiliaryProps = {
  height?: number
  width?: number
  anchorPosition?: 'top' | 'bottom' | 'automatic'
  children: React.ReactNode | ((options: { dismissMenu: () => void }) => React.ReactNode)
  onDidShow?: () => void
  marginWithScreenEdge?: number
  onWillShow?: () => void
}

export type MenuTriggerProps = {
  children: React.ReactElement
  asChild?: boolean
  /**
   * Determine whether the menu should open on `press` or `longPress`. Defaults to `press` for `Menu` and `longPress` for `ContextMenu`.
   *
   * Only applies for `ios` and `android`.
   */
  action?: 'press' | 'longPress'
}

export type NativeMenuContentProps = {
  children: React.ReactNode
}
export type NativeContextMenuContentProps = NativeMenuContentProps

export type NativeMenuGroupProps = {
  children: React.ReactNode
}

export type NativeMenuItemProps = {
  children: React.ReactNode
  /**
   * If you want to pass a React text node to `<ItemTitle />`, then you need to use this prop. This gets used on iOS and Android.
   */
  textValue?: string
  /**
   * Callback when the item is selected
   */
  onSelect?: (event?: Event) => void
} & {
  disabled?: boolean
  hidden?: boolean
  destructive?: boolean
  key: string
}

export interface NativeMenuItemCommonProps {
  /**
   * React elements to render as fallback icon (typically for web)
   */
  children?: React.ReactNode
  /**
   * The name of an iOS-only SF Symbol. For a full list, see https://developer.apple.com/sf-symbols/.
   * @deprecated Please use the `name` inside of the `ios` prop instead.
   * @platform ios
   */
  iosIconName?: string
  /**
   * Icon configuration to be used on iOS. You can pass a SF Symbol icon using the `name` prop.
   * Additionally, you can configure the SF Symbol's features like weight, scale, color etc. by passing
   * the corresponding props. Note that some of those features require iOS 15+.
   *
   * @platform ios
   */
  ios?: {
    name: SFSymbol
    weight?:
      | 'ultraLight'
      | 'thin'
      | 'light'
      | 'regular'
      | 'medium'
      | 'semibold'
      | 'bold'
      | 'heavy'
      | 'black'
    scale?: 'small' | 'medium' | 'large'
    hierarchicalColor?: string
    paletteColors?: string[]
  }
  /**
   * The name of an android-only resource drawable. For a full list, see https://developer.android.com/reference/android/R.drawable.html.
   *
   * @platform android
   */
  androidIconName?: string
}

export type NativeMenuItemIconProps = NativeMenuItemCommonProps

export type NativeMenuItemImageProps = NativeMenuItemCommonProps & {
  /**
   * `source={require('path/to/image')}`
   */
  source: ImageProps['source']
  ios?: {
    style?: ImageOptions
    lazy?: boolean
  }
}

export type NativeMenuArrowProps = {}

export type NativeMenuSubTriggerProps = NativeMenuItemProps & {
  key: string
}

export type NativeMenuSubProps = {
  children?: React.ReactNode
}

export type NativeMenuSubContentProps = {
  children: React.ReactNode
}
export type NativeContextMenuSubContentProps = NativeContextMenuContentProps

export type NativeMenuItemTitleProps = {
  children: string | React.ReactNode
}
export type NativeMenuItemSubtitleProps = {
  children: string
}
export type NativeMenuSeparatorProps = {}
export type NativeMenuCheckboxItemProps = Omit<NativeMenuItemProps, 'onSelect'> & {
  /**
   * The controlled checked state of the checkbox item.
   * Use this with `onCheckedChange` for the web-style API.
   */
  checked?: boolean
  /**
   * Callback when the checked state changes.
   * Use this with `checked` for the web-style API.
   */
  onCheckedChange?: (checked: boolean) => void
  /**
   * The controlled value state for native platforms.
   * Use this with `onValueChange` for the native-style API.
   * @platform ios, android
   */
  value?: 'mixed' | 'on' | 'off' | boolean
  /**
   * Callback when the value changes on native platforms.
   * Use this with `value` for the native-style API.
   * @platform ios, android
   */
  onValueChange?: (
    state: 'mixed' | 'on' | 'off',
    prevState: 'mixed' | 'on' | 'off'
  ) => void
  key: string
}

export type NativeMenuItemIndicatorProps = {
  children?: React.ReactNode
}

export type NativeMenuLabelProps = {
  children: string
  /**
   * If you want to pass a React text node to `<Lable />`, then you need to use this prop. This gets used on iOS and Android.
   */
  textValue?: string
}

export type ContextMenuPreviewProps = {
  children: React.ReactNode | (() => React.ReactNode)
  /**
   * Size of the preview
   * @platform ios
   */
  size?: {
    width?: number
    height?: number
  }
  /**
   * Called when the preview is pressed
   * @platform ios
   */
  onPress?: () => void
  /**
   * Background color of the preview
   * @platform ios
   */
  backgroundColor?: string
  /**
   * Border radius of the preview
   * @platform ios
   */
  borderRadius?: number
}
