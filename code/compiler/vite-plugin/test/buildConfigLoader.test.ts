import Static from '@tamagui/static'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { afterEach, expect, test, vi } from 'vitest'

// esbuild's build service is a child process, and it does not survive a Vite
// dev server restart: the next tamaguiPlugin() call lands on `write EPIPE` and
// takes the restart down with it. Vite already evaluates tamagui.config.ts and
// every component package through its own module runner, so the build file goes
// the same way and this integration needs no second toolchain at all.
//
// the whole point is that nothing here reaches esbuild, so this file replaces it
// with something that throws. it lives apart from loadTamagui.test.ts because
// the paths there do legitimately use esbuild.
vi.mock('esbuild', () => {
  const unavailable = () => {
    throw new Error('the Vite build config loader must not reach esbuild')
  }
  const stub = { build: unavailable, buildSync: unavailable, context: unavailable }
  return { ...stub, default: stub }
})

const { createViteTamaguiLoader, viteBuildConfigLoader } =
  await import('../src/loadTamagui')

const outputRoot = path.resolve(import.meta.dirname, 'fixtures/.build-config')

afterEach(async () => {
  await rm(outputRoot, { force: true, recursive: true })
})

test('evaluates tamagui.build.ts and reports every file it read', async () => {
  const root = path.join(outputRoot, 'project')
  await mkdir(root, { recursive: true })
  await writeFile(
    path.join(root, 'tamagui.build.ts'),
    `import { components } from './build-parts'
export default { components, config: './fixture.config.ts' }
`
  )
  await writeFile(
    path.join(root, 'build-parts.ts'),
    `export const components = ['tamagui', '@fixture/components']
`
  )

  const options = await Static.loadTamaguiBuildConfigAsync(
    { root, platform: 'web' },
    viteBuildConfigLoader
  )

  expect(options.components).toEqual(['tamagui', '@fixture/components'])
  expect(options.config).toBe('./fixture.config.ts')
  // the dependency list replaces esbuild's metafile inputs, and the plugin
  // watches it, so the relative import has to be in there too
  expect(Static.getTamaguiBuildConfigDependencies(options)).toEqual(
    expect.arrayContaining([
      path.join(root, 'tamagui.build.ts'),
      path.join(root, 'build-parts.ts'),
    ])
  )
})

test('retries a build config that failed to evaluate', async () => {
  // a build file is usually broken because it is mid-edit. holding onto the
  // rejected promise made one bad save poison every later load in the process,
  // which is what turned a typo into "server restart failed".
  const root = path.join(outputRoot, 'retry')
  const buildFile = path.join(root, 'tamagui.build.ts')
  await mkdir(root, { recursive: true })
  await writeFile(buildFile, `export default { components: [ \n`)

  const loader = createViteTamaguiLoader({ root, buildFile })
  await expect(loader.loadTamaguiBuildConfig()).rejects.toThrow()
  expect(loader.getLoadPromise()).toBeNull()

  await writeFile(buildFile, `export default { components: ['tamagui'] }\n`)
  const options = await loader.loadTamaguiBuildConfig()
  expect(options.components).toEqual(['tamagui'])
})
