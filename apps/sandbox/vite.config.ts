import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

const shouldExtract = process.env.EXTRACT === '1'

if (shouldExtract) {
  console.log(`Compiler enabled`)
}

const tamaguiConfig = {
  components: ['@tamagui/sandbox-ui', 'tamagui'],
  config: 'tamagui.config.ts',
  useReactNativeWebLite: true,
}

export default defineConfig({
  clearScreen: true,
  plugins: [
    react(),
    tamaguiPlugin(tamaguiConfig),
    // shouldExtract ? tamaguiExtractPlugin(tamaguiConfig) : null,
  ].filter(Boolean),
  resolve: {
    alias: [{
      find: /@tamagui\/tamagui-variables/,
      replacement: fileURLToPath(new URL('./overrideDefaultVariables.ts', import.meta.url)),
    }]
  },
  build:{

    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
