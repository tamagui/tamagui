import react from '@vitejs/plugin-react'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'

import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'
const tamaguiConfig = createTamagui(config)

export default {
  plugins: [
    react(),

    tamaguiPlugin(tamaguiConfig.themeConfig),

    // optional, adds the optimizing compiler:
    process.env.NODE_ENV === 'production'
      ? tamaguiExtractPlugin(tamaguiConfig.themeConfig)
      : null,
  ].filter(Boolean),
}
