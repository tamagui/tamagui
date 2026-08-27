/**
 * Lean, side-effect-free static style resolution entry for @tamagui/web.
 *
 * Designed for build-time compilers (Rust one-bundler QuickJS host, Vite, static extractor)
 * to evaluate config and resolve extracted static props with zero React/DOM/React Native
 * runtime dependencies.
 */
import { getConfig, getConfigMaybe, getThemes, getToken, getTokens, getTokenValue, setConfig, updateConfig } from './config';
import { createTamagui, installTamaguiConfig } from './createTamagui';
import { getSplitStyles } from './helpers/getSplitStyles';
import type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed } from './types';
export { createTamagui, getConfig, getConfigMaybe, getSplitStyles, getThemes, getToken, getTokens, getTokenValue, installTamaguiConfig, setConfig, updateConfig, };
export type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed };
export interface StaticResolveOptions {
    resolveValues?: 'variable' | 'except-theme' | 'value';
    noClass?: boolean;
    isAnimated?: boolean;
    displayName?: string;
}
export interface StaticResolveElementPlan {
    /** Identifier to correlate the response with the request */
    id: string | number;
    /** Component props (JSON serializable) */
    props: Record<string, any>;
    /** Component display / debug name */
    componentName?: string;
    /** Static component configuration if known */
    staticConfig?: Partial<StaticConfig>;
    /** Theme name to resolve against (default: first theme in config or 'light') */
    themeName?: string;
    /** Component state (hover, press, etc.) */
    componentState?: Partial<TamaguiComponentState>;
    /** Style resolution options */
    options?: StaticResolveOptions;
}
export interface StaticResolveBatchPlan {
    /** Target platform: 'web' | 'native' (default: 'web') */
    target?: 'web' | 'native';
    /** Optional theme name applied to all elements unless overridden */
    defaultThemeName?: string;
    /** List of element extraction plans */
    elements: StaticResolveElementPlan[];
}
export interface StaticResolveRuleOutput {
    identifier: string;
    property?: string;
    rules: string[];
}
export interface StaticResolveElementResult {
    id: string | number;
    ok: boolean;
    /** Concatenated className for web */
    className?: string;
    /** ClassName dictionary */
    classNames?: Record<string, string>;
    /** Atomic CSS rules generated */
    rules?: StaticResolveRuleOutput[];
    /** Flat rules string list */
    css?: string[];
    /** Residual inline styles */
    style?: Record<string, any> | null;
    /** Residual view props */
    viewProps?: Record<string, any>;
    /** Media query dependencies */
    hasMedia?: boolean | string[];
    /** Interaction state dependencies */
    programStates?: string[];
    /** Pseudo group dependencies */
    pseudoGroups?: string[];
    /** Media group dependencies */
    mediaGroups?: string[];
    /** Dynamic theme token access detected */
    dynamicThemeAccess?: boolean;
    /** Font family resolved */
    fontFamily?: string;
    /** Lifecycle animation keys */
    programLifecycleStyleKeys?: {
        enter?: string[];
        exit?: string[];
    };
    /** Bailout details if resolution failed */
    bailout?: {
        reason: string;
        message: string;
    };
}
export interface StaticResolveBatchResult {
    results: StaticResolveElementResult[];
}
/**
 * Resolves static styles for a single element against the currently installed Tamagui config.
 */
export declare function resolveStaticElement(element: StaticResolveElementPlan, target?: 'web' | 'native', defaultThemeName?: string): StaticResolveElementResult;
/**
 * Resolves a batch of element extraction plans against the active Tamagui config.
 */
export declare function resolveStaticBatch(batch: StaticResolveBatchPlan): StaticResolveBatchResult;
/**
 * Polymorphic batched static resolver. Accepts either a JSON string (for embedded C / QuickJS FFI)
 * or a JavaScript StaticResolveBatchPlan object, returning matching JSON or result object.
 */
export declare function resolveStatic(batch: string | StaticResolveBatchPlan): string | StaticResolveBatchResult;
//# sourceMappingURL=static-resolve.d.ts.map