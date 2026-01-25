import type { GetProps, NativeValue, SizeTokens, ViewProps } from '@tamagui/core'
import type { SwitchExtraProps as HeadlessSwitchExtraProps } from '@tamagui/switch-headless'
import type { SwitchProps as NativeSwitchProps, ViewStyle } from 'react-native'
import type { SwitchThumb } from './Switch'

export type SwitchSharedProps = {
  size?: SizeTokens | number
  unstyled?: boolean
}

export type SwitchBaseProps = ViewProps & SwitchSharedProps

export type SwitchFrameActiveStyleProps = {
  activeStyle?: ViewStyle
  activeTheme?: string | null
}

export type SwitchThumbActiveStyleProps = {
  activeStyle?: GetProps<typeof SwitchThumb>
}

export type SwitchExtraProps = HeadlessSwitchExtraProps & {
  native?: NativeValue<'mobile' | 'ios' | 'android'>
  nativeProps?: NativeSwitchProps
} & SwitchFrameActiveStyleProps

export type SwitchProps = SwitchBaseProps & SwitchExtraProps

export type SwitchThumbBaseProps = ViewProps

export type SwitchThumbProps = SwitchThumbBaseProps &
  SwitchSharedProps &
  SwitchThumbActiveStyleProps

// loose types for createSwitch generics - actual components have stricter types
export type SwitchComponent = (props: any) => any
export type SwitchThumbComponent = (props: any) => any

export type UseSwitchNativeProps = {
  id?: string
  disabled?: boolean
  native?: NativeValue<'mobile' | 'ios' | 'android'>
  nativeProps?: NativeSwitchProps
  checked: boolean
  setChecked: (value: boolean | ((prev: boolean) => boolean)) => void
}
