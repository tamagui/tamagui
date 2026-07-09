import type { SheetContextValue } from './useSheetProviderProps';
export declare const SheetContext: import("@tamagui/core").StyledContext<SheetContextValue>;
export declare const SheetProvider: import("react").Provider<SheetContextValue> & import("react").ProviderExoticComponent<Partial<SheetContextValue> & {
    children?: import("react").ReactNode;
    scope?: string;
}>, useSheetContext: (scope?: string) => SheetContextValue;
//# sourceMappingURL=SheetContext.d.ts.map