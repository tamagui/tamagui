import React, { RefObject } from 'react';
import { TextProps as ReactTextProps, TextStyle } from 'react-native';
import { GestureResponderEvent, View, ViewProps, ViewStyle } from 'react-native';
import { Variable } from './createVariable';
import { ThemeProviderProps } from './views/ThemeProvider';
export interface CreateTokens<Val extends number | string | Variable = number | string | Variable> {
    font: {
        [key: string]: GenericFont;
    };
    color: {
        [key: string]: Val;
    };
    space: {
        [key: string]: Val;
    };
    size: {
        [key: string]: Val;
    };
    radius: {
        [key: string]: Val;
    };
    zIndex: {
        [key: string]: Val;
    };
}
declare type GenericTokens = CreateTokens;
declare type GenericThemes = {
    [key: string]: {
        bg: string | Variable;
        bg2: string | Variable;
        bg3: string | Variable;
        bg4: string | Variable;
        color: string | Variable;
        color2: string | Variable;
        color3: string | Variable;
        color4: string | Variable;
        borderColor: string | Variable;
        borderColor2: string | Variable;
        shadowColor: string | Variable;
        shadowColor2: string | Variable;
    };
};
declare type GenericShorthands = {};
declare type GenericMedia<K extends string = string> = {
    [key in K]: {
        [key: string]: number | string;
    };
};
export interface TamaguiCustomConfig {
}
export interface TamaguiConfig extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>, TamaguiCustomConfig {
}
export declare type CreateTamaguiConfig<A extends GenericTokens, B extends GenericThemes, C extends GenericShorthands, D extends GenericMedia> = Partial<Pick<ThemeProviderProps, 'defaultTheme' | 'disableRootThemeClass'>> & {
    tokens: A;
    themes: B;
    shorthands: C;
    media: D;
};
export declare type GenericTamaguiConfig = CreateTamaguiConfig<GenericTokens, GenericThemes, GenericShorthands, GenericMedia>;
export declare type ThemeObject = TamaguiConfig['themes'][keyof TamaguiConfig['themes']];
export declare type Tokens = TamaguiConfig['tokens'];
export declare type Shorthands = TamaguiConfig['shorthands'];
export declare type Media = TamaguiConfig['media'];
export declare type Themes = TamaguiConfig['themes'];
export declare type ThemeName = keyof Themes extends `${infer Prefix}-${string}` ? Prefix | keyof Themes : keyof Themes;
export declare type ThemeKeys = keyof ThemeObject;
export declare type ThemeKeyVariables = `$${ThemeKeys}`;
export declare type TamaguiInternalConfig<A extends GenericTokens = GenericTokens, B extends GenericThemes = GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia> = CreateTamaguiConfig<A, B, C, D> & {
    Provider: (props: TamaguiProviderProps) => any;
    themeParsed: {
        [key: string]: Variable;
    };
    tokensParsed: CreateTokens<Variable>;
    themeConfig: any;
    getCSS: () => string;
    parsed: boolean;
};
export declare type UnionableString = string & {};
export declare type UnionableNumber = number & {};
export declare type PropTypes<A extends StaticComponent> = A extends React.FunctionComponent<infer Props> ? Props : unknown;
export declare type GenericFont = {
    size: {
        [key: string | number]: number | Variable;
    };
    lineHeight: {
        [key: string | number]: number | Variable;
    };
    letterSpacing: {
        [key: string | number]: number | Variable;
    };
    weight: {
        [key: string | number]: string | Variable;
    };
    family: string | Variable;
};
export declare type MediaKeys = keyof Media;
export declare type MediaQueryObject = {
    [key: string]: string | number | string;
};
export declare type MediaQueryState = {
    [key in string]: boolean;
};
export declare type MediaQueryKey = keyof Media;
export declare type MediaProps<A> = {
    [key in `$${MediaQueryKey}`]?: A;
};
export declare type MediaQueries = {
    [key in MediaQueryKey]: MediaQueryObject;
};
export declare type ConfigureMediaQueryOptions = {
    queries?: MediaQueries;
    defaultActive?: MediaQueryKey[];
};
export declare type TransformStyleProps = {
    x?: number;
    y?: number;
    perspective?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    skewX?: string;
    skewY?: string;
    matrix?: number[];
    rotate?: string;
    rotateY?: string;
    rotateX?: string;
    rotateZ?: string;
};
declare type ComponentPropsBase = {
    className?: string;
    tag?: string;
    animated?: boolean;
    onHoverIn?: (e: MouseEvent) => any;
    onHoverOut?: (e: MouseEvent) => any;
    onPress?: (e: GestureResponderEvent) => any;
    onPressIn?: (e: GestureResponderEvent) => any;
    onPressOut?: (e: GestureResponderEvent) => any;
    onMouseEnter?: (e: GestureResponderEvent) => any;
    onMouseLeave?: (e: GestureResponderEvent) => any;
    space?: Tokens['space'][keyof Tokens['space']] | boolean | string | number;
    pointerEvents?: string;
};
declare type GetTokenFontKeysFor<A extends 'size' | 'weight' | 'letterSpacing' | 'family' | 'lineHeight'> = keyof Tokens['font'][keyof Tokens['font']][A];
export declare type SizeTokens = `$${keyof Tokens['size']}`;
export declare type FontTokens = `$${keyof Tokens['font']}`;
export declare type FontSizeTokens = `$${GetTokenFontKeysFor<'size'>}`;
export declare type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}`;
export declare type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}`;
export declare type FontLetterSpacingTokens = `$${GetTokenFontKeysFor<'letterSpacing'>}`;
export declare type SpaceTokens = `$${keyof Tokens['space']}`;
export declare type ColorTokens = `$${keyof Tokens['color']}`;
export declare type ZIndexTokens = `$${keyof Tokens['zIndex']}`;
declare type ThemeValue<A> = Omit<A, string> | UnionableString | Variable;
export declare type WithThemeValues<T extends object> = {
    [K in keyof T]: ThemeValue<T[K]> | (K extends ColorableKeys ? ThemeKeyVariables : K extends SizeKeys ? SizeTokens : K extends FontKeys ? FontTokens : K extends FontSizeKeys ? FontSizeTokens : K extends SpaceKeys ? SpaceTokens : K extends ColorKeys ? ColorTokens : K extends ZIndexKeys ? ZIndexTokens : K extends LineHeightKeys ? FontLineHeightTokens : K extends FontWeightKeys ? FontWeightTokens : K extends FontLetterSpacingKeys ? FontLetterSpacingTokens : {});
};
declare type WithShorthands<StyleProps> = {
    [Key in keyof Shorthands]?: Shorthands[Key] extends keyof StyleProps ? StyleProps[Shorthands[Key]] | null : undefined;
};
declare type WithThemeAndShorthands<A extends object> = WithThemeValues<A> & WithShorthands<WithThemeValues<A>>;
declare type WithThemeShorthandsAndPseudos<A extends object> = WithThemeAndShorthands<A> & {
    hoverStyle?: WithThemeAndShorthands<A> | null;
    pressStyle?: WithThemeAndShorthands<A> | null;
};
declare type WithThemeShorthandsPseudosAndMedia<A extends object> = WithThemeShorthandsAndPseudos<A> & MediaProps<WithThemeShorthandsAndPseudos<A>>;
declare type WebOnlyStyleProps = {
    cursor?: string;
    contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string;
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex';
    pointerEvents?: ViewProps['pointerEvents'];
};
export declare type StackStylePropsBase = Omit<ViewStyle, 'display' | 'backfaceVisibility' | 'elevation'> & TransformStyleProps & WebOnlyStyleProps;
export declare type StackStyleProps = WithThemeShorthandsPseudosAndMedia<StackStylePropsBase>;
export declare type StackProps = Omit<RNWInternalProps, 'children'> & Omit<ViewProps, 'display' | 'children'> & StackStyleProps & ComponentPropsBase & {
    ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any);
    children?: any | any[];
};
declare type TextStyleProps = WithThemeShorthandsPseudosAndMedia<Omit<TextStyle, 'display' | 'backfaceVisibility'> & TransformStyleProps & WebOnlyStyleProps>;
export declare type TextProps = Omit<ReactTextProps, 'style'> & TextStyleProps & ComponentPropsBase & {
    ellipse?: boolean;
    selectable?: boolean;
    textDecorationDistance?: number;
};
export declare type StaticComponent<Props = any, VariantProps = any, StaticConfParsed = StaticConfigParsed, ParentVariantProps = any> = React.FunctionComponent<Props> & {
    staticConfig: StaticConfParsed;
    variantProps?: VariantProps;
    extractable: <X>(a: X, opts?: StaticConfig) => X;
};
export declare type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
    initialWindowMetrics?: any;
    fallback?: any;
    children?: any;
};
export declare type RNWInternalProps = {
    accessibilityState?: {
        busy?: boolean;
        checked?: boolean | 'mixed';
        disabled?: boolean;
        expanded?: boolean;
        grabbed?: boolean;
        hidden?: boolean;
        invalid?: boolean;
        modal?: boolean;
        pressed?: boolean;
        readonly?: boolean;
        required?: boolean;
        selected?: boolean;
    };
    accessibilityValue?: {
        max?: number;
        min?: number;
        now?: number;
        text?: string;
    };
    children?: any;
    focusable?: boolean;
    nativeID?: string;
    onBlur?: (e: any) => void;
    onClick?: (e: any) => void;
    onClickCapture?: (e: any) => void;
    onContextMenu?: (e: any) => void;
    onFocus?: (e: any) => void;
    onKeyDown?: (e: any) => void;
    onKeyUp?: (e: any) => void;
    onMoveShouldSetResponder?: (e: any) => boolean;
    onMoveShouldSetResponderCapture?: (e: any) => boolean;
    onResponderEnd?: (e: any) => void;
    onResponderGrant?: (e: any) => void;
    onResponderMove?: (e: any) => void;
    onResponderReject?: (e: any) => void;
    onResponderRelease?: (e: any) => void;
    onResponderStart?: (e: any) => void;
    onResponderTerminate?: (e: any) => void;
    onResponderTerminationRequest?: (e: any) => boolean;
    onScrollShouldSetResponder?: (e: any) => boolean;
    onScrollShouldSetResponderCapture?: (e: any) => boolean;
    onSelectionChangeShouldSetResponder?: (e: any) => boolean;
    onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean;
    onStartShouldSetResponder?: (e: any) => boolean;
    onStartShouldSetResponderCapture?: (e: any) => boolean;
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
    testID?: string;
    dataSet?: Object;
    onMouseDown?: (e: any) => void;
    onMouseEnter?: (e: any) => void;
    onMouseLeave?: (e: any) => void;
    onMouseMove?: (e: any) => void;
    onMouseOver?: (e: any) => void;
    onMouseOut?: (e: any) => void;
    onMouseUp?: (e: any) => void;
    onScroll?: (e: any) => void;
    onTouchCancel?: (e: any) => void;
    onTouchCancelCapture?: (e: any) => void;
    onTouchEnd?: (e: any) => void;
    onTouchEndCapture?: (e: any) => void;
    onTouchMove?: (e: any) => void;
    onTouchMoveCapture?: (e: any) => void;
    onTouchStart?: (e: any) => void;
    onTouchStartCapture?: (e: any) => void;
    onWheel?: (e: any) => void;
    href?: string;
    hrefAttrs?: {
        download?: boolean;
        rel?: string;
        target?: string;
    };
};
export declare type StaticConfigParsed = StaticConfig & {
    parsed: true;
    propMapper: (key: string, value: any, theme: ThemeObject, props: any) => undefined | boolean | {
        [key: string]: any;
    };
    variantsParsed?: {
        [key: string]: {
            [key: string]: any;
        };
    };
};
export declare type StaticConfig = {
    Component?: StaticComponent;
    variants?: {
        [key: string]: {
            [key: string]: ((a: any, b: any) => any) | {
                [key: string]: any;
            };
        };
    };
    neverFlatten?: boolean | 'jsx';
    isText?: boolean;
    validStyles?: {
        [key: string]: boolean;
    };
    validPropsExtra?: {
        [key: string]: any;
    };
    defaultProps?: any;
    deoptProps?: Set<string>;
    ensureOverriddenProp?: {
        [key: string]: boolean;
    };
    isZStack?: boolean;
};
declare type ColorableKeys = 'color' | 'backgroundColor' | 'borderColor' | 'borderTopColor' | 'borderBottomColor' | 'borderLeftColor' | 'borderRightColor' | 'shadowColor';
declare type SizeKeys = 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight';
declare type FontKeys = 'fontFamily';
declare type FontSizeKeys = 'fontSize';
declare type FontWeightKeys = 'fontWeight';
declare type FontLetterSpacingKeys = 'letterSpacing';
declare type LineHeightKeys = 'lineHeight';
declare type ZIndexKeys = 'zIndex';
declare type ColorKeys = 'color' | 'backgroundColor' | 'borderColor' | 'borderBottomColor' | 'borderTopColor' | 'borderLeftColor' | 'borderRightColor';
declare type SpaceKeys = 'padding' | 'paddingHorizontal' | 'paddingVertical' | 'paddingLeft' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'paddingEnd' | 'paddingStart' | 'margin' | 'marginHorizontal' | 'marginVertical' | 'marginLeft' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight' | 'marginEnd' | 'marginStart' | 'x' | 'y' | 'scale' | 'scaleX' | 'scaleY' | 'borderTopEndRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderTopStartRadius' | 'borderBottomEndRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius' | 'borderBottomStartRadius' | 'borderBottomWidth' | 'borderLeftWidth' | 'borderRadius' | 'borderRightWidth' | 'borderTopEndRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderEndWidth' | 'borderStartWidth' | 'borderTopStartRadius' | 'borderTopWidth' | 'borderWidth' | 'left' | 'top' | 'right' | 'bottom' | 'shadowOffset';
export {};
//# sourceMappingURL=types.d.ts.map