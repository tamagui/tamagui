import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const tamaguiConfig = {
  components: ['@tamagui/sandbox-ui', 'tamagui'],
  config: 'tamagui.config.ts',
}

export default defineConfig({
  clearScreen: true,
  plugins: [
    react(),
    tamaguiPlugin({
      ...tamaguiConfig,
      optimize: process.env.EXTRACT === '1',
    }),
  ].filter(Boolean),
})
