import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Switch: token-based frame and thumb sizing with theme background and focus styling, over the unstyled @tamagui/ui Switch behavior.',
  categories: ['form'],
  tokens: ['background', 'outline-color'],
  // v2-look skin: the off-state trough is a palette step (color-4/color-5) with
  // no theme generic for it, same grandfathering as Select/Sheet/Toast.
  genericsOnly: false,
  themes: ['Switch', 'SwitchThumb'],
} satisfies SkinManifest
