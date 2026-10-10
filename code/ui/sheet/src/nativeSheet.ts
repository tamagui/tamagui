import type { Ref } from 'react'
import type { ViewInstance as View } from '@tamagui/react-native-types'
import type { ComponentType } from 'react'
import type { NativeSheetRenderer, SheetNativePlatforms, SheetProps } from './types'

// registration is native-only; web always uses Tamagui's own sheet.
export function getNativeSheet(
  _platform: SheetNativePlatforms
): ComponentType<SheetProps & { ref?: Ref<View> }> | null {
  return null
}

export function setupNativeSheet(
  _platform: SheetNativePlatforms,
  _Renderer: NativeSheetRenderer
) {}
