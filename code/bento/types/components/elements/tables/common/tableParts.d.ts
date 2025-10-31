import type { SizeTokens } from 'tamagui';
type AlignCells = {
    y: 'center' | 'start' | 'end';
    x: 'center' | 'start' | 'end';
};
export declare const Table: import("react").ForwardRefExoticComponent<Omit<import("@tamagui/core").RNTamaguiViewNonStyleProps, "elevation" | keyof import("@tamagui/web").StackStyleBase | "fullscreen" | "cellWidth" | "cellHeight" | "alignHeaderCells" | "alignCells"> & import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    cellWidth?: SizeTokens | undefined;
    cellHeight?: SizeTokens | undefined;
    alignHeaderCells?: any;
    alignCells?: any;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>> & import("@tamagui/web").WithPseudoProps<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase> & {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    cellWidth?: SizeTokens | undefined;
    cellHeight?: SizeTokens | undefined;
    alignHeaderCells?: any;
    alignCells?: any;
} & import("@tamagui/web").WithShorthands<import("@tamagui/web").WithThemeValues<import("@tamagui/web").StackStyleBase>>> & import("@tamagui/web").WithMediaProps<import("@tamagui/web").WithThemeShorthandsAndPseudos<import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    cellWidth?: SizeTokens | undefined;
    cellHeight?: SizeTokens | undefined;
    alignHeaderCells?: any;
    alignCells?: any;
}>> & import("react").RefAttributes<import("tamagui").TamaguiElement>> & import("@tamagui/web").StaticComponentObject<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
    elevation?: number | SizeTokens | undefined;
    fullscreen?: boolean | undefined;
    cellWidth?: SizeTokens | undefined;
    cellHeight?: SizeTokens | undefined;
    alignHeaderCells?: any;
    alignCells?: any;
}, import("@tamagui/web").StaticConfigPublic> & Omit<import("@tamagui/web").StaticConfigPublic, "staticConfig" | "styleable"> & {
    __tama: [import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        cellWidth?: SizeTokens | undefined;
        cellHeight?: SizeTokens | undefined;
        alignHeaderCells?: any;
        alignCells?: any;
    }, import("@tamagui/web").StaticConfigPublic];
} & {
    Head: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Body: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Row: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        rowLocation?: "middle" | "first" | "last" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Cell: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        cellWidth?: SizeTokens | undefined;
        cellHeight?: SizeTokens | undefined;
        alignCells?: AlignCells | undefined;
        cellLocation?: "middle" | "first" | "last" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    HeaderCell: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
        cellWidth?: SizeTokens | undefined;
        alignHeaderCells?: AlignCells | undefined;
        cellLocation?: "middle" | "first" | "last" | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
    Foot: import("tamagui").TamaguiComponent<import("@tamagui/web").TamaDefer, import("tamagui").TamaguiElement, import("@tamagui/core").RNTamaguiViewNonStyleProps, import("@tamagui/web").StackStyleBase, {
        elevation?: number | SizeTokens | undefined;
        fullscreen?: boolean | undefined;
    }, import("@tamagui/web").StaticConfigPublic>;
};
export {};
//# sourceMappingURL=tableParts.d.ts.map