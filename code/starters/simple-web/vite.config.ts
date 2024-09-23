import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: true,
  plugins: [
    react(),
    tamaguiPlugin({
      optimize: process.env.EXTRACT === '1',
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
    }),
  ].filter(Boolean),
})
