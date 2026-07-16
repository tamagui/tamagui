// generation-only input for the `generate:v5` script. it builds the static
// themes written to generated-v5.ts. this is NOT shipped from any public entry:
// importing it runs createV5Theme at module load and pulls in the theme-builder,
// which is exactly the weight we keep out of @tamagui/themes/v5.
import { createV5Theme } from './v5-themes'

export const themes = createV5Theme()

// don't remove this - type sanity checks - these should not cause type errors:
themes.dark.background0075
themes.dark_yellow.background0075
themes.dark.background
themes.dark.accent1
// @ts-expect-error
themes.dark.nonValid
