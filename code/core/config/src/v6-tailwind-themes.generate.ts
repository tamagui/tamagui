// generation-only input for the `generate:v6-tailwind-themes` script. it builds the
// static themes written to v6-tailwind-themes.generated.ts. this is NOT shipped from any
// public entry: importing it runs createTailwindThemes at module load and pulls in the
// theme-builder, which is exactly the weight we keep out of @tamagui/config/v6.
import { createTailwindThemes } from './v6-builder'

export const themes = createTailwindThemes()

// don't remove this - type sanity checks - these should not cause type errors:
themes.dark.background0075
themes.dark_blue.background0075
themes.dark.background
themes.dark.accent1
themes.light.blue5
// @ts-expect-error
themes.dark.nonValid
