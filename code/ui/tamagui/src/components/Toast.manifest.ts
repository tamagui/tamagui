import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Toast (v2 composable API): card background/border/radius/padding/shadow/focus outline, styled title/description text, rounded close button, action/cancel buttons, and the styled default toast content wired through Toast.List renderItem, over the unstyled @tamagui/toast/v2 behavior (state engine, stacking, drag-to-dismiss, timers).',
  categories: ['feedback'],
  tokens: [
    '$background',
    '$borderColor',
    '$color',
    '$color3',
    '$color4',
    '$color5',
    '$color6',
    '$color7',
    '$color8',
    '$color10',
    '$color11',
    '$color12',
  ],
  native: [
    'requires a Portal provider at the app root for the toast viewport to mount above content',
  ],
} satisfies SkinManifest
