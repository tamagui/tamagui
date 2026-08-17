import { withTamagui } from '@tamagui/next-plugin'

export default withTamagui({
  // see tamagui.build.ts
})({
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
})
