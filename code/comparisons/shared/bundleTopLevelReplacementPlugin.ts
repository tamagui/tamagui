import type { Plugin } from 'vite'
import { topLevelDeclarations } from './topLevelDeclarations'

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

      const edits: Array<{ start: number; end: number; value: string }> = []
      const found = new Set<string>()

      for (const declaration of topLevelDeclarations(id, code)) {
        if (!spec.names.has(declaration.name)) continue
        found.add(declaration.name)
        if (declaration.kind === 'function') {
          edits.push({
            start: declaration.replacementStart,
            end: declaration.replacementEnd,
            value: '{return globalThis.__bundleAuditOpaque(...arguments)}',
          })
          continue
        }
        edits.push({
          start: declaration.replacementStart,
          end: declaration.replacementEnd,
          value: '(...args)=>globalThis.__bundleAuditOpaque(...args)',
        })
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
