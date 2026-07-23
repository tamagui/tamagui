import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look ToggleGroup: theme palette, border, hover/press/focus color styling, and the default active (pressed-on) appearance on the unstyled @tamagui/ui ToggleGroup Item. The behavior keeps only structural layout + the size mechanism and emits aria-pressed/data-state.',
  categories: ['form'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$borderColor',
    '$borderColorHover',
    '$borderColorPress',
    '$outlineColor',
  ],
  // on-state is styled via the Toggle behavior's `activeStyle` prop (emits
  // data-state="on" = checked), not a canonical `checked` variant — declare it
  // so W5 covers the state.
  extraStates: ['checked'],
} satisfies SkinManifest
