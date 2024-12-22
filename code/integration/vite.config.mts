import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      optimize: true,
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
    }),
  ].filter(Boolean),
})
