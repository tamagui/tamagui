import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import { defineConfig } from 'vite'

const shouldExtract = process.env.EXTRACT === '1'

const tamaguiConfig = {
  components: ['@tamagui/sandbox-ui', 'tamagui'],
  config: 'tamagui.config.ts',
  useReactNativeWebLite: true,
}

export default defineConfig({
  clearScreen: true,
  plugins: [
    tamaguiPlugin(tamaguiConfig),
    shouldExtract ? tamaguiExtractPlugin(tamaguiConfig) : null,
  ].filter(Boolean),
})
