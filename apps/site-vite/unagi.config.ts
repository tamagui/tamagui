import { defineConfig } from '@tamagui/unagi/config'

export default defineConfig({
  // @ts-ignore
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
})
