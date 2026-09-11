import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'
import { describe, expect, test } from 'vitest'

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const sourcePath = join(fixtureDirectory, 'component.tsx')
const diagnosticsPath = join(fixtureDirectory, 'diagnostics.tsx')
const declarationsPath = join(fixtureDirectory, 'tamagui.d.ts')
const source = readFileSync(sourcePath, 'utf8')
const diagnosticsSource = readFileSync(diagnosticsPath, 'utf8')
const configPath = join(fixtureDirectory, 'tamagui.config.json')
const require = createRequire(import.meta.url)
const init = require('@tamagui/language-service') as ts.server.PluginModuleFactory

function createService() {
  let configContents = readFileSync(configPath, 'utf8')
  let baseCompletionCalls = 0
  const files = new Map([
    [sourcePath, { version: 0, text: source }],
    [diagnosticsPath, { version: 0, text: diagnosticsSource }],
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
  base.getCompletionsAtPosition = () => {
    baseCompletionCalls++
    return undefined
  }
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
    baseCompletionCalls: () => baseCompletionCalls,
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
    expect(fixture.baseCompletionCalls()).toBe(0)
    expect(namesAt('bg="blue hover:"')).toEqual(['blue', 'surface'])
    expect(namesAt('bg="blue hover:b"')).toEqual(['blue', 'surface'])
    expect(namesAt('bg="blue "')).toEqual(
      expect.arrayContaining(['@sm', 'dark', 'group-hover', 'hover', 'sm'])
    )
    const afterWhitespacePosition = source.indexOf('bg="blue "') + 'bg="blue '.length
    expect(
      fixture.service.getCompletionsAtPosition(sourcePath, afterWhitespacePosition, {})
    ).toMatchObject({ isIncomplete: true })
    const modifierEntries = fixture.entriesAt('bg="blue "')
    const orderedModifiers = [...modifierEntries].sort((left, right) =>
      left.sortText.localeCompare(right.sortText)
    )
    expect(orderedModifiers.slice(0, 2).map((entry) => entry.name)).toEqual([
      'hover',
      'press',
    ])
    expect(modifierEntries.find((entry) => entry.name === 'hover')).toMatchObject({
      sortText: '00:000:hover',
      labelDetails: { description: 'Tamagui state modifier' },
    })
    expect(modifierEntries.find((entry) => entry.name === 'sm')).toMatchObject({
      labelDetails: { description: 'Tamagui media modifier' },
    })
    expect(modifierEntries.find((entry) => entry.name === '@sm')).toMatchObject({
      labelDetails: { description: 'Tamagui container modifier' },
    })
    expect(modifierEntries.find((entry) => entry.name === 'group-hover')).toMatchObject({
      labelDetails: { description: 'Tamagui group modifier' },
    })
    expect(modifierEntries.find((entry) => entry.name === 'dark')).toMatchObject({
      labelDetails: { description: 'Tamagui theme modifier' },
    })
    expect(fixture.entriesAt('bg="blue s"')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'sm',
          insertText: 'sm:',
          replacementSpan: { start: source.indexOf('bg="blue s"') + 9, length: 1 },
        }),
      ])
    )
    expect(fixture.entriesAt('bg="blue sm:"')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hover',
          insertText: 'hover:',
          replacementSpan: {
            start: source.indexOf('bg="blue sm:"') + 12,
            length: 0,
          },
        }),
      ])
    )
    expect(fixture.entriesAt('bg="blue sm:h"')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'hover',
          insertText: 'hover:',
          replacementSpan: {
            start: source.indexOf('bg="blue sm:h"') + 12,
            length: 1,
          },
        }),
      ])
    )
    const deepChainNeedle = 'padding="4 web:dark:@sm:sm:hover:"'
    const deepChainEntries = fixture.entriesAt(deepChainNeedle)
    expect(deepChainEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: '4',
          insertText: '4',
          replacementSpan: {
            start: source.indexOf(deepChainNeedle) + deepChainNeedle.length - 1,
            length: 0,
          },
        }),
      ])
    )
    expect(
      deepChainEntries.filter((entry) =>
        entry.labelDetails?.description?.endsWith(' modifier')
      )
    ).toEqual([])
    expect(namesAt('padding="4 sm:8 "')).toEqual(
      expect.arrayContaining(['web', 'dark', '@sm', 'sm', 'hover'])
    )
    expect(
      modifierEntries
        .filter((entry) => entry.labelDetails?.description === 'Tamagui theme modifier')
        .map((entry) => entry.name)
    ).toEqual(['dark'])
    expect(namesAt('<Text fontSize=""')).toEqual(['xl'])
    expect(namesAt('<View display=""')).toEqual(['flex'])
    expect(namesAt('<View fontSize=""')).toEqual([])
    expect(namesAt('<View shadowColor="hover:"')).toEqual([])
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

  test('reports flat value diagnostics with exact spans', () => {
    const fixture = createService()
    const diagnostics = fixture.service
      .getSemanticDiagnostics(diagnosticsPath)
      .filter((diagnostic) => diagnostic.source === '@tamagui/language-service')

    const spans = diagnostics.map((diagnostic) => ({
      code: diagnostic.code,
      message: diagnostic.messageText,
      text: diagnosticsSource.slice(
        diagnostic.start!,
        diagnostic.start! + diagnostic.length!
      ),
    }))

    expect(spans).toEqual([
      {
        code: 78711,
        message: '"hver" is not a registered modifier',
        text: 'hver',
      },
      {
        code: 78711,
        message:
          '"blue/150" is not an opacity suffix: it must be an integer percentage from 0 through 100',
        text: 'blue/150',
      },
      {
        code: 78711,
        message: 'the "hover:" clause has no value',
        text: ':',
      },
      {
        code: 78711,
        message:
          '"blue" contributes to "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "borderInlineStartColor", "borderInlineEndColor", "borderBlockStartColor", "borderBlockEndColor", "outlineColor", "color", "textDecorationColor", "textShadowColor", not "padding"',
        text: 'blue',
      },
    ])
    fixture.service.dispose()
  })

  test('hovers tokens, theme values, and modifiers with resolved config values', () => {
    const fixture = createService()
    const hoverAt = (needle: string, offsetInNeedle: number) => {
      const position = source.indexOf(needle) + offsetInNeedle
      return fixture.service.getQuickInfoAtPosition(sourcePath, position)
    }

    const token = hoverAt('bg="blue hover:"', 5)
    expect(token?.documentation?.[0]?.text).toContain('#0000ff')
    expect(
      source.slice(token!.textSpan.start, token!.textSpan.start + token!.textSpan.length)
    ).toBe('blue')

    const modifier = hoverAt('padding="4 sm:8 "', 12)
    expect(modifier?.documentation?.[0]?.text).toContain('media modifier')
    expect(modifier?.documentation?.[0]?.text).toContain('maxWidth')

    const space = hoverAt('padding="4 sm:8 "', 9)
    expect(space?.documentation?.[0]?.text).toContain('space token')
    expect(space?.documentation?.[0]?.text).toContain('16')

    fixture.service.dispose()
  })
})
