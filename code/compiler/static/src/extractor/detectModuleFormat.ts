import { readFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'

type ModuleFormat = 'cjs' | 'esm'

// cache per directory to avoid repeated fs reads
const formatCache = new Map<string, ModuleFormat>()

export function detectModuleFormat(filePath: string): ModuleFormat {
  const ext = extname(filePath)

  // definitive by extension
  if (ext === '.mjs') return 'esm'
  if (ext === '.cjs') return 'cjs'

  // walk up to find nearest package.json with "type" field
  let dir = dirname(filePath)
  while (true) {
    if (formatCache.has(dir)) {
      return formatCache.get(dir)!
    }

    try {
      const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'))
      const format: ModuleFormat = pkg.type === 'module' ? 'esm' : 'cjs'
      formatCache.set(dir, format)
      return format
    } catch {
      // no package.json or malformed, keep walking
    }

    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return 'cjs'
}

export function clearFormatCache() {
  formatCache.clear()
}
