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
export const defaultMediaKeys: string[] = [
  // min-width (mobile-first) — v5/v6 primary breakpoints, Tailwind-aligned
  'xxxs',
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  // gt* (min-width) — legacy config-default naming
  'gtXs',
  'gtSm',
  'gtMd',
  'gtLg',
  'gtXl',
  // non-width default media
  'short',
  'tall',
  'hoverNone',
  'pointerCoarse',
  'touchable',
  'hoverable',
]
