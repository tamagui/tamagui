import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import commonjs from 'vite-plugin-commonjs'

export default defineConfig({
  plugins: [
    tamaguiPlugin({
      useReactNativeWebLite: true,
    }) as any,
    remixCloudflareDevProxy(),
    remix(),
    tsconfigPaths(),
    commonjs({
      filter(id) {
        if (id.includes('node_modules/@react-native/normalize-color')) {
          return true
        }
      },
    }),
  ],
})
