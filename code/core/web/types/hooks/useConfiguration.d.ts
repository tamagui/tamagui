export declare const useConfiguration: () => {
    animationDriver: import("..").AnimationDriver<{
        [key: string]: any;
    }>;
    disableSSR?: boolean;
    inText: boolean;
    language: import("../views/FontLanguage.types").LanguageContextType | null;
    setParentFocusState: ((next?: Partial<import("..").TamaguiComponentState> | undefined) => void) | null;
    unset?: import("..").BaseStyleProps | undefined;
    reactNative?: any;
    defaultFont?: string | undefined;
    selectionStyles?: ((theme: Record<string, string>) => null | {
        backgroundColor?: any;
        color?: any;
    }) | undefined;
    disableRootThemeClass?: boolean | undefined;
    defaultProps?: (Record<string, any> & {
        Stack?: import("..").StackProps;
        Text?: import("..").TextProps;
        Spacer?: import("..").SpacerProps;
    }) | undefined;
    mediaQueryDefaultActive?: Record<string, boolean> | undefined;
    cssStyleSeparator?: string | undefined;
    maxDarkLightNesting?: number | undefined;
    shouldAddPrefersColorThemes?: boolean | undefined;
    themeClassNameOnRoot?: boolean | undefined;
    onlyAllowShorthands?: boolean | undefined;
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
    settings: import("..").GenericTamaguiSettings & Omit<import("..").GenericTamaguiSettings, keyof import("..").GenericTamaguiSettings>;
    tokens: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        color?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        space?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        size?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        radius?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        zIndex?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
    }, import("..").TokenCategories> & {
        color: {};
        space: {};
        size: {};
        radius: {};
        zIndex: {};
    };
    tokensParsed: Omit<{
        [x: string]: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        };
        color?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        space?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        size?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        radius?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
        zIndex?: {
            [x: string]: import("..").Variable<any> | import("..").Variable<string> | import("..").Variable<number> | import("..").Variable<import("..").VariableValGeneric>;
        } | undefined;
    }, import("..").TokenCategories> & {
        color: {};
        space: {};
        size: {};
        radius: {};
        zIndex: {};
    };
    themeConfig: any;
    fontsParsed: import("..").GenericFonts;
    getCSS: import("..").GetCSS;
    getNewCSS: import("..").GetCSS;
    parsed: boolean;
    inverseShorthands: Record<string, string>;
    fontSizeTokens: Set<string>;
    specificTokens: Record<string, import("..").Variable>;
    defaultFontToken: `${string}`;
};
//# sourceMappingURL=useConfiguration.d.ts.map