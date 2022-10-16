import type { GestureResponderEvent, Image, PressableProps, TextProps as ReactTextProps, Text, TextInput, TextStyle, View, ViewProps, ViewStyle } from '@tamagui/types-react-native';
import type { Properties } from 'csstype';
import type { Component, ForwardRefExoticComponent, FunctionComponent, ReactNode, RefAttributes, RefObject } from 'react';
import type { Variable } from './createVariable';
import type { ResolveVariableTypes } from './helpers/createPropMapper';
import type { TamaguiReactElement } from './static';
import type { RNWTextProps, RNWViewProps } from './types-rnw';
import type { FontLanguageProps } from './views/FontLanguage.types';
import type { ThemeProviderProps } from './views/ThemeProvider';
export declare type SpaceDirection = 'vertical' | 'horizontal' | 'both';
export declare type TamaguiElement = HTMLElement | View;
export declare type DebugProp = boolean | 'break' | 'verbose';
export declare type TamaguiComponentPropsBase = {
    hitSlop?: PressableProps['hitSlop'];
    asChild?: boolean;
    space?: SpaceTokens | null;
    spaceDirection?: SpaceDirection;
    separator?: ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string;
    };
    animation?: AnimationProp;
    animateOnly?: string[];
    children?: any | any[];
    debug?: DebugProp;
    disabled?: boolean;
    className?: string;
    themeShallow?: boolean;
    id?: string;
    tag?: string;
    theme?: ThemeName | null;
    componentName?: string;
    /**
     * Forces the pseudo style state to be on
     */
    forceStyle?: 'hover' | 'press' | 'focus';
    onHoverIn?: (e: MouseEvent) => any;
    onHoverOut?: (e: MouseEvent) => any;
    onPress?: (e: GestureResponderEvent) => any;
    onPressIn?: (e: GestureResponderEvent) => any;
    onPressOut?: (e: GestureResponderEvent) => any;
    onMouseEnter?: (e: MouseEvent) => any;
    onMouseLeave?: (e: MouseEvent) => any;
    onMouseDown?: (e: MouseEvent) => any;
};
export declare type ReactComponentWithRef<Props, Ref> = ForwardRefExoticComponent<Props & RefAttributes<Ref>>;
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
declare type AllStyleKeys = keyof StackStylePropsBase | keyof TextStylePropsBase;
export declare type CreateShorthands = {
    [key: string]: AllStyleKeys;
};
export declare type GenericShorthands = {};
declare type GenericMedia = {
    [key: string]: {
        [key: string]: number | string;
    };
};
export declare type GenericFonts = Record<string, GenericFont>;
declare type GenericAnimations = {
    [key: string]: string | {
        [key: string]: any;
    } | any[];
};
export interface TamaguiCustomConfig {
}
export interface TamaguiConfig extends Omit<GenericTamaguiConfig, keyof TamaguiCustomConfig>, TamaguiCustomConfig {
}
export declare type CreateTamaguiConfig<A extends GenericTokens, B extends GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia, E extends GenericAnimations = GenericAnimations, F extends GenericFonts = GenericFonts> = {
    fonts: RemoveLanguagePostfixes<F>;
    fontLanguages: GetLanguagePostfixes<F> extends never ? string[] : GetLanguagePostfixes<F>[];
    tokens: A;
    themes: {
        [Name in keyof B]: {
            [Key in keyof B[Name]]: Variable;
        };
    };
    shorthands: C;
    media: D;
    animations: AnimationDriver<E>;
};
declare type GetLanguagePostfix<Set> = Set extends string ? Set extends `${string}_${infer Postfix}` ? Postfix : never : never;
declare type OmitLanguagePostfix<Set> = Set extends string ? Set extends `${infer Prefix}_${string}` ? Prefix : Set : never;
declare type RemoveLanguagePostfixes<F extends GenericFonts> = {
    [Key in OmitLanguagePostfix<keyof F>]: F[Key];
};
declare type GetLanguagePostfixes<F extends GenericFonts> = GetLanguagePostfix<keyof F>;
declare type ConfProps<A extends GenericTokens, B extends GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia, E extends GenericAnimations = GenericAnimations, F extends GenericFonts = GenericFonts> = {
    tokens: A;
    themes: B;
    shorthands?: C;
    media?: D;
    animations?: AnimationDriver<E>;
    fonts: F;
};
export declare type InferTamaguiConfig<Conf> = Conf extends ConfProps<infer A, infer B, infer C, infer D, infer E, infer F> ? TamaguiInternalConfig<A, B, C, D, E, F> : unknown;
export declare type GenericTamaguiConfig = CreateTamaguiConfig<GenericTokens, GenericThemes, GenericShorthands, GenericMedia, GenericAnimations, GenericFonts>;
export declare type ThemeDefinition = TamaguiConfig['themes'][keyof TamaguiConfig['themes']];
export declare type ThemeKeys = keyof ThemeDefinition;
export declare type ThemeParsed = {
    [key in ThemeKeys]: Variable<any>;
};
export declare type Tokens = TamaguiConfig['tokens'];
export declare type Shorthands = TamaguiConfig['shorthands'];
export declare type Media = TamaguiConfig['media'];
export declare type Themes = TamaguiConfig['themes'];
export declare type ThemeName = GetAltThemeNames<keyof Themes>;
export declare type ThemeTokens = `$${ThemeKeys}`;
export declare type AnimationKeys = TamaguiConfig['animations'] extends AnimationDriver<infer Config> ? keyof Config : string;
export declare type FontLanguages = ArrayIntersection<TamaguiConfig['fontLanguages']>;
declare type ArrayIntersection<A extends any[]> = A[keyof A];
declare type GetAltThemeNames<S> = (S extends `${string}_${infer Alt}` ? GetAltThemeNames<Alt> : S) | S;
declare type SpacerPropsBase = {
    size?: number | SpaceTokens | null;
    flex?: boolean | number;
    direction?: SpaceDirection;
};
declare type SpacerOwnProps = SpacerPropsBase & WithThemeShorthandsPseudosMediaAnimation<SpacerPropsBase>;
export declare type SpacerProps = Omit<StackProps, 'flex' | 'direction' | 'size'> & SpacerOwnProps;
export declare type CreateTamaguiProps = {
    native?: any;
    shorthands?: CreateShorthands;
    media?: GenericTamaguiConfig['media'];
    animations?: AnimationDriver<any>;
    fonts: GenericTamaguiConfig['fonts'];
    tokens: GenericTamaguiConfig['tokens'];
    themes: {
        [key: string]: {
            [key: string]: string | number | Variable;
        };
    };
    defaultTheme?: string;
    /**
     * *Advanced use case* For all CSS extracted views, this has no effect.
     *
     * For SSR compatibility on the web, Tamagui will render once with the settings
     * from `mediaQueryDefaultActive` set for all media queries. Then, it will render
     * again after the initial render using the proper media query values. This is so that
     * hydration will match perfectly with the server.
     *
     * Setting disableSSR will avoid this second render by setting the media query state
     * to the actual browser dimensions on initial load. This is only useful for client-only
     * apps.
     *
     */
    disableSSR?: boolean;
    /**
     * Disable inserting a theme class in the DOM or context, allowing you to manually place it higher.
     * For custom use cases like integration with next-theme.
     */
    disableRootThemeClass?: boolean;
    defaultProps?: Record<string, any> & {
        Stack?: StackProps;
        Text?: TextProps;
        Spacer?: SpacerProps;
    };
    mediaQueryDefaultActive?: Record<MediaQueryKey, boolean>;
    cssStyleSeparator?: string;
    maxDarkLightNesting?: number;
    shouldAddPrefersColorThemes?: boolean;
    themeClassNameOnRoot?: boolean;
};
export declare type TamaguiInternalConfig<A extends GenericTokens = GenericTokens, B extends GenericThemes = GenericThemes, C extends GenericShorthands = GenericShorthands, D extends GenericMedia = GenericMedia, E extends GenericAnimations = GenericAnimations, F extends GenericFonts = GenericFonts> = Omit<CreateTamaguiProps, keyof GenericTamaguiConfig> & CreateTamaguiConfig<A, B, C, D, E, F> & {
    tokensParsed: CreateTokens<Variable>;
    themeConfig: any;
    fontsParsed: GenericFonts;
    getCSS: () => string;
    parsed: boolean;
    inverseShorthands: Record<string, string>;
};
export declare type GetAnimationKeys<A extends GenericTamaguiConfig> = keyof A['animations'];
export declare type UnionableString = string & {};
export declare type UnionableNumber = number & {};
export declare type PropTypes<A extends TamaguiComponent> = A extends FunctionComponent<infer Props> ? Props : unknown;
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
    face?: {
        [key in FontWeightSteps]: {
            normal?: string;
            italic?: string;
        };
    };
};
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
export declare type ColorTokens = GetTokenString<keyof Tokens['color']> | GetTokenString<keyof ThemeParsed> | CSSColorNames;
export declare type ZIndexTokens = GetTokenString<keyof Tokens['zIndex']> | number;
export declare type RadiusTokens = GetTokenString<keyof Tokens['radius']> | number;
export declare type FontTokens = GetTokenString<keyof TamaguiConfig['fonts']>;
export declare type FontSizeTokens = GetTokenString<GetTokenFontKeysFor<'size'>> | number;
export declare type FontLineHeightTokens = `$${GetTokenFontKeysFor<'lineHeight'>}` | number;
export declare type FontWeightSteps = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}00`;
export declare type FontWeightTokens = `$${GetTokenFontKeysFor<'weight'>}` | FontWeightSteps;
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
/**
 * Base style-only props (no media, pseudo):
 */
declare type StylePropsWebOnly = {
    pointerEvents?: ViewProps['pointerEvents'];
    cursor?: Properties['cursor'];
    contain?: Properties['contain'];
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex';
    userSelect?: Properties['userSelect'];
};
export declare type StackStylePropsBase = Omit<ViewStyle, 'display' | 'backfaceVisibility' | 'elevation'> & TransformStyleProps & StylePropsWebOnly;
export declare type TextStylePropsBase = Omit<TextStyle, 'display' | 'backfaceVisibility'> & TransformStyleProps & StylePropsWebOnly & {
    ellipse?: boolean;
    selectable?: boolean;
    textDecorationDistance?: number;
    textOverflow?: Properties['textOverflow'];
    whiteSpace?: Properties['whiteSpace'];
    wordWrap?: Properties['wordWrap'];
};
export declare type StackNonStyleProps = Omit<ViewProps, 'display' | 'children'> & RNWViewProps & TamaguiComponentPropsBase;
export declare type StackStyleProps = WithThemeShorthandsPseudosMediaAnimation<StackStylePropsBase>;
export declare type StackPropsBase = StackNonStyleProps & WithThemeAndShorthands<StackStylePropsBase>;
export declare type StackProps = StackNonStyleProps & StackStyleProps;
export declare type TextNonStyleProps = Omit<ReactTextProps, 'children'> & RNWTextProps & TamaguiComponentPropsBase;
export declare type TextPropsBase = TextNonStyleProps & WithThemeAndShorthands<TextStylePropsBase>;
export declare type TextStyleProps = WithThemeShorthandsPseudosMediaAnimation<TextStylePropsBase>;
export declare type TextProps = TextNonStyleProps & TextStyleProps;
export declare type ViewOrTextProps = WithThemeShorthandsPseudosMediaAnimation<Omit<TextStylePropsBase, keyof StackStylePropsBase> & StackStylePropsBase>;
export declare type TamaguiComponent<Props = any, Ref = any, BaseProps = {}, VariantProps = {}> = ReactComponentWithRef<Props, Ref> & StaticComponentObject;
declare type StaticComponentObject = {
    staticConfig: StaticConfig;
    extractable: <X>(a: X, opts?: Partial<StaticConfig>) => X;
};
export declare type TamaguiProviderProps = Partial<Omit<ThemeProviderProps, 'children'>> & {
    config: TamaguiInternalConfig;
    disableInjectCSS?: boolean;
    children?: ReactNode;
};
export declare type PropMapper = (key: string, value: any, theme: ThemeParsed, props: Record<string, any>, state: Partial<SplitStyleState>, languageContext?: FontLanguageProps, avoidDefaultProps?: boolean, debug?: DebugProp) => undefined | [string, any][];
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
    Component?: FunctionComponent<any> & StaticComponentObject;
    variants?: GenericVariantDefinitions;
    /**
     * Used for applying sub theme style
     */
    componentName?: string;
    /**
     * (compiler) If you need to pass context or something, prevents from ever
     * flattening. The 'jsx' option means it will never flatten. if you
     * pass JSX as a children (if its purely string, it will still flatten).
     */
    neverFlatten?: boolean | 'jsx';
    /**
     * Determines ultimate output tag (Text vs View)
     */
    isText?: boolean;
    /**
     * Attempts to attach focus styles at runtime (useful for native)
     */
    isInput?: boolean;
    /**
     * Which style keys are allowed to be extracted.
     */
    validStyles?: {
        [key: string]: boolean;
    };
    /**
     * Same as React.defaultProps, be sure to sync
     */
    defaultProps: Record<string, any>;
    /**
     * (compiler) If these props are encountered, bail on all optimization.
     */
    deoptProps?: Set<string>;
    /**
     * (compiler) If these props are encountered, leave them un-extracted.
     */
    inlineProps?: Set<string>;
    /**
     * (compiler) If not flattening, leave this prop as original value.
     * Only applies to style attributes
     */
    inlineWhenUnflattened?: Set<string>;
    /**
     * (compiler) A bit odd, only for more advanced heirarchies.
     * Indicates that the component will set this prop so the
     * static extraction can ensure it sets them to ={undefined}
     * so they get overriddent. In the future, this can be smarter.
     */
    ensureOverriddenProp?: {
        [key: string]: boolean;
    };
    /**
     * Auto-detected, but can ovverride. Wraps children to space them on top
     */
    isZStack?: boolean;
    /**
     * Merges into defaultProps later on, used internally yonly
     */
    defaultVariants?: {
        [key: string]: any;
    };
    /**
     * Auto-detect, but can ovverride, passes styles properly to react-native-web
     */
    isReactNativeWeb?: boolean;
    /**
     * Used internally to keep reference to the original rnw component
     */
    reactNativeWebComponent?: any;
    /**
     * Memoize the component
     */
    memo?: boolean;
    /**
     * Auto-detect, but can ovverride, passes styles properly to react-native-web
     */
    isTamagui?: boolean;
    /**
     * Used internally to handle extractable HoC separate
     */
    isHOC?: boolean;
    /**
     * Used insternally to attach default props to names
     */
    parentNames?: string[];
    /**
     * By default if styled() doesn't recognize a parent Tamagui compoent or specific react-native views,
     * it will assume the passed in component only accepts style={} for react-native compatibility.
     * Setting `acceptsClassName: true` indicates Tamagui can pass in className props.
     */
    acceptsClassName?: boolean;
};
/**
 * --------------------------------------------
 *   variants
 * --------------------------------------------
 */
export declare type StylableComponent = TamaguiComponent | Component | ForwardRefExoticComponent<any> | ReactComponentWithRef<any, any> | (new (props: any) => any) | typeof View | typeof Text | typeof TextInput | typeof Image;
export declare type GetStyledVariants<A extends TamaguiComponent> = A extends TamaguiComponent<any, any, any, infer Variants> ? Variants : never;
export declare type GetBaseProps<A extends StylableComponent> = A extends TamaguiComponent<any, any, infer BaseProps> ? BaseProps : never;
export declare type GetProps<A extends StylableComponent> = A extends TamaguiComponent<infer Props> ? Props : A extends TamaguiReactElement<infer Props> ? Props : A extends Component<infer Props> ? GetGenericComponentTamaguiProps<Props> : A extends new (props: infer Props) => any ? GetGenericComponentTamaguiProps<Props> : {};
declare type GetGenericComponentTamaguiProps<P> = P & Omit<'textAlign' extends keyof P ? TextProps : StackProps, keyof P>;
export declare type SpreadKeys = '...fontSize' | '...fontStyle' | '...fontTransform' | '...lineHeight' | '...letterSpacing' | '...size' | '...space' | '...color' | '...zIndex' | '...theme' | '...radius';
export declare type VariantDefinitions<Parent extends StylableComponent = TamaguiComponent, MyProps extends Object = GetProps<Parent>, Val = any> = VariantDefinitionFromProps<MyProps, Val>;
export declare type VariantDefinitionFromProps<MyProps, Val> = MyProps extends Object ? {
    [propName: string]: VariantSpreadFunction<MyProps, Val> | ({
        [Key in SpreadKeys]?: Key extends '...fontSize' ? FontSizeVariantSpreadFunction<MyProps> : Key extends '...size' ? SizeVariantSpreadFunction<MyProps> : Key extends '...space' ? SpaceVariantSpreadFunction<MyProps> : Key extends '...color' ? ColorVariantSpreadFunction<MyProps> : Key extends '...lineHeight' ? FontLineHeightVariantSpreadFunction<MyProps> : Key extends '...fontTransform' ? FontTransformVariantSpreadFunction<MyProps> : Key extends '...fontStyle' ? FontStyleVariantSpreadFunction<MyProps> : Key extends '...letterSpacing' ? FontLetterSpacingVariantSpreadFunction<MyProps> : Key extends '...zIndex' ? ZIndexVariantSpreadFunction<MyProps> : Key extends '...radius' ? RadiusVariantSpreadFunction<MyProps> : Key extends '...theme' ? ThemeVariantSpreadFunction<MyProps> : never;
    } & {
        [Key in string | number | 'true' | 'false']?: MyProps | VariantSpreadFunction<MyProps, Val>;
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
export declare type SpaceVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, SpaceTokens>;
export declare type ColorVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ColorTokens>;
export declare type FontLineHeightVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontLineHeightTokens>;
export declare type FontLetterSpacingVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontLetterSpacingTokens>;
export declare type FontStyleVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontStyleTokens>;
export declare type FontTransformVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, FontTransformTokens>;
export declare type ZIndexVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ZIndexTokens>;
export declare type RadiusVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, RadiusTokens>;
export declare type ThemeVariantSpreadFunction<A extends PropLike> = VariantSpreadFunction<A, ThemeTokens>;
/**
 * --------------------------------------------
 *   end variants
 * --------------------------------------------
 */
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
    mediaState?: null | Record<string, boolean>;
    hasAnimation?: boolean;
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
    keepVariantsAsProps?: boolean;
    hasTextAncestor?: boolean;
};
declare type AnimationConfig = {
    [key: string]: any;
};
export declare type AnimatedNumberStrategy = {
    type: 'spring';
    stiffness?: number;
    damping?: number;
    mass?: number;
    overshootClamping?: boolean;
    restSpeedThreshold?: number;
    restDisplacementThreshold?: number;
} | {
    type: 'timing';
    duration: number;
} | {
    type: 'direct';
};
export declare type UniversalAnimatedNumber<A> = {
    getInstance(): A;
    getValue(): number;
    setValue(next: number, config?: AnimatedNumberStrategy): void;
    stop(): void;
};
export declare type AnimationDriver<A extends AnimationConfig = AnimationConfig> = {
    avoidClasses?: boolean;
    useAnimations: UseAnimationHook;
    useAnimatedNumber: (initial: number) => UniversalAnimatedNumber<any>;
    useAnimatedNumberStyle: <V extends UniversalAnimatedNumber<any>>(val: V, getStyle: (current: any) => any) => void;
    useAnimatedNumberReaction: (val: UniversalAnimatedNumber<any>, onValue: (current: number) => void) => void;
    animations: A;
    View?: any;
    Text?: any;
};
export declare type UseAnimationProps = TamaguiComponentPropsBase & Record<string, any>;
export declare type UseAnimationHelpers = {
    hostRef: RefObject<HTMLElement | View>;
    staticConfig: StaticConfigParsed;
    getStyle: (props?: {
        isEntering?: boolean;
        isExiting?: boolean;
        exitVariant?: string | null;
        enterVariant?: string | null;
    }) => ViewStyle;
    state: SplitStyleState;
    pseudos: PseudoProps<ViewStyle>;
    onDidAnimate?: any;
    delay?: number;
};
export declare type UseAnimationHook = (props: UseAnimationProps, helpers: UseAnimationHelpers) => null | {
    style?: StackStylePropsBase | StackStylePropsBase[];
};
export declare type GestureReponderEvent = Exclude<View['props']['onResponderMove'], void> extends (event: infer Event) => void ? Event : never;
export {};
//# sourceMappingURL=types.d.ts.map