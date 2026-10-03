import { eachMapping, TraceMap } from '@jridgewell/trace-mapping'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { gzipSync } from 'node:zlib'

const root = import.meta.dirname
const gzip = (text: string | Buffer) => gzipSync(text, { level: 9 }).length
const hash = (text: string | Buffer) => createHash('sha256').update(text).digest('hex')

function packageName(source: string | null) {
  if (!source) return 'bundler/unmapped'
  const path = source.replaceAll('\\', '/')
  const rest = path.split('node_modules/').at(-1)!
  if (rest !== path) {
    const parts = rest.split('/')
    return parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
  }
  if (/rolldown|vite\//.test(path) || path.includes('\0')) return 'bundler/helpers'
  return 'app'
}

function group(name: string) {
  if (name === 'react') return 'React'
  if (name === 'react-dom' || name === 'scheduler') return 'React DOM + scheduler'
  if (
    name.startsWith('@tamagui/') ||
    ['tamagui', 'nativewind', 'react-native-css', 'uniwind'].includes(name)
  )
    return 'framework'
  if (name.startsWith('bundler/')) return 'bundler'
  if (name === 'app') return 'app'
  return 'platform + other dependencies'
}

for (const arm of process.argv.slice(2)) {
  const dist = join(root, arm, 'dist')
  const chunks: Array<{
    file: string
    code: string
    spans: Array<{ start: number; end: number; package: string; source: string | null }>
  }> = []
  const css: Array<{
    file: string
    minBytes: number
    gzipBytes: number
    sha256: string
  }> = []
  function visit(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        visit(path)
        continue
      }
      if (entry.name.endsWith('.css')) {
        const contents = readFileSync(path)
        css.push({
          file: path.slice(dist.length + 1),
          minBytes: contents.length,
          gzipBytes: gzip(contents),
          sha256: hash(contents),
        })
      }
      if (!entry.name.endsWith('.js')) continue
      const code = readFileSync(path, 'utf8')
      const map = new TraceMap(JSON.parse(readFileSync(`${path}.map`, 'utf8')))
      const offsets = [0]
      for (let i = 0; i < code.length; i++) if (code[i] === '\n') offsets.push(i + 1)
      const points: Array<{ offset: number; source: string | null }> = [
        { offset: 0, source: null },
      ]
      eachMapping(map, (m) => {
        const offset = offsets[m.generatedLine - 1] + m.generatedColumn
        if (!Number.isFinite(offset) || offset > code.length)
          throw new Error('invalid source mapping')
        points.push({ offset, source: m.source })
      })
      points.push({ offset: code.length, source: null })
      const spans = points.flatMap((p, i) => {
        const end = points[i + 1]?.offset ?? p.offset
        return end > p.offset
          ? [{ start: p.offset, end, package: packageName(p.source), source: p.source }]
          : []
      })
      if (
        spans.reduce((n, s) => n + Buffer.byteLength(code.slice(s.start, s.end)), 0) !==
        Buffer.byteLength(code)
      )
        throw new Error('source map spans do not cover complete emitted file')
      chunks.push({ file: path.slice(dist.length + 1), code, spans })
    }
  }
  visit(dist)
  const total = chunks.reduce((n, c) => n + gzip(c.code), 0)
  function measure(select: (pkg: string) => boolean) {
    let minBytes = 0,
      standaloneGzipBytes = 0,
      marginalGzipBytes = 0
    for (const chunk of chunks) {
      const selected: string[] = [],
        remainder: string[] = []
      for (const span of chunk.spans) {
        const text = chunk.code.slice(span.start, span.end)
        ;(select(span.package) ? selected : remainder).push(text)
      }
      const owned = selected.join('')
      if (!owned) continue
      minBytes += Buffer.byteLength(owned)
      standaloneGzipBytes += gzip(owned)
      marginalGzipBytes += gzip(chunk.code) - gzip(remainder.join(''))
    }
    return { minBytes, standaloneGzipBytes, marginalGzipBytes }
  }
  const names = [...new Set(chunks.flatMap((c) => c.spans.map((s) => s.package)))].sort()
  const packages = names
    .map((name) => ({
      name,
      group: group(name),
      ...measure((n) => n === name),
      sources: [
        ...new Set(
          chunks.flatMap((c) =>
            c.spans.filter((s) => s.package === name).map((s) => s.source)
          )
        ),
      ].sort(),
    }))
    .sort((a, b) => b.standaloneGzipBytes - a.standaloneGzipBytes)
  const groups = [...new Set(names.map(group))].map((name) => ({
    name,
    ...measure((n) => group(n) === name),
  }))
  const clientConfig =
    arm === 'tamagui'
      ? chunks
          .map((c) =>
            c.spans
              .filter((s) => s.source?.endsWith('/src/tamagui.config.ts'))
              .map((s) => c.code.slice(s.start, s.end))
              .join('')
          )
          .join('')
      : undefined
  if (arm === 'tamagui') {
    if (!clientConfig?.includes('themes:{}'))
      throw new Error('client config did not drop theme definitions')
    if (
      names.some((n) =>
        [
          'tamagui',
          '@tamagui/portal',
          '@tamagui/animations-css',
          '@tamagui/themes',
        ].includes(n)
      )
    )
      throw new Error('UI kit or optional theme/animation package shipped')
  }
  const versions: Record<string, string[]> = {}
  for (const chunk of chunks)
    for (const span of chunk.spans) {
      if (!span.source || span.package === 'app' || span.package.startsWith('bundler/'))
        continue
      let dir = dirname(resolve(dist, dirname(chunk.file), span.source))
      while (dir !== dirname(dir)) {
        const manifest = join(dir, 'package.json')
        if (existsSync(manifest)) {
          const pkg = JSON.parse(readFileSync(manifest, 'utf8'))
          if (pkg.name === span.package) {
            const found = (versions[pkg.name] ||= [])
            if (!found.includes(pkg.version)) found.push(pkg.version)
            break
          }
        }
        dir = dirname(dir)
      }
      if (!versions[span.package])
        throw new Error(`cannot identify version of ${span.source}`)
    }
  const report = {
    arm,
    command: `cd code/comparisons/tailwind-bundle/${arm} && bun ../node_modules/vite/bin/vite.js build; cd .. && bun attribute.ts ${arm}`,
    method:
      'RAN: gzip level 9 of each complete emitted JS file. Source-map spans cover every byte. Per-package and per-group standalone gzip compress their selected minified spans; marginal gzip subtracts gzip after deleting those spans. Both columns are non-additive because gzip shares a dictionary. No dependencies externalized and no manual chunking.',
    totalJsGzipBytes: total,
    totalCssGzipBytes: css.reduce((n, c) => n + c.gzipBytes, 0),
    versions,
    groups,
    packages,
    css,
    clientConfig,
    chunks: chunks.map((c) => ({
      file: c.file,
      minBytes: Buffer.byteLength(c.code),
      gzipBytes: gzip(c.code),
      sha256: hash(c.code),
    })),
  }
  mkdirSync(join(root, 'results'), { recursive: true })
  writeFileSync(
    join(root, 'results', `${arm}.json`),
    JSON.stringify(report, null, 2) + '\n'
  )
  console.log(JSON.stringify({ arm, totalJsGzipBytes: total, groups }, null, 2))
}
