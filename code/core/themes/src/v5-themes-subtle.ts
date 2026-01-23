/**
 * Subtle v5 themes - pre-built desaturated color themes
 */

export * from './v5-themes'

import { subtleChildrenThemes } from './subtleChildrenThemes'
import { createV5Theme } from './v5-themes'

export const themes = createV5Theme({ childrenThemes: subtleChildrenThemes })

// type checks - don't remove
themes.dark.background0075
themes.dark_yellow.background0075
themes.dark.background
themes.dark.accent1
// @ts-expect-error
themes.dark.nonValid
