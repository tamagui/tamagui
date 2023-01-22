import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import reanimated from '@tamagui/vite-plugin-reanimated'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { swcReactRefresh } from 'vite-plugin-swc-react-refresh'

process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = '1'

const shouldExtract = process.env.EXTRACT === '1'

if (shouldExtract) {
  console.log(`Compiler enabled`)
}

const tamaguiConfig = {
  components: ['sandbox-ui', 'tamagui'],
  config: 'tamagui.config.ts',
  useReactNativeWebLite: true,
}

export default defineConfig({
  clearScreen: true,
  esbuild: {
    jsx: 'automatic',
  },
  plugins: [
    swcReactRefresh(),
    // reanimated(),
    // react({
    //   jsxRuntime: 'automatic',
    //   // jsxRuntime: 'classic',
    //   // jsxImportSource: '@welldone-software/why-did-you-render',
    //   fastRefresh: true,
    //   jsxPure: true,
    // }),
    tamaguiPlugin(tamaguiConfig),
    shouldExtract ? tamaguiExtractPlugin(tamaguiConfig) : null,
  ].filter(Boolean),
})
