/**
 * maps tamagui pseudo-state prop names to tailwind modifier prefixes.
 */

export const pseudoToModifier: Record<string, string> = {
  hoverStyle: 'hover',
  pressStyle: 'active',
  focusStyle: 'focus',
  focusVisibleStyle: 'focus-visible',
  focusWithinStyle: 'focus-within',
  disabledStyle: 'disabled',
  // mount/unmount animation states: styleMode reconstructs enter:/exit: classes back into
  // the enterStyle/exitStyle PROP (in createComponent, before the animation state machine),
  // so they drive AnimatePresence exactly like the typed prop.
  enterStyle: 'enter',
  exitStyle: 'exit',
}

// tamagui media key → tailwind class modifier.
//
// IDENTITY MAP. the styleMode runtime resolves a class modifier by looking the string up
// DIRECTLY in `config.media` (getSplitStyles → parseFlatModifierProp: `mod in config.media`).
// so the ONLY round-trip-correct modifier for a source `$key` prop is `key` itself — emitting
// a different name (the old `md → max-md`) resolves to a DIFFERENT breakpoint (or, when that
// name isn't a config key, is dropped entirely), which INVERTED responsive show/hide.
//
// this is also idiomatic Tailwind for the v5/v6 config the app template uses, where the
// media keys are already Tailwind-named: `md` = { minWidth: 768 } (Tailwind `md:`) and
// `max-md` = { maxWidth: 768 } (Tailwind `max-md:`). identity preserves both directions.
export const mediaToModifier: Record<string, string> = {
  // min-width (mobile-first) — v5/v6 primary breakpoints, Tailwind-aligned
  xxxs: 'xxxs',
  xxs: 'xxs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: 'xxl',

  // max-width (desktop-first) — v5/v6 `max-*` keys
  'max-xxs': 'max-xxs',
  'max-xs': 'max-xs',
  'max-sm': 'max-sm',
  'max-md': 'max-md',
  'max-lg': 'max-lg',
  'max-xl': 'max-xl',
  'max-xxl': 'max-xxl',

  // gt* (min-width) — legacy config-default naming; identity so it resolves there too
  gtXs: 'gtXs',
  gtSm: 'gtSm',
  gtMd: 'gtMd',
  gtLg: 'gtLg',
  gtXl: 'gtXl',
}
