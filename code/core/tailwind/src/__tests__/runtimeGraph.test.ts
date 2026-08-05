import { resolve } from 'node:path'
import { build } from 'esbuild'
import { describe, expect, test } from 'vitest'

const repositoryRoot = new URL('../../../../../', import.meta.url).pathname

async function bundledInputs(entry: string) {
  const result = await build({
    absWorkingDir: repositoryRoot,
    entryPoints: [entry],
    bundle: true,
    write: false,
    metafile: true,
    platform: 'browser',
    format: 'esm',
    logLevel: 'silent',
    external: ['react', 'react/*', 'react-native', 'react-native/*'],
  })
  return Object.keys(result.metafile.inputs).map((file) =>
    resolve(repositoryRoot, file).replaceAll('\\', '/')
  )
}

describe('the shipped frontend runtime graphs', () => {
  test('the tailwind root uses the private runtime without regular roots or native setup', async () => {
    const files = await bundledInputs('code/core/tailwind/dist/esm/index.mjs')

    expect(files.some((file) => file.endsWith('/core/tailwind/dist/esm/index.mjs'))).toBe(
      true
    )
    expect(
      files.some((file) => file.endsWith('/core/core/dist/esm/internal-runtime.mjs'))
    ).toBe(true)
    expect(
      files.some((file) => file.endsWith('/core/web/dist/esm/internal-runtime.mjs'))
    ).toBe(true)
    expect(
      files.filter(
        (file) =>
          file.endsWith('/core/core/dist/esm/index.mjs') ||
          file.endsWith('/core/web/dist/esm/index.js') ||
          file.includes('/core/config/') ||
          file.includes('/core/react-native-media-driver/') ||
          file.includes('/core/to-tailwind/') ||
          file.includes('/core/tailwind/dist/esm/vite') ||
          file.includes('/node_modules/@tailwindcss/') ||
          file.includes('/node_modules/tailwindcss/')
      )
    ).toEqual([])
  })

  test('the regular core root cannot reach the tailwind frontend', async () => {
    const files = await bundledInputs('code/core/core/dist/esm/index.mjs')

    expect(files.some((file) => file.endsWith('/core/core/dist/esm/index.mjs'))).toBe(
      true
    )
    expect(
      files.filter(
        (file) =>
          file.includes('/core/tailwind/') ||
          file.includes('/node_modules/@tailwindcss/') ||
          file.includes('/node_modules/tailwindcss/')
      )
    ).toEqual([])
  })
})
