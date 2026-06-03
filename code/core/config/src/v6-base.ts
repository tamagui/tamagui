// v6 base config — currently v5 + Tailwind-style `w`/`h` shorthands. this is the opt-in
// home for breaking, Tailwind-compatible changes (shorthands now; spacing scale, color
// palette and named sizes to follow), so v5 stays stable.
import { shorthands } from '@tamagui/shorthands/v6'
import { themes, tokens as v5tokens } from '@tamagui/themes/v5'
import type { CreateTamaguiProps } from '@tamagui/web'
import { fonts } from './v5-fonts'
import { media, mediaQueryDefaultActive } from './v5-media'
import { selectionStyles, settings } from './v5-base'
import { tailwindColors, tailwindRadius } from './v6-tailwind-tokens'

// inherit all v5 helpers/types/theme re-exports, then override shorthands + defaultConfig
export * from './v5-base'
export { shorthands }

// v5 tokens + Tailwind palette (color) and named radii, so styleMode:'tailwind' resolves
// bg-indigo-500 / rounded-lg by name.
const tokens = {
  ...v5tokens,
  color: { ...(v5tokens as any).color, ...tailwindColors },
  radius: { ...(v5tokens as any).radius, ...tailwindRadius },
}

export const defaultConfig = {
  media,
  shorthands,
  themes,
  tokens,
  fonts,
  selectionStyles,
  settings,
} satisfies CreateTamaguiProps
