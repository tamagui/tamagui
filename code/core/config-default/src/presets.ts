import { animationPresets } from '@tamagui/animation-helpers'

/** the shared table plus the two this config adds, in one place for both drivers */
export const presets = {
  ...animationPresets,
  // named for where they are used, not for how they feel
  tooltip: { duration: 250, bounce: 0.1 },
  select: { duration: 150, bounce: 0 },
}
