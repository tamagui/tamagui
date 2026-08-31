import type { Plugin } from 'vite'
import ts from 'typescript'

type ReplacementSpec = {
  file: string
  names: Set<string>
}

function replacementSpecs(value: string): ReplacementSpec[] {
  return value.split(';').map((entry) => {
    const separator = entry.lastIndexOf(':')
    if (separator === -1) {
      throw new Error(`invalid BUNDLE_AUDIT_REPLACE entry: ${entry}`)
    }
    return {
      file: entry.slice(0, separator),
      names: new Set(entry.slice(separator + 1).split(',')),
    }
  })
}

export function bundleTopLevelReplacementPlugin(): Plugin | false {
  const value = process.env.BUNDLE_AUDIT_REPLACE
  if (!value) return false
  const specs = replacementSpecs(value)

  return {
    name: 'comparison-bundle-top-level-replacement',
    enforce: 'pre',
    transform(code, id) {
      const spec = specs.find(({ file }) => id.replaceAll('\\', '/').endsWith(file))
      if (!spec) return

      const sourceFile = ts.createSourceFile(
        id,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.JS
      )
      const edits: Array<{ start: number; end: number; value: string }> = []
      const found = new Set<string>()

      for (const statement of sourceFile.statements) {
        if (
          ts.isFunctionDeclaration(statement) &&
          statement.name &&
          statement.body &&
          spec.names.has(statement.name.text)
        ) {
          found.add(statement.name.text)
          edits.push({
            start: statement.body.getStart(sourceFile),
            end: statement.body.getEnd(),
            value: '{return globalThis.__bundleAuditOpaque(...arguments)}',
          })
          continue
        }
        if (!ts.isVariableStatement(statement)) continue
        for (const declaration of statement.declarationList.declarations) {
          if (
            ts.isIdentifier(declaration.name) &&
            declaration.initializer &&
            spec.names.has(declaration.name.text)
          ) {
            found.add(declaration.name.text)
            edits.push({
              start: declaration.initializer.getStart(sourceFile),
              end: declaration.initializer.getEnd(),
              value: '(...args)=>globalThis.__bundleAuditOpaque(...args)',
            })
          }
        }
      }

      for (const name of spec.names) {
        if (!found.has(name)) {
          throw new Error(`BUNDLE_AUDIT_REPLACE could not find ${name} in ${id}`)
        }
      }
      edits.sort((a, b) => b.start - a.start)
      for (const edit of edits) {
        code = code.slice(0, edit.start) + edit.value + code.slice(edit.end)
      }
      return { code, map: null }
    },
  }
}
