import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Accordion: theme background, padding, cursor, and hover/focus/press color styling on the unstyled @tamagui/ui Accordion Trigger and Content. The behavior keeps only the Collapsible trigger/content behavior.',
  categories: ['disclosure'],
  tokens: ['$background', '$backgroundHover', '$backgroundFocus', '$backgroundPress'],
} satisfies SkinManifest
