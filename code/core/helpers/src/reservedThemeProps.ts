/**
 * The props `<Theme>` owns. Inline theme values live on `<ThemeUpdate>`, so an
 * unknown `<Theme>` prop is always invalid.
 *
 * It lives here, in a side-effect-free package, because the compiler classifies
 * static `<Theme>` props with the same table the runtime uses. One table, so a
 * new reserved prop can never mean one thing at build time and another at
 * runtime.
 */
export const reservedThemeProps: Record<string, true> = {
  _isRoot: true,
  children: true,
  className: true,
  contain: true,
  debug: true,
  deopt: true,
  disable: true,
  'disable-child-theme': true,
  forceClassName: true,
  _themeUpdate: true,
  name: true,
  nativeUpdate: true,
  needsUpdate: true,
  passThrough: true,
  shallow: true,
}
