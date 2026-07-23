import type { AnimationDriver, DefaultTokenCategory, GenericTamaguiSettings, TamaguiInternalConfig, Token, Tokens, TokensMerged } from './types';
export type StyleCompat = 'legacy' | 'react-native' | 'web';
export declare const DEFAULT_SIZE_TOKEN = "$4";
export declare const getSetting: <Key extends keyof GenericTamaguiSettings>(key: Key) => GenericTamaguiSettings[Key];
type DefaultTokenConfig = Pick<TamaguiInternalConfig, 'settings'>;
export declare const getDefaultToken: (category: DefaultTokenCategory, config?: DefaultTokenConfig | null) => string;
export declare const resolveDefaultToken: <Val>(val: Val, category: DefaultTokenCategory, config?: DefaultTokenConfig | null) => Exclude<Val, true> | string;
export declare const getDefaultSizeToken: (config?: DefaultTokenConfig | null) => string;
export declare const resolveDefaultSizeToken: <Val>(val: Val, config?: DefaultTokenConfig | null) => Exclude<Val, true> | string;
export declare function getStyleCompat(): StyleCompat;
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig;
export declare const getConfigMaybe: () => TamaguiInternalConfig | null;
export declare function setTokens(_: TokensMerged): void;
export declare const getTokens: ({ prefixed, }?: {
    /**
     * Force either with $ or without $ prefix
     */
    prefixed?: boolean;
}) => TokensMerged;
export declare const getTokenObject: (value: Token, group?: keyof Tokens) => import("./types").Variable<any>;
export declare const getToken: (value: Token, group?: keyof Tokens, useVariable?: boolean) => any;
export declare const getTokenValue: (value: Token | 'unset' | 'auto', group?: keyof Tokens) => any;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: typeof getTokens;
export declare const getThemes: () => {
    [x: string]: {
        [x: string]: import("./types").Variable<any> | import("./types").Variable<string> | import("./types").Variable<number> | import("./types").Variable<import("./types").PxValue> | import("./types").Variable<import("./types").VariableValGeneric>;
        background?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        backgroundHover?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        backgroundPress?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        backgroundFocus?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        color?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        colorHover?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        colorPress?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        colorFocus?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        borderColor?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        borderColorHover?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        borderColorPress?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        borderColorFocus?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        shadowColor?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        shadowColorHover?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        shadowColorPress?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
        shadowColorFocus?: import("./types").Variable<any> | import("./types").Variable<undefined> | import("./types").Variable<string> | undefined;
    };
};
export declare const updateConfig: (key: string, value: any) => void;
export declare const getFont: (name: string) => import("./types").GenericFont<string | number | symbol>;
type DevConfig = {
    visualizer?: boolean | {
        key?: string;
        delay?: number;
    };
};
export declare let devConfig: DevConfig | undefined;
export declare function setupDev(conf: DevConfig): void;
/**
 * Dynamically load an animation driver at runtime.
 * Useful for lazy loading heavier animation drivers after initial page load.
 *
 * @example
 * ```tsx
 * // import loadAnimationDriver from tamagui
 * // import createAnimations from your preferred driver (e.g. animations-reanimated)
 *
 * const driver = createAnimations({ bouncy: { type: 'spring', damping: 10 } })
 * loadAnimationDriver('spring', driver)
 * ```
 */
export declare function loadAnimationDriver(name: string, driver: AnimationDriver): void;
export {};
//# sourceMappingURL=config.d.ts.map