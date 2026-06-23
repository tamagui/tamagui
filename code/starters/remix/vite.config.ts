import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [reactRouter(), tamaguiPlugin()],
})
