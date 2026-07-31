import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'
import { describe, expect, test } from 'vitest'

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const sourcePath = join(fixtureDirectory, 'component.tsx')
const declarationsPath = join(fixtureDirectory, 'tamagui.d.ts')
const source = readFileSync(sourcePath, 'utf8')
const configPath = join(fixtureDirectory, 'tamagui.config.json')
const require = createRequire(import.meta.url)
const init = require('@tamagui/language-service') as ts.server.PluginModuleFactory

function createService() {
  let configContents = readFileSync(configPath, 'utf8')
  const files = new Map([
    [sourcePath, { version: 0, text: source }],
    [declarationsPath, { version: 0, text: readFileSync(declarationsPath, 'utf8') }],
  ])
  const host: ts.LanguageServiceHost = {
    getCompilationSettings: () => ({
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2020,
    }),
    getScriptFileNames: () => [...files.keys()],
    getScriptVersion: (fileName) => `${files.get(fileName)?.version || 0}`,
    getScriptSnapshot(fileName) {
      const text = files.get(fileName)?.text || ts.sys.readFile(fileName)
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text)
    },
    getCurrentDirectory: () => fixtureDirectory,
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  }
  let watchClosed = false
  let configChanged: ts.FileWatcherCallback | undefined
  const base = ts.createLanguageService(host)
  base.getCompletionsAtPosition = () => undefined
  const plugin = init({ typescript: ts })
  const service = plugin.create({
    languageService: base,
    languageServiceHost: host,
    project: {
      getCurrentDirectory: () => fixtureDirectory,
    },
    serverHost: {
      readFile: (fileName) =>
        fileName === configPath ? configContents : ts.sys.readFile(fileName),
      watchFile: (_fileName, callback) => {
        configChanged = callback
        return {
          close() {
            watchClosed = true
          },
        }
      },
    },
    config: {
      configPath,
    },
  } as ts.server.PluginCreateInfo)

  return {
    service,
    entriesAt(needle: string) {
      const position = source.indexOf(needle) + needle.length - 1
      const completions = service.getCompletionsAtPosition(sourcePath, position, {})
      return (
        completions?.entries.filter(
          (entry) => entry.source === '@tamagui/language-service'
        ) || []
      )
    },
    updateConfig(update: (config: any) => void) {
      const config = JSON.parse(configContents)
      update(config)
      configContents = JSON.stringify(config)
      configChanged?.(configPath, ts.FileWatcherEventKind.Changed)
    },
    watchWasClosed: () => watchClosed,
  }
}

describe('@tamagui/language-service', () => {
  test('exposes the factory shape tsserver requires from the packaged CJS entry', () => {
    const factory = require('@tamagui/language-service')

    expect(typeof factory).toBe('function')
    expect(factory({ typescript: ts })).toMatchObject({
      create: expect.any(Function),
    })
  })

  test('completes real Tamagui source from the generated runtime config', () => {
    const fixture = createService()
    const namesAt = (needle: string) =>
      fixture.entriesAt(needle).map((entry) => entry.name)

    expect(namesAt('bg=""')).toEqual(['blue', 'surface'])
    expect(namesAt('bg="blue hover:"')).toEqual(['blue', 'surface'])
    expect(namesAt('bg="blue hover:b"')).toEqual(['blue', 'surface'])
    expect(namesAt('bg="blue "')).toEqual(expect.arrayContaining(['dark', 'hover', 'sm']))
    expect(namesAt('<Text fontSize=""')).toEqual(['xl'])
    expect(namesAt('<View display=""')).toEqual(['flex'])
    expect(namesAt('<View fontSize=""')).toEqual([])
    expect(namesAt("padding: ''")).toEqual(['4'])
    expect(namesAt("roomy: {\n      padding: ''")).toEqual([])
    expect(namesAt("fontSize: ''")).toEqual([])
    expect(namesAt('<LogoIcon color=""')).toEqual([])
    expect(namesAt('color=""')).toEqual([])

    for (const needle of [
      "bg={'\\x62lue'",
      'bg={`\\x62lue`',
      "bg={'blue hover\\x3ared'",
    ]) {
      expect(namesAt(needle)).toEqual([])
    }

    fixture.updateConfig((config) => {
      config.tamaguiConfig.tokens.color = { green: '#00ff00' }
      config.tamaguiConfig.themes = {
        dark: {
          fresh: '#eeeeee',
        },
      }
    })
    expect(namesAt('bg=""')).toEqual(['fresh', 'green'])

    fixture.service.dispose()
    expect(fixture.watchWasClosed()).toBe(true)
  })
})
