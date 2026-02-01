/**
 * Hook that reads the current theme name ONCE without subscribing to changes.
 * Used by optimized components that rely on native registry for theme updates.
 *
 * This is intentionally "wrong" from React's perspective - it doesn't subscribe
 * to context changes. But that's the point: the native registry handles updates
 * directly on the ShadowTree, bypassing React entirely.
 *
 * IMPORTANT: This hook does NOT use useContext because that would subscribe
 * to context changes. Instead, we read directly from Tamagui's internal state.
 */
/**
 * Get the initial theme name without subscribing to updates.
 * Returns the theme name at the time of first render.
 *
 * WARNING: This hook intentionally does NOT subscribe to theme changes.
 * The component will NOT re-render when the theme changes.
 * This is the desired behavior for optimized components that use
 * native ShadowTree updates instead of React re-renders.
 *
 * @returns Theme name string (e.g., 'light', 'dark', 'dark_blue')
 */
export declare function useInitialThemeName(): string;
//# sourceMappingURL=useInitialThemeName.d.ts.map