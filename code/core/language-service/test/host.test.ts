import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'
import { describe, expect, test } from 'vitest'
import { resolveTamaguiHost } from '../src/host'

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const sourcePath = join(fixtureDirectory, 'component.tsx')
const declarationsPath = join(fixtureDirectory, 'tamagui.d.ts')

function fixtureHosts() {
  const program = ts.createProgram({
    rootNames: [sourcePath, declarationsPath],
    options: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2020,
    },
  })
  const checker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(sourcePath)!
  const hosts = new Map<string, ReturnType<typeof resolveTamaguiHost>>()

  const visit = (node: ts.Node): void => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = node.tagName.getText(sourceFile)
      if (!hosts.has(name)) {
        hosts.set(name, resolveTamaguiHost(checker, node.tagName))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return hosts
}

describe('resolveTamaguiHost', () => {
  test('uses the staticConfig marker and component prop type', () => {
    const hosts = fixtureHosts()

    expect(hosts.get('View')?.accepts('display')).toBe(true)
    expect(hosts.get('View')?.accepts('color')).toBe(false)
    expect(hosts.get('Text')?.accepts('color')).toBe(true)
    expect(hosts.get('Frame')?.accepts('bg')).toBe(true)
    expect(hosts.get('Frame')?.accepts('fontSize')).toBe(false)
    expect(hosts.get('LogoIcon')).toBeUndefined()
    expect(hosts.get('div')).toBeUndefined()
  })
})
