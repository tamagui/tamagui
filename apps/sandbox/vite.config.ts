import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import reanimated from '@tamagui/vite-plugin-reanimated'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const shouldExtract = process.env.EXTRACT === '1'

if (shouldExtract) {
  // eslint-disable-next-line no-console
  console.log(`Compiler enabled`)
}

const tamaguiConfig = {
  components: ['@tamagui/sandbox-ui', 'tamagui'],
  config: 'tamagui.config.ts',
}

export default defineConfig({
  clearScreen: false,
  plugins: [
    // reanimated(),
    react({
      jsxRuntime: 'automatic',
      // jsxRuntime: 'classic',
      // jsxImportSource: '@welldone-software/why-did-you-render',
      fastRefresh: true,
      jsxPure: true,
    }),
    tamaguiPlugin({
      ...tamaguiConfig,
      useReactNativeWebLite: true,
    }),
    ...(shouldExtract
      ? [
          //
          tamaguiExtractPlugin(tamaguiConfig),
        ]
      : []),
  ],
})
