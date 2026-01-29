import { shouldRenderNativePlatform } from '@tamagui/core'
import { registerFocusable } from '@tamagui/focusable'
import * as React from 'react'
import { Switch as NativeSwitch } from 'react-native'
import type { UseSwitchNativeProps } from './types'

/**
 * native version - handles registerFocusable and renders NativeSwitch when appropriate
 */
export function useSwitchNative(props: UseSwitchNativeProps): React.ReactNode | null {
  const { id, disabled, native, nativeProps, checked, setChecked } = props

  React.useEffect(() => {
    if (!id) return
    if (disabled) return

    return registerFocusable(id, {
      focusAndSelect: () => {
        setChecked((value) => !value)
      },
      focus: () => {},
    })
  }, [id, disabled, setChecked])

  const renderNative = shouldRenderNativePlatform(native)
  if (renderNative === 'android' || renderNative === 'ios') {
    return <NativeSwitch value={checked} onValueChange={setChecked} {...nativeProps} />
  }

  return null
}
