/**
 * Lean, side-effect-free static style resolution entry for @tamagui/web.
 *
 * Designed for build-time compilers (Rust one-bundler QuickJS host, Vite, static extractor)
 * to evaluate config and resolve extracted static props with zero React/DOM/React Native
 * runtime dependencies.
 */
import { getConfig, getConfigMaybe, getThemes, getToken, getTokens, getTokenValue, setConfig, updateConfig } from './config';
import { createTamagui, installTamaguiConfig } from './createTamagui';
import { getSplitStyles, prepareStyleStaticConfig } from './helpers/getSplitStyles';
import type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed } from './types';
export { createTamagui, getConfig, getConfigMaybe, getSplitStyles, getThemes, getToken, getTokens, getTokenValue, installTamaguiConfig, prepareStyleStaticConfig, setConfig, updateConfig, };
export type { StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed };
export interface StaticResolveOptions {
    resolveValues?: 'variable' | 'except-theme' | 'value' | 'none';
    noClass?: boolean;
    isAnimated?: boolean;
    displayName?: string;
}
export interface StaticResolveElementPlan {
    id: string | number;
    props: Record<string, any>;
    componentName?: string;
    staticConfig?: Partial<StaticConfig>;
    themeName?: string;
    componentState?: Partial<TamaguiComponentState>;
    options?: StaticResolveOptions;
}
export interface StaticResolveBatchPlan {
    target?: 'web' | 'native';
    defaultThemeName?: string;
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
    className?: string;
    classNames?: Record<string, string>;
    rules?: StaticResolveRuleOutput[];
    css?: string[];
    style?: Record<string, any> | null;
    viewProps?: Record<string, any>;
    hasMedia?: string[] | boolean;
    pseudoGroups?: string[];
    mediaGroups?: string[];
    programStates?: string[];
    dynamicThemeAccess?: boolean;
    fontFamily?: string;
    programLifecycleStyleKeys?: {
        enter?: string[];
        exit?: string[];
    };
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