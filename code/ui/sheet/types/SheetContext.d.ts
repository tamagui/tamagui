import React from 'react';
import type { SheetContextValue } from './useSheetProviderProps';
export declare const SheetContext: import("@tamagui/core").StyledContext<SheetContextValue>;
export declare const SheetProvider: React.Provider<SheetContextValue> & React.ProviderExoticComponent<Partial<SheetContextValue> & {
    children?: React.ReactNode;
    scope?: string;
}>, useSheetContext: (scope?: string) => SheetContextValue;
export declare const SheetOverlayLayerContext: React.Context<boolean>;
//# sourceMappingURL=SheetContext.d.ts.map