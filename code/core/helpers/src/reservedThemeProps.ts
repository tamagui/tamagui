/**
 * The props `<Theme>` owns. Every other prop on it is read as a theme key, so
 * these names can't be used as theme keys or config variables. development
 * builds report a collision instead of silently dropping the value.
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
  inlineClassName: true,
  inlineValues: true,
  name: true,
  nativeUpdate: true,
  needsUpdate: true,
  passThrough: true,
  reset: true,
  shallow: true,
}
