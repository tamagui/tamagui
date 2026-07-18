import type { SkinManifest } from './registry-manifest'

export const manifest = {
  description:
    'v2-look Sheet: styled handle (open/closed opacity), dimmed overlay, rounded background, padded container and scroll view, plus the controlled composition, over the unstyled @tamagui/ui Sheet behavior.',
  categories: ['overlay'],
  tokens: ['$background', '$color5', '$shadowColor'],
  native: [
    'requires a Portal provider at the app root for the sheet to mount above content',
    'react-native-safe-area-context is used for safe-area insets on native (optional peer)',
  ],
  peerDependencies: ['react-native-safe-area-context'],
} satisfies SkinManifest
