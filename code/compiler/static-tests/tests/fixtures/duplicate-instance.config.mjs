// a user config that calls createTamagui itself, bundled by bundleConfig with
// @tamagui/style left external: the esm import in bundleConfig evaluates it
// against the esm build of core while the compiler host requires the cjs
// build, so the config parses inside a different core module instance than
// the one extraction reads from.
import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from '@tamagui/style'

export default createTamagui({
  ...defaultConfig,
  media: {
    ...defaultConfig.media,
    sm: { maxWidth: 4321 },
  },
})
