/**
 * Compile-time theme reference sentinel.
 *
 * The static compiler resolves styles with `resolveValues: 'except-theme'`.
 * Values that resolve through the active theme (as opposed to static tokens,
 * which are theme-independent) are kept symbolic as a sentinel string so the
 * compiler can split them out and emit `theme.<key>.get()` expressions inside
 * `_withStableStyle`, instead of freezing the build machine's first-theme
 * values into compiled output. A string survives every downstream style
 * normalization path untouched; the control character cannot appear in a real
 * style value.
 */
export declare const THEME_REF_PREFIX = "\u0001theme:";
/**
 * The theme key of a pure reference, or null when the value is anything else,
 * including a reference embedded in a larger string or carrying an opacity
 * modifier, which compiled output cannot represent and must leave on the
 * runtime path.
 */
export declare function themeRefKey(value: unknown): string | null;
export declare function containsThemeRef(value: unknown): boolean;
//# sourceMappingURL=themeRef.d.ts.map