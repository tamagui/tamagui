import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const extract = process.env.EXTRACT === '1'

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      optimize: extract,
      disableExtraction: !extract,
    }),
  ],
})
