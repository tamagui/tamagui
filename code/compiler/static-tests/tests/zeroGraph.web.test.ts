import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { checkZeroGraph, formatZeroGraphFailure } from '@tamagui/static'
import { describe, expect, test } from 'vitest'

/**
 * The gate matches on the package that owns a module, so a project that names
 * itself `@tamagui/something` used to see every one of its own modules reported
 * as a forbidden Tamagui module. Ownership is the distinction that holds:
 * Tamagui arrives as a resolved dependency, under a different package.json than
 * the one being built.
 */
function project(name: string) {
  const root = mkdtempSync(path.join(tmpdir(), 'zero-graph-'))
  writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name }))
  const entry = path.join(root, 'src', 'main.js')
  mkdirSync(path.dirname(entry), { recursive: true })
  writeFileSync(entry, '')

  const dependency = path.join(root, 'node_modules', '@tamagui', 'web')
  mkdirSync(path.join(dependency, 'dist'), { recursive: true })
  writeFileSync(
    path.join(dependency, 'package.json'),
    JSON.stringify({ name: '@tamagui/web' })
  )
  const runtime = path.join(dependency, 'dist', 'createComponent.mjs')
  writeFileSync(runtime, '')

  return { root, entry, runtime }
}

describe('the zero graph gate', () => {
  test("does not report a project's own modules for being named like Tamagui", () => {
    const app = project('@tamagui/app')

    const checked = checkZeroGraph({
      root: app.root,
      entries: [app.entry],
      modules: [{ id: app.entry, importers: [] }],
    })

    expect(checked.tamaguiModules).toEqual([])
    expect(checked.forbidden).toEqual([])
  })

  test('still reports a resolved Tamagui dependency in that same project', () => {
    const app = project('@tamagui/app')

    const checked = checkZeroGraph({
      root: app.root,
      entries: [app.entry],
      modules: [
        { id: app.entry, importers: [] },
        { id: app.runtime, importers: [app.entry] },
      ],
    })

    expect(checked.tamaguiModules).toEqual([app.runtime])
    expect(checked.forbidden.map((entry) => entry.id)).toEqual([app.runtime])
    expect(checked.forbidden[0]?.owner).toBe('@tamagui/web')
  })

  test("holds when the entry is not the project's own module", () => {
    const app = project('@tamagui/app')
    // webpack's entry for a Next app is node_modules/next/dist/client/next.js,
    // so deriving the project from its entries reads `next` as the project and
    // the exclusion never applies
    const frameworkEntry = path.join(
      app.root,
      'node_modules',
      'next',
      'dist',
      'client',
      'next.js'
    )
    mkdirSync(path.dirname(frameworkEntry), { recursive: true })
    writeFileSync(
      path.join(app.root, 'node_modules', 'next', 'package.json'),
      '{"name":"next"}'
    )
    writeFileSync(frameworkEntry, '')

    const checked = checkZeroGraph({
      root: app.root,
      entries: [frameworkEntry],
      modules: [
        { id: frameworkEntry, importers: [] },
        { id: app.entry, importers: [frameworkEntry] },
      ],
    })

    expect(checked.tamaguiModules).toEqual([])
    expect(checked.forbidden).toEqual([])
  })

  test('names the owning package in the failure, which the path does not show', () => {
    const app = project('my-app')
    const checked = checkZeroGraph({
      root: app.root,
      entries: [app.entry],
      modules: [
        { id: app.entry, importers: [] },
        { id: app.runtime, importers: [app.entry] },
      ],
    })

    const message = formatZeroGraphFailure({
      integration: 'vite',
      graph: 'zero',
      entries: [app.entry],
      moduleCount: 2,
      tamaguiModules: checked.tamaguiModules,
      forbidden: checked.forbidden,
      cssArtifact: null,
      identity: 'test',
    })

    expect(message).toContain('(package @tamagui/web)')
  })
})
