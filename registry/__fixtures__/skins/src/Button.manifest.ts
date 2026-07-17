import type { SkinManifest } from '../../../../scripts/lib/registry/types'

// co-located manifest for the Button skin. only NON-derivable bits live
// here — npm deps, file content, name and title are derived from Button.tsx.
//
// NOTE: this is the FIXTURE stub used to build + validate the generator before
// the real styled skin source lands. W4 authors the real Button.manifest.ts
// against this same SkinManifest shape.
export const manifest = {
  description:
    'A styled, v2-compatible Button with size/variant/circular variants, built on the unstyled @tamagui/ui Button behavior.',
  categories: ['controls'],
  tokens: [
    '$background',
    '$backgroundHover',
    '$backgroundPress',
    '$borderColor',
    '$borderColorHover',
    '$color',
    '$outlineColor',
  ],
  themes: ['accent'],
  peerDependencies: {
    react: '*',
    'react-native': '*',
    tamagui: '*',
  },
  native: {
    notes: 'Icons come from @tamagui/lucide-icons-2; no native config plugin required.',
  },
} satisfies SkinManifest
