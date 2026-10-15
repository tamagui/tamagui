const { createTamagui, createFont } = require('@tamagui/core')
const { defaultConfig } = require('@tamagui/config/v6')

const font = (family) =>
  createFont({ family, size: { 4: 14 }, lineHeight: { 4: 20 }, weight: { 4: '400' } })

// body has a FontLanguage variant, heading has none
module.exports = createTamagui({
  ...defaultConfig,
  fonts: {
    ...defaultConfig.fonts,
    body: font('Silkscreen'),
    body_alt: font('Ark Pixel'),
    heading: font('Space Grotesk'),
  },
})
