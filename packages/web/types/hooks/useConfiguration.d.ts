export declare const useConfiguration: () => {
    animationDriver: import("..").AnimationDriver<{
        [key: string]: any;
    }>;
    disableSSR?: boolean | undefined;
    inText: boolean;
    language: Partial<{
        [x: string]: import("..").FontLanguages;
    }> | null;
    reactNative?: any;
    selectionStyles?: ((theme: Record<string, string>) => {
        backgroundColor?: any;
        color?: any;
    } | null) | undefined;
    disableRootThemeClass?: boolean | undefined;
    defaultProps?: (Record<string, any> & {
        Stack?: import("..").StackProps | undefined;
        Text?: import("..").TextProps | undefined;
        Spacer?: import("..").SpacerProps | undefined;
    }) | undefined;
    mediaQueryDefaultActive?: Record<string, boolean> | undefined;
    cssStyleSeparator?: string | undefined;
    maxDarkLightNesting?: number | undefined;
    shouldAddPrefersColorThemes?: boolean | undefined;
    themeClassNameOnRoot?: boolean | undefined;
    fonts: {
        [x: string]: import("..").GenericFont<string | number | symbol>;
    };
    fontLanguages: string[];
    themes: {
        [x: string]: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
            background?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            backgroundHover?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            backgroundPress?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            backgroundFocus?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            color?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            colorHover?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            colorPress?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            colorFocus?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            borderColor?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            borderColorHover?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            borderColorPress?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            borderColorFocus?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            shadowColor?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            shadowColorHover?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            shadowColorPress?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
            shadowColorFocus?: import("..").Variable<import("..").VariableColorVal | undefined> | undefined;
        };
    };
    shorthands: import("..").GenericShorthands;
    media: {
        [key: string]: {
            [key: string]: string | number;
        };
    };
    onlyAllowShorthands: boolean | undefined;
    defaultFont: string | undefined;
    settings: {
        allowedStyleValues?: ((boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web") | {
            space?: ("number" | (boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web") | "percent") | undefined;
            size?: ("number" | (boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web") | "percent") | undefined;
            radius?: ("number" | (boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web")) | undefined;
            zIndex?: ("number" | (boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web")) | undefined;
            color?: ((boolean | "strict" | "somewhat-strict" | "strict-web" | "somewhat-strict-web") | "named") | undefined;
        }) | undefined;
        autocompleteSpecificTokens?: (boolean | "except-special") | undefined;
        mediaPropOrder?: boolean | undefined;
        fastSchemeChange?: boolean | undefined;
    };
    tokens: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        color: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        space: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        size: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        radius: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        zIndex: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
    }, "color" | "space" | "size" | "radius" | "zIndex"> & {
        color: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        space: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        size: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        radius: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        zIndex: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
    };
    tokensParsed: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        color: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        space: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        size: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        radius: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        zIndex: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
    }, "color" | "space" | "size" | "radius" | "zIndex"> & {
        color: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        space: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        size: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        radius: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
        zIndex: {
            [x: string]: import("..").Variable<import("..").VariableVal>;
        };
    };
    themeConfig: any;
    fontsParsed: import("..").GenericFonts;
    getCSS: import("..").GetCSS;
    getNewCSS: import("..").GetCSS;
    parsed: boolean;
    inverseShorthands: Record<string, string>;
    fontSizeTokens: Set<string>;
    specificTokens: Record<string, import("..").Variable<any>>;
};
//# sourceMappingURL=useConfiguration.d.ts.map