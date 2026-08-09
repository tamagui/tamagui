const { createTamagui } = require('@tamagui/core')
const { animations } = require('@tamagui/config/animations-css')
const { defaultConfig } = require('@tamagui/config/v6')

module.exports = createTamagui({
  ...defaultConfig,
  animations,
  themes: {
    ...defaultConfig.themes,
    // The shared precedence table needs a nested theme to prove that a child
    // theme outranks its parent. Keep this isolated from the suite-wide config
    // so unrelated compiler snapshots retain their existing config revision.
    dark_blue: defaultConfig.themes.dark,
  },
})
