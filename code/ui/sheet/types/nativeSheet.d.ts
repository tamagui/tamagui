import type { FunctionComponent } from 'react';
import type { SheetProps } from './types';
type SheetNativePlatforms = 'ios';
export declare function getNativeSheet(platform: SheetNativePlatforms): FunctionComponent<SheetProps> | null;
export declare function setupNativeSheet(platform: SheetNativePlatforms, RNIOSModal: {
    ModalSheetView: any;
    ModalSheetViewMainContent: any;
}): void;
export {};
//# sourceMappingURL=nativeSheet.d.ts.map