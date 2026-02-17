/**
 * Context for passing theme scope IDs down the component tree.
 * Each <Theme> component creates a unique scope ID that child components
 * use when registering with the native style registry.
 */
import type { ReactNode } from 'react';
export declare function __bindRegistryFunctions(setScopedTheme: (scopeId: string, themeName: string) => void, removeScopedTheme: (scopeId: string) => void, isNativeModuleAvailable: () => boolean): void;
interface ThemeScopeContextValue {
    scopeId: string;
    parentScopeId?: string;
}
export declare const ThemeScopeContext: import("react").Context<ThemeScopeContextValue | null>;
export declare function useThemeScopeId(): string | undefined;
/**
 * Provides a new theme scope for child components.
 * Called by the Theme component to create a scope that can be targeted
 * by setThemeForScope() for zero-re-render theme updates.
 */
export declare function ThemeScopeProvider({ themeName, children, }: {
    themeName: string;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemeScopeContext.d.ts.map