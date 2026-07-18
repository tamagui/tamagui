import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Select: styled trigger/value/icon, viewport with elevation, items with highlight + check indicator, scroll buttons and separators, over the unstyled @tamagui/ui Select behavior. Adapts to a Sheet on native.',
  categories: ['form', 'overlay'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$backgroundFocus',
    '$borderColor',
    '$borderColorHover',
    '$outlineColor',
    '$color',
    '$color10',
  ],
  native: [
    'requires a Portal/Adapt provider at the app root; on native the Select adapts to a Sheet, so the Sheet native peer requirements apply when adaptation is used',
  ],
} satisfies SkinManifest
