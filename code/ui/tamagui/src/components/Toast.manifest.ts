import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Toast (v2 composable API): card background/border/radius/padding/shadow/focus outline, styled title/description text, rounded close button, action/cancel buttons, and the styled default toast content wired through Toast.List renderItem, over the unstyled @tamagui/toast behavior (state engine, stacking, drag-to-dismiss, timers).',
  categories: ['feedback'],
  tokens: [
    'background',
    'border-color',
    'color',
    'color-3',
    'color-4',
    'color-5',
    'color-6',
    'color-7',
    'color-8',
    'color-10',
    'color-11',
    'color-11',
  ],
  native: [
    'requires a Portal provider at the app root for the toast viewport to mount above content',
  ],
  // grandfathered: the toast card/buttons use palette steps color-3..color-11
  // for their layered light/dark surface look.
  genericsOnly: false,
} satisfies SkinManifest
