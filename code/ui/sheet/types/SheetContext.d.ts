import { type UniversalAnimatedNumber } from '@tamagui/core';
import React from 'react';
import type { SheetContextValue } from './useSheetProviderProps';
export declare const SheetContext: import("@tamagui/core").StyledContext<SheetContextValue, never>;
export declare const SheetProvider: React.Provider<SheetContextValue> & React.ProviderExoticComponent<Partial<SheetContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSheetContext: (scope?: string) => SheetContextValue;
export declare const SheetOverlayLayerContext: React.Context<boolean>;
export declare const SheetNativeSystemContext: React.Context<boolean>;
export type SheetAnimatedPositionContextValue = {
    value: UniversalAnimatedNumber<any>;
    screenSize: number;
    frameSize: number;
    snapOffsets: number[];
    minY: number;
};
export declare const SheetAnimatedPositionContext: React.Context<SheetAnimatedPositionContextValue | null>;
/**
 * Read the sheet's live animated position. Call inside a `Sheet` to build
 * drag-linked effects (e.g. an overlay fade) on the public animation hooks:
 *
 * ```tsx
 * const { value, screenSize } = Sheet.useAnimatedPosition()
 * const style = useAnimatedNumberStyle(value, (y) => {
 *   'worklet'
 *   return { opacity: Math.max(0, 0.5 * (1 - y / screenSize)) }
 * })
 * ```
 */
export declare function useAnimatedPosition(): SheetAnimatedPositionContextValue;
//# sourceMappingURL=SheetContext.d.ts.map