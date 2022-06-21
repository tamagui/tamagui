import { Properties } from 'csstype';
import React from 'react';
import { GestureResponderEvent, Image, TextProps as ReactTextProps, Text, TextInput, TextStyle, View, ViewProps, ViewStyle } from 'react-native';
import { Variable } from './createVariable';
import { ResolveVariableTypes } from './helpers/createPropMapper';
import { RNWTextProps, RNWViewProps } from './types-rnw';
import { ThemeProviderProps } from './views/ThemeProvider';
export declare type SpaceFlexDirection = ViewStyle['flexDirection'] | 'both';
export declare type TamaguiElement = HTMLElement | View;
export declare type DebugProp = boolean | 'break' | 'verbose';
export declare type TamaguiComponentPropsBase = {
    asChild?: boolean;
    space?: SpaceTokens;
    spaceDirection?: SpaceFlexDirection;
    separator?: React.ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string;
    };
    animation?: AnimationProp;
    animateOnly?: string[];
    children?: any | any[];
    debug?: DebugProp;
    disabled?: boolean;
    className?: string;
    id?: string;
    tag?: string;
    theme?: ThemeName | null;
    componentName?: string;
    forceStyle?: 'hover' | 'press' | 'focus';
    onHoverIn?: (e: MouseEvent) => any;
    onHoverOut?: (e: MouseEvent) => any;
    onPress?: (e: GestureResponderEvent) => any;
    onPressIn?: (e: GestureResponderEvent) => any;
    onPressOut?: (e: GestureResponderEvent) => any;
    onMouseEnter?: (e: MouseEvent) => any;
    onMouseLeave?: (e: MouseEvent) => any;
    onMouseDown?: (e: MouseEvent) => any;
    userSelect?: Properties['userSelect'];
    cursor?: Properties['cursor'];
};
export declare type ReactComponentWithRef<Props, Ref> = React.ForwardRefExoticComponent<Props & React.RefAttributes<Ref>>;
export declare type ConfigListener = (conf: TamaguiInternalConfig) => void;
export declare type VariableVal = number | string | Variable;
export declare type VariableColorVal = string | Variable;
declare type GenericKey = string | number | symbol;
export interface CreateTokens<Val extends VariableVal = VariableVal> {
    color: {
        [key: GenericKey]: Val;
    };
    space: {
        [key: GenericKey]: Val;
    };
    size: {
        [key: GenericKey]: Val;
    };
    radius: {
        [key: GenericKey]: Val;
    };
    zIndex: {
        [key: GenericKey]: Val;
    };
}
export declare type TamaguiBaseTheme = {
    background: VariableColorVal;
    backgroundHover: VariableColorVal;
    backgroundPress: VariableColorVal;
    backgroundFocus: VariableColorVal;
    color: VariableColorVal;
    colorHover: VariableColorVal;
    colorPress: VariableColorVal;
    colorFocus: VariableColorVal;
    borderColor: VariableColorVal;
    borderColorHover: VariableColorVal;
    borderColorPress: VariableColorVal;
    borderColorFocus: VariableColorVal;
    shadowColor: VariableColorVal;
    shadowColorHover: VariableColorVal;
    shadowColorPress: VariableColorVal;
    shadowColorFocus: VariableColorVal;
};
declare type GenericTokens = CreateTokens;
declare type GenericThemes = {
    [key: string]: (Partial<TamaguiBaseTheme> & {
        [key: string]: VariableVal;
    });
};
declare type GenericShorthands = {};
declare type GenericMedia<K extends string = string> = {
    [key in K]: {
        [key: string]: number | string;
    };
};
export declare type GenericFonts = {
    [key: string]: GenericFont;
};
declare type GenericAnimations = {
    [key: string]: string | {
        [key: string]: any;
    };
};
export interface TamaguiCustomConfig {
}
export interface TamaguiConfig extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>, TamaguiCustomConfig {
}
export declare type CreateTamaguiConfig<A extends GenericTokens, B extends GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia, E extends GenericAnimations = GenericAnimations, F extends GenericFonts = GenericFonts> = Partial<Pick<ThemeProviderProps, 'defaultTheme' | 'disableRootThemeClass'>> & {
    fonts: F;
    tokens: A;
    themes: B;
    shorthands: C;
    media: D;
    animations: AnimationDriver<E>;
    defaultProps?: Record<string, Object>;
};
export declare type GenericTamaguiConfig = CreateTamaguiConfig<GenericTokens, GenericThemes, GenericShorthands, GenericMedia, GenericAnimations, GenericFonts>;
export declare type ThemeObject = TamaguiConfig['themes'][keyof TamaguiConfig['themes']];
export declare type Tokens = TamaguiConfig['tokens'];
export declare type Shorthands = TamaguiConfig['shorthands'];
export declare type Media = TamaguiConfig['media'];
export declare type Themes = TamaguiConfig['themes'];
export declare type ThemeName = GetAltThemeNames<keyof Themes>;
export declare type ThemeKeys = keyof ThemeObject;
export declare type ThemeTokens = `$${ThemeKeys}`;
export declare type AnimationKeys = Omit<GetAnimationKeys<TamaguiConfig>, number>;
declare type GetAltThemeNames<S> = (S extends `${string}_${infer Alt}` ? GetAltThemeNames<Alt> : S) | S;
export declare type TamaguiInternalConfig<A extends GenericTokens = GenericTokens, B extends GenericThemes = GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia, E extends GenericAnimations = GenericAnimations, F extends GenericFonts = GenericFonts> = CreateTamaguiConfig<A, B, C, D, E, F> & {
    Provider: (props: TamaguiProviderProps) => any;
    tokensParsed: CreateTokens<Variable>;
    themeConfig: any;
    fontsParsed: GenericFonts;
    getCSS: () => string;
    parsed: boolean;
    themeClassNameOnRoot?: boolean;
};
export declare type GetAnimationKeys<A extends GenericTamaguiConfig> = keyof A['animations']['animations'];
export declare type UnionableString = string & {};
export declare type UnionableNumber = number & {};
export declare type PropTypes<A extends TamaguiComponent> = A extends React.FunctionComponent<infer Props> ? Props : unknown;
export declare type GenericFont<Key extends number | string = number | string> = {
    size: {
        [key in Key]: number | Variable;
    };
    lineHeight: Partial<{
        [key in Key]: number | Variable;
    }>;
    letterSpacing: Partial<{
        [key in Key]: number | Variable;
    }>;
    weight: Partial<{
        [key in Key]: number | string | Variable;
    }>;
    family: string | Variable;
    style?: Partial<{
        [key in Key]: TextStyle['fontStyle'] | Variable;
    }>;
    transform?: Partial<{
        [key in Key]: TextStyle['textTransform'] | Variable;
    }>;
    color?: Partial<{
        [key in Key]: string | Variable;
    }>;
};
export declare type MediaKeys = keyof Media;
export declare type MediaQueryObject = {
    [key: string]: string | number | string;
};
export declare type MediaQueryKey = keyof Media;
export declare type MediaPropKeys = `$${MediaQueryKey}`;
export declare type MediaQueryState = {
    [key in MediaPropKeys]: boolean;
};
export declare type MediaProps<A> = {
    [key in MediaPropKeys]?: A;
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
export declare type AnimationConfigType = any;
export declare type AnimationProp = AnimationKeys | {
    [key: string]: AnimationKeys | {
        type: AnimationKeys;
        [key: string]: any;
    };
} | [
    AnimationKeys,
    {
        [key: string]: AnimationKeys | {
            type?: AnimationKeys;
            [key: string]: any;
        };
    }
];
declare type GetTokenFontKeysFor<A extends 'size' | 'weight' | 'letterSpacing' | 'family' | 'lineHeight' | 'transform' | 'style' | 'color'> = keyof TamaguiConfig['fonts']['body'][A];
declare type GetTokenString<A> = A extends string | number ? `$${A}` : `$${string}`;
export declare type SizeTokens = GetTokenString<keyof Tokens['size']> | number;
export declare type SpaceTokens = GetTokenString<keyof Tokens['space']> | number | boolean;
export declare type ColorTokens = GetTokenString<keyof Tokens['color']> | GetTokenString<keyof ThemeObject> | CSSColorNames;
export declare type ZIndexTokens = GetTokenString<keyof Tokens['zIndex']> | number;
export declare type RadiusTokens = GetTokenString<keyof Tokens['radius']> | number;
export declare type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>;
export declare type FontSizeTokens = GetTokenString<GetTokenFontKeysFor<'size'>> | number;
export declare type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}` | number;
export declare type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}` | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`;
export declare type FontColorTokens = `$${GetTokenFontKeysFor<'color'>}` | number;
export declare type FontLetterSpacingTokens = `$${GetTokenFontKeysFor<'letterSpacing'>}` | number;
export declare type FontStyleTokens = `$${GetTokenFontKeysFor<'style'>}` | TextStyle['fontStyle'];
export declare type FontTransformTokens = `$${GetTokenFontKeysFor<'transform'>}` | TextStyle['textTransform'];
export declare type ThemeValueByCategory<K extends string | number | symbol> = K extends 'theme' ? ThemeTokens : K extends 'size' ? SizeTokens : K extends 'font' ? FontTokens : K extends 'fontSize' ? FontSizeTokens : K extends 'space' ? SpaceTokens : K extends 'color' ? ColorTokens : K extends 'zIndex' ? ZIndexTokens : K extends 'lineHeight' ? FontLineHeightTokens : K extends 'fontWeight' ? FontWeightTokens : K extends 'letterSpacing' ? FontLetterSpacingTokens : {};
declare type FontKeys = 'fontFamily';
declare type FontSizeKeys = 'fontSize';
declare type FontWeightKeys = 'fontWeight';
declare type FontLetterSpacingKeys = 'letterSpacing';
declare type LineHeightKeys = 'lineHeight';
declare type ZIndexKeys = 'zIndex';
export declare type ThemeValueGet<K extends string | number | symbol> = K extends 'theme' ? ThemeTokens : K extends SizeKeys ? SizeTokens : K extends FontKeys ? FontTokens : K extends FontSizeKeys ? FontSizeTokens : K extends SpaceKeys ? K extends 'shadowOffset' ? {
    width: SpaceTokens;
    height: SpaceTokens;
} : SpaceTokens : K extends ColorKeys ? ColorTokens : K extends ZIndexKeys ? ZIndexTokens : K extends LineHeightKeys ? FontLineHeightTokens : K extends FontWeightKeys ? FontWeightTokens : K extends FontLetterSpacingKeys ? FontLetterSpacingTokens : never;
export declare type ThemeValueFallback = UnionableString | Variable;
export declare type WithThemeValues<T extends object> = {
    [K in keyof T]: ThemeValueGet<K> extends never ? T[K] : ThemeValueGet<K> | Exclude<T[K], string> | ThemeValueFallback;
};
export declare type WithShorthands<StyleProps> = {
    [Key in keyof Shorthands]?: Shorthands[Key] extends keyof StyleProps ? StyleProps[Shorthands[Key]] | null : undefined;
};
export declare type PseudoProps<A> = {
    hoverStyle?: A | null;
    pressStyle?: A | null;
    focusStyle?: A | null;
    exitStyle?: A | null;
    enterStyle?: A | null;
};
export declare type PseudoPropKeys = keyof PseudoProps<any>;
export declare type PseudoStyles = {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
    enterStyle?: ViewStyle;
    exitStyle?: ViewStyle;
};
declare type WithThemeAndShorthands<A extends object> = WithThemeValues<A> & WithShorthands<WithThemeValues<A>>;
declare type WithThemeShorthandsAndPseudos<A extends object> = WithThemeAndShorthands<A> & PseudoProps<WithThemeAndShorthands<A>>;
declare type WithThemeShorthandsPseudosMediaAnimation<A extends object> = WithThemeShorthandsAndPseudos<A> & MediaProps<WithThemeShorthandsAndPseudos<A>>;
declare type WebOnlyStyleProps = {
    cursor?: string;
    contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string;
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex';
    pointerEvents?: ViewProps['pointerEvents'];
};
export declare type StackStylePropsBase = Omit<ViewStyle, 'display' | 'backfaceVisibility' | 'elevation'> & TransformStyleProps & WebOnlyStyleProps;
export declare type StackPropsBaseShared = Omit<ViewProps, 'display' | 'children'> & RNWViewProps & TamaguiComponentPropsBase;
export declare type StackStyleProps = WithThemeShorthandsPseudosMediaAnimation<StackStylePropsBase>;
export declare type StackPropsBase = StackPropsBaseShared & WithThemeAndShorthands<StackStylePropsBase>;
export declare type StackProps = StackPropsBaseShared & StackStyleProps;
export declare type GestureReponderEvent = Exclude<View['props']['onResponderMove'], void> extends (event: infer Event) => void ? Event : never;
export declare type TextStylePropsBase = Omit<TextStyle, 'display' | 'backfaceVisibility'> & TransformStyleProps & WebOnlyStyleProps & {
    ellipse?: boolean;
    selectable?: boolean;
    textDecorationDistance?: number;
    textOverflow?: Properties['textOverflow'];
    whiteSpace?: Properties['whiteSpace'];
    wordWrap?: Properties['wordWrap'];
};
export declare type TextPropsBaseShared = Omit<ReactTextProps, 'children'> & RNWTextProps & TamaguiComponentPropsBase;
export declare type TextPropsBase = TextPropsBaseShared & WithThemeAndShorthands<TextStylePropsBase>;
export declare type TextStyleProps = WithThemeShorthandsPseudosMediaAnimation<TextStylePropsBase>;
export declare type TextProps = TextPropsBaseShared & TextStyleProps;
export declare type ViewOrTextProps = WithThemeShorthandsPseudosMediaAnimation<Omit<TextStylePropsBase, keyof StackStylePropsBase> & StackStylePropsBase>;
export declare type TamaguiComponent<Props = any, Ref = any, BaseProps = {}, VariantProps = {}> = ReactComponentWithRef<Props, Ref> & StaticComponentObject;
declare type StaticComponentObject = {
    staticConfig: StaticConfig;
    extractable: <X>(a: X, opts?: Partial<StaticConfig>) => X;
};
export declare type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
    disableInjectCSS?: boolean;
    children?: React.ReactNode;
};
export declare type PropMapper = (key: string, value: any, theme: ThemeObject, props: Record<string, any>, state: Partial<SplitStyleState>, avoidDefaultProps?: boolean, debug?: DebugProp) => undefined | [string, any][];
export declare type StaticConfigParsed = StaticConfig & {
    parsed: true;
    propMapper: PropMapper;
    variantsParsed?: {
        [key: string]: {
            [key: string]: any;
        };
    };
};
export declare type GenericVariantDefinitions = {
    [key: string]: {
        [key: string]: ((a: any, b: any) => any) | {
            [key: string]: any;
        };
    };
};
export declare type StaticConfig = {
    Component?: React.FunctionComponent<any> & StaticComponentObject;
    variants?: GenericVariantDefinitions;
    componentName?: string;
    neverFlatten?: boolean | 'jsx';
    isText?: boolean;
    isInput?: boolean;
    isImage?: boolean;
    validStyles?: {
        [key: string]: boolean;
    };
    defaultProps?: any;
    deoptProps?: Set<string>;
    inlineProps?: Set<string>;
    inlineWhenUnflattened?: Set<string>;
    ensureOverriddenProp?: {
        [key: string]: boolean;
    };
    isZStack?: boolean;
    defaultVariants?: {
        [key: string]: any;
    };
    isReactNativeWeb?: boolean;
    reactNativeWebComponent?: any;
    memo?: boolean;
    isTamagui?: boolean;
    isExtractable?: boolean;
    parentNames?: string[];
};
export declare type StylableComponent = TamaguiComponent | React.Component | React.ForwardRefExoticComponent<any> | (new (props: any) => any) | typeof View | typeof Text | typeof TextInput | typeof Image;
export declare type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, infer BaseProps> ? BaseProps : never;
export declare type GetProps<A extends StylableComponent> = A extends TamaguiComponent<infer Props> ? Props : A extends React.Component<infer Props> ? GetGenericComponentTamaguiProps<Props> : A extends new (props: infer Props) => any ? GetGenericComponentTamaguiProps<Props> : {};
declare type GetGenericComponentTamaguiProps<P> = P & Omit<'textAlign' extends keyof P ? TextProps : StackProps, keyof P>;
export declare type SpreadKeys = '...fontSize' | '...fontStyle' | '...fontTransform' | '...lineHeight' | '...letterSpacing' | '...size' | '...color' | '...zIndex' | '...theme' | '...radius';
export declare type VariantDefinitions<Parent extends StylableComponent = TamaguiComponent, MyProps extends Object = GetProps<Parent>, Val = any> = VariantDefinitionFromProps<MyProps, Val>;
export declare type VariantDefinitionFromProps<MyProps, Val> = MyProps extends Object ? {
    [propName: string]: VariantSpreadFunction<MyProps, Val> | ({
        [Key in SpreadKeys]?: Key extends '...fontSize' ? FontSizeVariantSpreadFunction<MyProps> : Key extends '...size' ? SizeVariantSpreadFunction<MyProps> : Key extends '...color' ? ColorVariantSpreadFunction<MyProps> : Key extends '...lineHeight' ? FontLineHeightVariantSpreadFunction<MyProps> : Key extends '...fontTransform' ? FontTransformVariantSpreadFunction<MyProps> : Key extends '...fontStyle' ? FontStyleVariantSpreadFunction<MyProps> : Key extends '...letterSpacing' ? FontLetterSpacingVariantSpreadFunction<MyProps> : Key extends '...zIndex' ? ZIndexVariantSpreadFunction<MyProps> : Key extends '...radius' ? RadiusVariantSpreadFunction<MyProps> : Key extends '...theme' ? ThemeVariantSpreadFunction<MyProps> : never;
    } & {
        [Key in string | number]?: MyProps | VariantSpreadFunction<MyProps, Val>;
    } & {
        [Key in VariantTypeKeys]?: Key extends ':number' ? VariantSpreadFunction<MyProps, number> : Key extends ':boolean' ? VariantSpreadFunction<MyProps, boolean> : Key extends ':string' ? VariantSpreadFunction<MyProps, string> : never;
    });
} : never;
export declare type GenericStackVariants = VariantDefinitionFromProps<StackProps, any>;
export declare type GenericTextVariants = VariantDefinitionFromProps<StackProps, any>;
export declare type GetVariantProps<Variants> = {
    [Key in keyof Variants]?: Variants[Key] extends VariantSpreadFunction<any, infer Val> ? Val : GetVariantValues<keyof Variants[Key]>;
};
export declare type VariantSpreadExtras<Props> = {
    fonts: TamaguiConfig['fonts'];
    tokens: TamaguiConfig['tokens'];
    theme: Themes extends {
        [key: string]: infer B;
    } ? B : unknown;
    props: Props;
};
declare type PropLike = {
    [key: string]: any;
};
export declare type VariantSpreadFunction<Props extends PropLike, Val = any> = (val: Val, config: VariantSpreadExtras<Props>) => {
    [Key in keyof Props]: Props[Key] | Variable;
} | null | undefined;
export declare type VariantTypeKeys = ':string' | ':boolean' | ':number';
export declare type GetVariantValues<Key> = Key extends `...${infer VariantSpread}` ? ThemeValueByCategory<VariantSpread> : Key extends 'true' | 'false' ? boolean : Key extends ':string' ? string : Key extends ':boolean' ? boolean : Key extends ':number' ? number : Key;
export declare type FontSizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontSizeTokens>;
export declare type SizeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, SizeTokens>;
export declare type ColorVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ColorTokens>;
export declare type FontLineHeightVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontLineHeightTokens>;
export declare type FontLetterSpacingVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontLetterSpacingTokens>;
export declare type FontStyleVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontStyleTokens>;
export declare type FontTransformVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontTransformTokens>;
export declare type ZIndexVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ZIndexTokens>;
export declare type RadiusVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, RadiusTokens>;
export declare type ThemeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ThemeTokens>;
declare type SizeKeys = 'width' | 'height' | 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight' | 'shadowRadius';
declare type ColorKeys = 'color' | 'backgroundColor' | 'borderColor' | 'borderBottomColor' | 'borderTopColor' | 'borderLeftColor' | 'borderRightColor' | 'shadowColor' | 'textShadowColor';
declare type SpaceKeys = 'space' | 'padding' | 'paddingHorizontal' | 'paddingVertical' | 'paddingLeft' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'paddingEnd' | 'paddingStart' | 'margin' | 'marginHorizontal' | 'marginVertical' | 'marginLeft' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight' | 'marginEnd' | 'marginStart' | 'x' | 'y' | 'scale' | 'scaleX' | 'scaleY' | 'borderTopEndRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderTopStartRadius' | 'borderBottomEndRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius' | 'borderBottomStartRadius' | 'borderBottomWidth' | 'borderLeftWidth' | 'borderRadius' | 'borderRightWidth' | 'borderTopEndRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderEndWidth' | 'borderStartWidth' | 'borderTopStartRadius' | 'borderTopWidth' | 'borderWidth' | 'left' | 'top' | 'right' | 'bottom' | 'shadowOffset';
declare type CSSColorNames = 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'honeydew' | 'hotpink' | 'indianred ' | 'indigo  ' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgrey' | 'lightgreen' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke' | 'yellow' | 'yellowgreen';
export declare type TamaguiComponentState = {
    hover: boolean;
    press: boolean;
    pressIn: boolean;
    focus: boolean;
    mounted: boolean;
    animation?: null | {
        style?: any;
        avoidClasses?: boolean;
    };
};
export declare type SplitStyleState = TamaguiComponentState & {
    noClassNames?: boolean;
    dynamicStylesInline?: boolean;
    resolveVariablesAs?: ResolveVariableTypes;
    fallbackProps?: Record<string, any>;
};
declare type AnimationConfig = {
    [key: string]: any;
};
export declare type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
    avoidClasses?: boolean;
    useAnimations: UseAnimationHook;
    animations: A;
    View?: any;
    Text?: any;
};
export declare type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>;
export declare type UseAnimationHelpers = {
    staticConfig: StaticConfigParsed;
    getStyle: (props?: {
        isEntering?: boolean;
        exitVariant?: string | null;
        enterVariant?: string | null;
    }) => ViewStyle;
    state: SplitStyleState;
    pseudos: PseudoProps<ViewStyle>;
    onDidAnimate?: any;
    delay?: number;
};
export declare type UseAnimationHook = (props: UseAnimationProps, helpers: UseAnimationHelpers) => {
    style?: StackStylePropsBase | StackStylePropsBase[];
    safeToUnmount?: () => void;
};
export {};
//# sourceMappingURL=types.d.ts.map