export declare const useConfiguration: () => {
    animationDriver: import("..").AnimationDriver<{
        [key: string]: any;
    }>;
    disableSSR?: boolean | undefined;
    inText: boolean;
    language: Partial<{
        [x: string]: import("..").FontLanguages;
    }> | null;
    unset?: import("..").BaseStyleProps | undefined;
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
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
            background?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            backgroundHover?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            backgroundPress?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            backgroundFocus?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            color?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            colorHover?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            colorPress?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            colorFocus?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            borderColor?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            borderColorHover?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            borderColorPress?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            borderColorFocus?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            shadowColor?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            shadowColorHover?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            shadowColorPress?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
            shadowColorFocus?: import("..").Variable<string> | import("..").Variable<any> | import("..").Variable<undefined> | undefined;
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
        webContainerType?: "size" | "unset" | "inherit" | "initial" | "revert" | "revert-layer" | "normal" | "inline-size" | undefined;
    } & Omit<{
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
        webContainerType?: "size" | "unset" | "inherit" | "initial" | "revert" | "revert-layer" | "normal" | "inline-size" | undefined;
    }, keyof {
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
        webContainerType?: "size" | "unset" | "inherit" | "initial" | "revert" | "revert-layer" | "normal" | "inline-size" | undefined;
    }>;
    tokens: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        color: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        space: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        size: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        radius: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        zIndex: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
    }, import("..").TokenCategories> & {
        color: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        space: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        size: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        radius: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        zIndex: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
    };
    tokensParsed: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        color: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        space: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        size: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        radius: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        zIndex: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
    }, import("..").TokenCategories> & {
        color: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        space: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        size: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        radius: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        zIndex: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
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