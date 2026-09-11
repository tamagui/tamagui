import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Switch: token-based frame and thumb sizing with theme background and focus styling, over the unstyled @tamagui/ui Switch behavior.',
  categories: ['form'],
  tokens: ['background', 'outline-color'],
  themes: ['Switch', 'SwitchThumb'],
} satisfies SkinManifest
