import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tamaguiPlugin(),
  ],
})
