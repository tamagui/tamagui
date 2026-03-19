import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  resolve: {
    alias: [
      {
        find: /^inline-style-prefixer\/lib\/(.*)$/,
        replacement: 'inline-style-prefixer/es/$1',
      },
      {
        find: /^css-in-js-utils\/lib\/(.*)$/,
        replacement: 'css-in-js-utils/es/$1',
      },
    ],
  },
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
    }),
  ].filter(Boolean),
})
