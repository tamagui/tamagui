const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const vscode = require('vscode')

const { createStyleTooling } = require('@tamagui/language-service/core')
const { createDocumentStyleTooling } = require('@tamagui/language-service/document')
const {
  createSucraseStyleSiteExtractor,
} = require('@tamagui/language-service/extract-sucrase')
const { parse } = require('sucrase/dist/parser')
const { TokenType } = require('sucrase/dist/parser/tokenizer/types')

const configRelativePath = join('.tamagui', 'tamagui.config.json')
const selector = [{ language: 'javascriptreact' }, { language: 'typescriptreact' }]

/** @type {Map<string, ReturnType<typeof loadFolderTooling>>} */
const toolingByFolder = new Map()

function loadFolderTooling(folder) {
  try {
    const contents = readFileSync(join(folder.uri.fsPath, configRelativePath), 'utf8')
    const tooling = createStyleTooling(JSON.parse(contents))
    if (!tooling) return null
    const extract = createSucraseStyleSiteExtractor(
      { parse, TokenType },
      { isStyleProp: (name) => tooling.isStyleProp(name) }
    )
    return createDocumentStyleTooling(tooling, extract)
  } catch {
    return null
  }
}

function documentTooling(document) {
  const folder = vscode.workspace.getWorkspaceFolder(document.uri)
  if (!folder) return null
  const key = folder.uri.toString()
  if (!toolingByFolder.has(key)) {
    toolingByFolder.set(key, loadFolderTooling(folder))
  }
  return toolingByFolder.get(key)
}

function activate(context) {
  let requesting = false

  // the compiler rewrites the config artifact; drop the cached projection
  const watcher = vscode.workspace.createFileSystemWatcher(
    '**/.tamagui/tamagui.config.json'
  )
  const invalidate = (uri) => {
    const folder = vscode.workspace.getWorkspaceFolder(uri)
    if (folder) toolingByFolder.delete(folder.uri.toString())
  }
  watcher.onDidChange(invalidate)
  watcher.onDidCreate(invalidate)
  watcher.onDidDelete(invalidate)
  context.subscriptions.push(watcher)

  // inline color swatches for theme values, color tokens, and literal colors
  context.subscriptions.push(
    vscode.languages.registerColorProvider(selector, {
      provideDocumentColors(document, token) {
        const tooling = documentTooling(document)
        if (!tooling || token.isCancellationRequested) return []
        return tooling
          .colors(document.getText())
          .map(
            (entry) =>
              new vscode.ColorInformation(
                new vscode.Range(
                  document.positionAt(entry.start),
                  document.positionAt(entry.end)
                ),
                new vscode.Color(
                  entry.color.r / 255,
                  entry.color.g / 255,
                  entry.color.b / 255,
                  entry.color.a
                )
              )
          )
      },
      provideColorPresentations(color, { document, range }) {
        const original = document.getText(range)
        // literal hex colors follow the picker; token names never rewrite —
        // the swatch is a preview of config values, not an editing surface
        if (original.startsWith('#')) {
          const hex = (channel) =>
            Math.round(channel * 255)
              .toString(16)
              .padStart(2, '0')
          const alpha = color.alpha < 1 ? hex(color.alpha) : ''
          return [
            new vscode.ColorPresentation(
              `#${hex(color.red)}${hex(color.green)}${hex(color.blue)}${alpha}`
            ),
          ]
        }
        return [new vscode.ColorPresentation(original)]
      },
    })
  )

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      selector,
      {
        async provideCompletionItems(document, position, token) {
          if (requesting) return
          requesting = true
          try {
            // let VS Code's TypeScript extension synchronize the just-authored
            // colon before asking its provider for the delegated result
            await new Promise((resolve) => setTimeout(resolve, 0))
            if (token.isCancellationRequested) return
            const result = await vscode.commands.executeCommand(
              'vscode.executeCompletionItemProvider',
              document.uri,
              position
            )
            if (token.isCancellationRequested || !result) return
            const items = result.items.filter((item) => {
              const label = item.label
              return (
                typeof label !== 'string' && label.description?.startsWith('Tamagui ')
              )
            })
            return items.length === 0 ? undefined : new vscode.CompletionList(items, true)
          } finally {
            requesting = false
          }
        },
      },
      ':'
    )
  )
}

module.exports = { activate }
