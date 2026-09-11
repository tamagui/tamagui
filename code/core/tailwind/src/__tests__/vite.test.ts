import {
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'

import { tamaguiPlugin } from '../vite'
import {
  createTailwindScannerState,
  isTamaguiCoreResetCSS,
  TAILWIND_RESOLVED_ID,
  TAILWIND_VIRTUAL_ID,
  updateTailwindForWatchChange,
} from '../vite/state'

const temporaryRoots: string[] = []
const require = createRequire(import.meta.url)

async function createRoot(version = '4.3.0') {
  const root = await mkdtemp(path.join(os.tmpdir(), 'tamagui-tailwind-'))
  temporaryRoots.push(root)
  await mkdir(path.join(root, 'node_modules'), { recursive: true })
  if (version === '4.3.0') {
    const tailwindPackage = require.resolve('tailwindcss/package.json')
    await symlink(
      path.dirname(tailwindPackage),
      path.join(root, 'node_modules/tailwindcss')
    )
  } else {
    const packageRoot = path.join(root, 'node_modules/tailwindcss')
    await mkdir(packageRoot, { recursive: true })
    await writeFile(
      path.join(packageRoot, 'package.json'),
      JSON.stringify({
        name: 'tailwindcss',
        version,
        exports: { './package.json': './package.json' },
      })
    )
  }
  return root
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true })))
})

describe('the official Tailwind scanner state', () => {
  test('builds only current unclaimed candidates without preflight', async () => {
    const root = await createRoot()
    const sourcePath = path.join(root, 'App.tsx')
    await writeFile(sourcePath, '<View className="p-4 columns-2" />')

    const state = createTailwindScannerState()
    await state.configure(root, 0, { tokensParsed: { space: { 4: 16 } } }, () => {})

    expect(state.css).toContain('.columns-2')
    expect(state.candidateCount).toBe(2)
    expect(state.css).not.toMatch(/\.p-4(?:[,{:]|\s)/)
    expect(state.css).not.toContain('box-sizing: border-box;')

    expect(await state.scanSource(sourcePath, '<View className="columns-3" />')).toBe(
      true
    )
    expect(state.css).toContain('.columns-3')
    expect(state.candidateCount).toBe(2)
    expect(state.css).not.toContain('.columns-2')

    expect(await state.removeSource(sourcePath)).toBe(true)
    expect(state.css).not.toContain('.columns-3')

    expect(await state.scanSource(sourcePath, '<View className="columns-2" />')).toBe(
      true
    )
    expect(state.css).toContain('.columns-2')
  })

  test('registers scanner-owned sources and rebuilds them through watch changes', async () => {
    const root = await createRoot()
    const sourcePath = path.join(root, 'scanner-only.html')
    await writeFile(sourcePath, '<div class="columns-2" />')
    const dependencies: string[] = []
    const sourceGlobs: string[] = []
    const state = createTailwindScannerState()

    const configure = () =>
      state.configure(
        root,
        0,
        {},
        (file) => dependencies.push(file),
        (glob) => sourceGlobs.push(glob)
      )

    await configure()

    expect(dependencies).toContain(await realpath(sourcePath))
    expect(sourceGlobs.length).toBeGreaterThan(0)
    expect(state.css).toContain('.columns-2')
    const normalizedSourcePath = await realpath(sourcePath)
    const registeredGlobCount = sourceGlobs.length

    await writeFile(sourcePath, '<div class="columns-3" />')
    expect(
      await updateTailwindForWatchChange(state, sourcePath, 'update', configure)
    ).toBe(true)
    expect(dependencies.filter((file) => file === normalizedSourcePath)).toHaveLength(1)
    expect(sourceGlobs).toHaveLength(registeredGlobCount)
    expect(state.css).toContain('.columns-3')
    expect(state.css).not.toContain('.columns-2')

    await rm(sourcePath)
    expect(
      await updateTailwindForWatchChange(state, sourcePath, 'delete', configure)
    ).toBe(true)
    expect(state.css).not.toContain('.columns-3')
  })

  test('stays off when Tamagui itself is disabled for the build', async () => {
    const root = await createRoot()
    await writeFile(path.join(root, 'App.tsx'), '<View className="columns-2" />')
    const state = createTailwindScannerState()

    expect(await state.configure(root, 0, null, () => {})).toBe(false)
    expect(state.enabled).toBe(false)
    expect(state.css).toBe('')
  })

  test('reports an actionable host Tailwind version mismatch', async () => {
    const root = await createRoot('4.2.0')
    const state = createTailwindScannerState()

    await expect(state.configure(root, 0, {}, () => {})).rejects.toThrow(
      /requires tailwindcss@4\.3\.0.*4\.2\.0/
    )
  })
})

describe('the Tailwind Vite plugin', () => {
  const plugins = tamaguiPlugin() as any[]
  const plugin = plugins.find((entry) => entry?.name === 'tamagui-tailwind')
  const clientContext = { environment: { name: 'client' }, addWatchFile() {} }

  test('is added after the base Tamagui compiler plugins', () => {
    const names = plugins.map((entry) => entry?.name)
    expect(names).toContain('tamagui')
    expect(names).toContain('tamagui-compiler')
    expect(names.indexOf('tamagui-tailwind')).toBe(names.length - 1)
  })

  test('puts runtime-generated Tamagui CSS in the same layer as extracted CSS', () => {
    expect(plugin.config()).toMatchObject({
      define: {
        'process.env.TAMAGUI_CSS_LAYER': '"tamagui"',
      },
    })
  })

  test('layers the Tamagui core reset so Tailwind theme and utilities order after it', async () => {
    const resetPath = require.resolve('@tamagui/core/reset.css')
    const reset = await readFile(resetPath, 'utf8')

    expect(isTamaguiCoreResetCSS(resetPath)).toBe(true)
    const transformed = await plugin.transform.handler.call(
      clientContext,
      reset,
      resetPath
    )
    expect(transformed.code).toBe(`@layer tamagui {\n${reset}\n}`)
  })

  test('owns the virtual stylesheet id on the client only', () => {
    expect(plugin.resolveId.call(clientContext, TAILWIND_VIRTUAL_ID)).toBe(
      TAILWIND_RESOLVED_ID
    )
    expect(
      plugin.resolveId.call({ environment: { name: 'ssr' } }, TAILWIND_VIRTUAL_ID)
    ).toBeUndefined()
    expect(
      plugin.resolveId.call({ environment: { name: 'ios' } }, TAILWIND_VIRTUAL_ID)
    ).toBeUndefined()
  })
})
