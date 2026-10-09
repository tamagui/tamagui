import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vitest/config'
import native from '../../core/tailwind/vitest.native.config'

// runs the dump under the tailwind package's native resolution
const config = mergeConfig(native, {
  root: fileURLToPath(new URL('../../core/tailwind', import.meta.url)),
})
// mergeConfig concatenates arrays, and only the dump should run
config.test.include = [
  fileURLToPath(new URL('./tamagui.native.test.tsx', import.meta.url)),
]
export default config
