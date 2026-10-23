import type { AnimationDriver, GenericTamaguiSettings, TamaguiInternalConfig, Token, Tokens, TokensParsed } from './types';
export type StyleCompat = 'legacy' | 'react-native' | 'web';
export declare const getSetting: <Key extends keyof GenericTamaguiSettings>(key: Key) => GenericTamaguiSettings[Key];
export declare function getStyleCompat(): StyleCompat;
export declare const setConfig: (next: TamaguiInternalConfig) => void;
export declare const setConfigFont: (name: string, font: any, fontParsed: any) => void;
export declare const getConfig: () => TamaguiInternalConfig;
export declare const getConfigMaybe: () => TamaguiInternalConfig | null;
export declare function setTokens(next: TokensParsed): void;
export declare const getTokens: () => TokensParsed;
export declare const getTokenObject: (value: Token, group?: keyof Tokens) => import("./types").Variable<any>;
export declare const getToken: (value: Token, group?: keyof Tokens, useVariable?: boolean) => any;
export declare const getTokenValue: (value: Token | 'unset' | 'auto', group?: keyof Tokens) => any;
/**
 * Note: this is the same as `getTokens`
 */
export declare const useTokens: typeof getTokens;
export declare const getThemes: () => TamaguiInternalConfig['themes'];
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