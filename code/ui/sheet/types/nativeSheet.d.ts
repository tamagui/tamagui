import type { Ref } from 'react';
import type { View } from '@tamagui/react-native-types';
import type { ComponentType } from 'react';
import type { NativeSheetRenderer, SheetNativePlatforms, SheetProps } from './types';
export declare function getNativeSheet(_platform: SheetNativePlatforms): ComponentType<SheetProps & {
    ref?: Ref<View>;
}> | null;
export declare function setupNativeSheet(_platform: SheetNativePlatforms, _Renderer: NativeSheetRenderer): void;
//# sourceMappingURL=nativeSheet.d.ts.map