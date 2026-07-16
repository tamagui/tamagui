import { afterEach, describe, expect, test } from 'vitest'
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

import {
  createTailwindHybridState,
  layerTamaguiCoreResetCSS,
  updateTailwindForWatchChange,
} from '../src/tailwind'

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

describe('hybrid Tailwind compiler state', () => {
  test('layers the Tamagui core reset only in hybrid mode', () => {
    const css = 'button { all: unset; }'

    expect(
      layerTamaguiCoreResetCSS('/repo/node_modules/@tamagui/core/reset.css', css, true)
    ).toBe(`@layer tamagui {\n${css}\n}`)
    expect(
      layerTamaguiCoreResetCSS('/repo/code/core/core/reset.css?direct', css, true)
    ).toBe(`@layer tamagui {\n${css}\n}`)
    expect(
      layerTamaguiCoreResetCSS('/repo/node_modules/@tamagui/core/reset.css', css, false)
    ).toBeNull()
    expect(layerTamaguiCoreResetCSS('/repo/src/reset.css', css, true)).toBeNull()
  })

  test('builds only current unclaimed candidates without preflight', async () => {
    const root = await createRoot()
    const sourcePath = path.join(root, 'App.tsx')
    await writeFile(sourcePath, '<View className="p-4 grid grid-cols-2" />')

    const state = createTailwindHybridState()
    await state.configure(
      root,
      0,
      {
        settings: { styleMode: 'tamagui-and-tailwind' },
        tokensParsed: { space: { $4: 16 } },
      },
      () => {}
    )

    expect(state.css).toContain('.grid')
    expect(state.css).toContain('.grid-cols-2')
    expect(state.candidateCount).toBe(2)
    expect(state.css).not.toMatch(/\.p-4(?:[,{:]|\s)/)
    expect(state.css).not.toContain('box-sizing: border-box;')

    expect(await state.scanSource(sourcePath, '<View className="grid-cols-3" />')).toBe(
      true
    )
    expect(state.css).toContain('.grid-cols-3')
    expect(state.candidateCount).toBe(2)
    expect(state.css).not.toContain('.grid-cols-2')

    expect(await state.removeSource(sourcePath)).toBe(true)
    expect(state.css).not.toContain('.grid-cols-3')

    expect(await state.scanSource(sourcePath, '<View className="grid-cols-2" />')).toBe(
      true
    )
    expect(state.css).toContain('.grid-cols-2')
  })

  test('registers scanner-owned sources and rebuilds them through watch changes', async () => {
    const root = await createRoot()
    const sourcePath = path.join(root, 'scanner-only.html')
    await writeFile(sourcePath, '<div class="grid-cols-2" />')
    const dependencies: string[] = []
    const sourceGlobs: string[] = []
    const state = createTailwindHybridState()

    await state.configure(
      root,
      0,
      { settings: { styleMode: 'tailwind' } },
      (file) => dependencies.push(file),
      (glob) => sourceGlobs.push(glob)
    )

    expect(dependencies).toContain(await realpath(sourcePath))
    expect(sourceGlobs.length).toBeGreaterThan(0)
    expect(state.css).toContain('.grid-cols-2')
    const normalizedSourcePath = await realpath(sourcePath)
    const registeredGlobCount = sourceGlobs.length

    const configure = () =>
      state.configure(
        root,
        0,
        { settings: { styleMode: 'tailwind' } },
        (file) => dependencies.push(file),
        (glob) => sourceGlobs.push(glob)
      )

    await writeFile(sourcePath, '<div class="grid-cols-3" />')
    expect(
      await updateTailwindForWatchChange(state, sourcePath, 'update', configure)
    ).toBe(true)
    expect(dependencies.filter((file) => file === normalizedSourcePath)).toHaveLength(1)
    expect(sourceGlobs).toHaveLength(registeredGlobCount)
    expect(state.css).toContain('.grid-cols-3')
    expect(state.css).not.toContain('.grid-cols-2')

    await rm(sourcePath)
    expect(
      await updateTailwindForWatchChange(state, sourcePath, 'delete', configure)
    ).toBe(true)
    expect(state.css).not.toContain('.grid-cols-3')
  })

  test('reports an actionable host Tailwind version mismatch', async () => {
    const root = await createRoot('4.2.0')
    const state = createTailwindHybridState()

    await expect(
      state.configure(
        root,
        0,
        { settings: { styleMode: 'tamagui-and-tailwind' } },
        () => {}
      )
    ).rejects.toThrow(/requires tailwindcss@4\.3\.0.*4\.2\.0/)
  })
})
