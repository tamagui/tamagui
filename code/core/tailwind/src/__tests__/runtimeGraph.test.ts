import { resolve } from 'node:path'
import { build } from 'esbuild'
import { describe, expect, test } from 'vitest'

const repositoryRoot = new URL('../../../../../', import.meta.url).pathname

async function bundledInputs(
  entry: string,
  native = false,
  platform: 'browser' | 'node' | 'neutral' = native ? 'neutral' : 'browser'
) {
  const result = await build({
    absWorkingDir: repositoryRoot,
    entryPoints: [entry],
    bundle: true,
    write: false,
    metafile: true,
    platform,
    format: 'esm',
    conditions: native
      ? ['react-native', 'import', 'module', 'default']
      : ['browser', 'import', 'module', 'default'],
    logLevel: 'silent',
    external: ['react', 'react/*', 'react-native', 'react-native/*'],
  })
  return Object.keys(result.metafile.inputs).map((file) =>
    resolve(repositoryRoot, file).replaceAll('\\', '/')
  )
}

describe('the shipped frontend runtime graphs', () => {
  test('the compiler fixture reaches the tooling entry', async () => {
    const files = await bundledInputs(
      'code/core/tailwind/src/__tests__/fixtures/compilerTooling.ts',
      false,
      'node'
    )

    expect(
      files.some((file) => file.endsWith('/compiler/static/dist/esm/compilerHost.mjs'))
    ).toBe(true)
    for (const module of ['tooling', 'ast/valueParser', 'programs/modifierRegistry']) {
      expect(
        files.some((file) => file.endsWith(`/core/style-grammar/dist/esm/${module}.mjs`)),
        module
      ).toBe(true)
    }
  })

  test.each([
    ['browser', false],
    ['native', true],
  ] as const)(
    'a loaded app with ThemeUpdate and Tailwind keeps compiler tooling out under %s conditions',
    async (_target, native) => {
      const files = await bundledInputs(
        'code/core/tailwind/src/__tests__/fixtures/runtimeGraphApp.tsx',
        native
      )

      expect(
        files.some((file) =>
          file.endsWith(
            native
              ? '/core/tailwind/dist/esm/index.native.js'
              : '/core/tailwind/dist/esm/index.mjs'
          )
        )
      ).toBe(true)
      expect(
        files.some((file) =>
          file.endsWith(
            native
              ? '/core/core/dist/esm/theme-update.native.js'
              : '/core/core/dist/esm/theme-update.mjs'
          )
        )
      ).toBe(true)
      expect(
        files.some((file) =>
          file.endsWith(
            native
              ? '/core/style-grammar/dist/esm/runtime.native.js'
              : '/core/style-grammar/dist/esm/runtime.mjs'
          )
        )
      ).toBe(true)
      for (const module of ['modifierVocabulary', 'scanFlatValue', 'clauseIdentity']) {
        expect(
          files.some((file) =>
            file.endsWith(
              `/core/style-grammar/dist/esm/runtime/${module}${native ? '.native.js' : '.mjs'}`
            )
          ),
          module
        ).toBe(true)
      }
      expect(
        files.filter((file) =>
          /\/core\/style-grammar\/dist\/esm\/(?:ast\/(?:payloadShape|serializePayload|valueParser)|programs\/(?:clauseCapability|clauseSources|evaluateProgram|lowerProgram|modifierRegistry|programEligibility|programHash|programs)|shorthands\/(?:backgroundFamily|borderFamily|fontShorthand|geometricShorthand|textDecorationFamily|transformFamily|transition(?:Align|Legacy|Native)?)|tooling\/(?:candidateTarget|table|tooling(?:Annotations|Diagnostics|Format|Registry)))(?:\.native)?\.(?:mjs|js)$/.test(
            file
          )
        )
      ).toEqual([])
    }
  )

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
