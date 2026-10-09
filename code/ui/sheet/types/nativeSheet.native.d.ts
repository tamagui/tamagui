import type { NativeSheetRenderer, SheetNativePlatforms, SheetProps } from './types'
export declare function getNativeSheet(
  platform: SheetNativePlatforms
):
  | import('@tamagui/core').RefComponent<
      import('@tamagui/react-native-types').ReactNativeElement,
      SheetProps
    >
  | null
export declare function setupNativeSheet(
  platform: SheetNativePlatforms,
  Renderer: NativeSheetRenderer
): void
//# sourceMappingURL=nativeSheet.native.d.ts.map
