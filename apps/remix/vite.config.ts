import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'

installGlobals()

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.TAMAGUI_BAIL_AFTER_SCANNING_X_CSS_RULES': false,
  },
  plugins: [
    remix(),
    tsconfigPaths(),
    // tamaguiPlugin({
    //   config: './tamagui.config.ts',
    //   components: ['tamagui'],
    // }),
    // optional, adds the optimizing compiler:
    // tamaguiExtractPlugin(tamaguiConfig),
  ],
})
