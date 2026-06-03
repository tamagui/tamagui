import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// the tamagui leg runs WITHOUT the compiler (disableExtraction) so we test the pure
// runtime className → style path (what a user gets with no build step). The real-tailwind
// leg doesn't touch tamagui at all (DOM + CDN), so the plugin is harmless there.
export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      disableExtraction: true,
    }),
  ],
  server: {
    // cases.tsx lives one level up (shared with the native host)
    fs: { allow: ['..', '../..'] },
  },
})
