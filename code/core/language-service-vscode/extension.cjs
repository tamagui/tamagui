const vscode = require('vscode')

function activate(context) {
  let requesting = false

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [{ language: 'javascriptreact' }, { language: 'typescriptreact' }],
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
