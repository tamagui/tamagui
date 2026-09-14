import type { FunctionComponent } from 'react';
import type { SheetNativeModal, SheetNativePlatforms, SheetProps } from './types';
/**
 * `native` asks for the platform's own sheet, which is a UIKit modal, so there
 * is nothing to register or hand back on web and the sheet always falls through
 * to its own implementation. The native sibling holds the real registry.
 */
export declare function getNativeSheet(_platform: SheetNativePlatforms): FunctionComponent<SheetProps> | null;
export declare function setupNativeSheet(_platform: SheetNativePlatforms, _RNIOSModal: SheetNativeModal): void;
//# sourceMappingURL=nativeSheet.d.ts.map