/**
 * The props `<Theme>` owns. Inline theme values live on `<ThemeUpdate>`, so an
 * unknown `<Theme>` prop is always invalid.
 *
 * It lives here, in a side-effect-free package, because the compiler classifies
 * static `<Theme>` props with the same table the runtime uses. One table, so a
 * new reserved prop can never mean one thing at build time and another at
 * runtime.
 */
export declare const reservedThemeProps: Record<string, true>;
//# sourceMappingURL=reservedThemeProps.d.ts.map