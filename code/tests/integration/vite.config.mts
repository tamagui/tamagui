import { tamaguiPlugin } from '@tamagui/tailwind/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  build: {
    rollupOptions: {
      // streaming.html is the program-block streaming fixture; it needs a real
      // built client bundle so the streamed document can hydrate
      input: {
        index: 'index.html',
        streaming: 'streaming.html',
      },
    },
  },
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      useReactNativeWebLite: true,
    }),
  ].filter(Boolean),
})
