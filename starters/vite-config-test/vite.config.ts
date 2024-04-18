import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import { config } from '@tamagui/config/v3'

// const tamaguiConfig = tamaguiExtractPlugin(config);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  // define: {
  // 	"process.env.TAMAGUI_BAIL_AFTER_SCANNING_X_CSS_RULES": false,
  // },
  plugins: [
    react(),
    // tamaguiPlugin(tamaguiConfig.options)
    tamaguiPlugin({
      config: config,
      components: ['tamagui'],
    }),
  ],
})
