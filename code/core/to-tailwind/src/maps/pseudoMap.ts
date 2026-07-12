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

// media keys pass through as IDENTITY tailwind modifiers ($md → `md:`).
//
// the styleMode runtime resolves a class modifier by looking the string up DIRECTLY in
// `config.media` (getSplitStyles → parseFlatModifierProp: `mod in config.media`). so the ONLY
// round-trip-correct modifier for a source `$key` media prop is `key` itself — emitting a
// different name (the old `md → max-md`) resolves to a DIFFERENT breakpoint (or, when that
// name isn't a config key, is dropped entirely), which INVERTED responsive show/hide.
//
// because the converter is a GENERAL tool, the authoritative media-key set is the ACTUAL
// app config's `media` (passed via TransformOptions.media) — ANY configured key round-trips,
// including custom ones ($tablet → `tablet:`) and default max-*/height-*/touchable/hoverable.
// this list is only the FALLBACK set used when no config media is supplied: the common
// identifier-safe default v5/v6 + legacy config-default keys. hyphenated keys (max-md,
// max-height-lg) can't be written as a JSX `$prop`, so they only matter via the config set.
// the FULL @tamagui/config v5/v6 default media key set (parity-tested against
// `@tamagui/config/v6` defaultConfig.media in the test suite so it can't silently drift — an
// earlier version omitted the max-*/height-* keys, dropping those media props to residual). JSX
// attribute names CAN contain hyphens, so `$max-md`/`$max-height-lg` are valid source props and
// must round-trip. also includes the legacy config-default (`gt*`, short/tall/…) keys so both
// default configs convert without an explicit `media` option.
export const defaultMediaKeys: string[] = [
  // @tamagui/config v6 defaults
  'touchable',
  'hoverable',
  'max-xxl',
  'max-xl',
  'max-lg',
  'max-md',
  'max-sm',
  'max-xs',
  'max-xxs',
  'max-xxxs',
  'max-200',
  'max-100',
  'xxxs',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'max-height-lg',
  'max-height-md',
  'max-height-sm',
  'max-height-xs',
  'max-height-xxs',
  'max-height-xxxs',
  'max-height-200',
  'max-height-100',
  'height-sm',
  'height-md',
  'height-lg',
  // legacy config-default (min-width gt*, orientation/pointer)
  'gtXs',
  'gtSm',
  'gtMd',
  'gtLg',
  'gtXl',
  'short',
  'tall',
  'hoverNone',
  'pointerCoarse',
]
