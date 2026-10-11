import { withTamagui } from '@tamagui/next-plugin'

// one project, two qualifications: `pageExtensions` selects the island page or
// the island-free page, and each writes to its own distDir so neither build
// decides what the other's assertions read
const withIslands = process.env.TAMAGUI_ZERO_ISLANDS !== '0'

export default withTamagui({
  // see tamagui.build.ts
})({
  reactStrictMode: false,
  distDir: withIslands ? '.next' : '.next-base',
  pageExtensions: [withIslands ? 'zero.tsx' : 'base.tsx'],
  typescript: { ignoreBuildErrors: true },
})
