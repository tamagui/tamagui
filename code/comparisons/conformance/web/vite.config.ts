import tailwindcss from '@tailwindcss/vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tailwind v4 oracle via its vite plugin (module-graph content detection).
// the tamagui leg runs WITHOUT the compiler (disableExtraction) so we test the pure runtime
// className → style path; tamagui converts+removes the classes, so the loaded tailwind CSS
// never matches tamagui's DOM (safe to load globally).
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      disableExtraction: true,
    }),
  ],
  server: {
    fs: { allow: ['..', '../..'] },
  },
})
