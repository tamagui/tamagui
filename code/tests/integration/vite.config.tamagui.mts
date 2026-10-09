import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The regular Tamagui build of the same app: same compiler, same components, no
// official Tailwind engine. The integration test builds it as the baseline for how
// much CSS `@tamagui/tailwind/vite` adds on top.
export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui', '@tamagui/tailwind'],
      config: 'src/tamagui.config.ts',
      useReactNativeWebLite: true,
    }),
  ],
})
