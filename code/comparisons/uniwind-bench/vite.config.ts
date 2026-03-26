import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'
import { defineConfig } from 'vite'
import { rnw } from 'vite-plugin-rnw'

export default defineConfig({
  plugins: [
    rnw(),
    tailwindcss(),
    uniwind({
      cssEntryFile: './src/global.css',
    }),
  ],
})
