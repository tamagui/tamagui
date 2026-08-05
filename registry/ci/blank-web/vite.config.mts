import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// a blank tamagui web app. the tamagui plugin only needs to know about the base
// `tamagui` package + the app's config; the installed registry item is plain
// component source under components/tamagui and needs no extra wiring.
export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
      useReactNativeWebLite: true,
    }),
  ],
  server: { port: 5199, strictPort: true },
  preview: { port: 5200, strictPort: true },
})
