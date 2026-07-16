// generation-only input for the `generate:v5-subtle` script. it builds the
// static subtle themes written to generated-v5-subtle.ts. like v5-themes.generate,
// this is NOT shipped from any public entry: importing it runs createV5Theme at
// module load and pulls in the theme-builder.
import { subtleChildrenThemes } from './subtleChildrenThemes'
import { createV5Theme } from './v5-themes'

export const themes = createV5Theme({ childrenThemes: subtleChildrenThemes })

// don't remove this - type sanity checks - these should not cause type errors:
themes.dark.background0075
themes.dark_yellow.background0075
themes.dark.background
themes.dark.accent1
// @ts-expect-error
themes.dark.nonValid
