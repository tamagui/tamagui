/**
 * Subtle v5 themes - pre-built desaturated color themes
 */

export * from './v5-themes'

import { lazyThemes } from './lazyThemes'
import { subtleChildrenThemes } from './subtleChildrenThemes'
import { createV5Theme } from './v5-themes'

export const themes = lazyThemes(() =>
  createV5Theme({ childrenThemes: subtleChildrenThemes })
)

// type checks - don't remove. they are type-level so they do not force the lazy
// build at import time:
type _V5SubtleThemeChecks = [
  typeof themes.dark.background0075,
  typeof themes.dark_yellow.background0075,
  typeof themes.dark.background,
  typeof themes.dark.accent1,
]
// @ts-expect-error
type _V5SubtleThemeInvalid = typeof themes.dark.nonValid
