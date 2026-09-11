// The VS Code side of the Tamagui language server.
//
// There is almost nothing here on purpose. Everything the extension used to do
// in JavaScript (parse the file, project the config, compute completions,
// diagnostics, hovers and colour swatches) now lives in the `tamagui-lsp`
// binary, which every other editor talks to the same way. This file starts that
// process and gets out of the way, so VS Code cannot drift from Neovim, Helix,
// Zed or anything else.

const vscode = require('vscode')

/** @type {import('vscode-languageclient/node').LanguageClient | undefined} */
let client

async function activate(context) {
  const { LanguageClient, TransportKind } = require('vscode-languageclient/node')

  let command
  try {
    // `@tamagui/lsp` is ESM-only, and an extension host is CJS
    const { binaryPath } = await import('@tamagui/lsp')
    command = binaryPath()
  } catch (error) {
    // the launcher throws with the actual fix (usually --omit=optional, or an
    // unsupported platform), so show that rather than a generic failure
    vscode.window.showErrorMessage(`Tamagui: ${error.message}`)
    return
  }

  client = new LanguageClient(
    'tamagui',
    'Tamagui',
    { command, transport: TransportKind.stdio },
    {
      documentSelector: [
        { scheme: 'file', language: 'typescriptreact' },
        { scheme: 'file', language: 'javascriptreact' },
      ],
      // the server watches the artifact itself and republishes on its own, so
      // there is no client-side invalidation to keep in sync
      outputChannelName: 'Tamagui',
    }
  )

  await client.start()
  context.subscriptions.push(client)
}

function deactivate() {
  return client?.stop()
}

module.exports = { activate, deactivate }
