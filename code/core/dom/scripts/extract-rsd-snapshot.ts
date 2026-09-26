/**
 * Extracts the React Strict DOM surface into src/__tests__/rsd-snapshot.json.
 *
 * React Strict DOM is the semantic reference and conformance oracle for the
 * Tamagui DOM tables, never a dependency. The snapshot is what the conformance
 * test compares against, so refreshing the pin is this one command:
 *
 *   bun scripts/extract-rsd-snapshot.ts [path-to-react-strict-dom-checkout]
 *
 * Every difference the refresh surfaces has to land in the compatibility table.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const root = process.argv[2] ?? join(homedir(), 'github', 'react-strict-dom')
const pkg = join(root, 'packages', 'react-strict-dom')
const read = (path: string) => readFileSync(join(root, path), 'utf8')

const backings: Record<string, string> = {
  createStrict: 'view',
  createStrictText: 'text',
  createStrictImage: 'image',
  createStrictTextInput: 'textinput',
}

// tags, their native backing, their ref element and their props type
const nativeHtml = read('packages/react-strict-dom/src/native/html.js')
const tags: Record<string, { backing: string; element: string; props: string }> = {}
const tagRe =
  /export const (\w+): component\(\s*ref\?: React\.RefSetter<(\w+)>,\s*\.\.\.(\w+)\s*\) = (createStrict\w*)\(/g
for (const match of nativeHtml.matchAll(tagRe)) {
  const [, tag, element, props, creator] = match
  const backing = backings[creator]
  if (!backing) throw new Error(`unknown creator ${creator} for <${tag}>`)
  tags[tag] = { backing, element, props }
}

// the shared strict prop allowlist
const allowlist = [
  ...read('packages/react-strict-dom/src/shared/isPropAllowed.js')
    .split('const strictAttributeSet')[1]
    .split('])')[0]
    .matchAll(/'([^']+)'/g),
].map((m) => m[1])

// props declared by each strict props type, including the ones it spreads
const propTypes: Record<string, string[]> = {}
const typeFiles = [
  'StrictReactDOMProps',
  'StrictReactDOMAnchorProps',
  'StrictReactDOMButtonProps',
  'StrictReactDOMImageProps',
  'StrictReactDOMInputProps',
  'StrictReactDOMLabelProps',
  'StrictReactDOMListItemProps',
  'StrictReactDOMOptionGroupProps',
  'StrictReactDOMOptionProps',
  'StrictReactDOMSelectProps',
  'StrictReactDOMTextAreaProps',
]
for (const name of typeFiles) {
  const source = read(`packages/react-strict-dom/src/types/${name}.js`)
  const declaration = `export type ${name} = Readonly<{`
  const start = source.indexOf(declaration)
  if (start === -1) throw new Error(`no exported ${name} type`)
  const body = source.slice(start + declaration.length).split('}>;')[0]
  propTypes[name] = [...body.matchAll(/^ {2}'?([A-Za-z][\w-]*)'?\??:/gm)].map((m) => m[1])
}
// the common type is spread into every element type
for (const name of typeFiles) {
  if (name === 'StrictReactDOMProps') continue
  propTypes[name] = [
    ...new Set([...propTypes.StrictReactDOMProps, ...propTypes[name]]),
  ].sort()
}
propTypes.StrictReactDOMProps.sort()

// the published web/native compatibility matrix
const docs = read('packages/website/docs/api/03-html/index.md')
const support: Record<string, Record<string, string>> = {}
let section = ''
for (const line of docs.split('\n')) {
  const header = /^\| (Tags|Props|Instance) \|/.exec(line)
  if (header) {
    section = header[1].toLowerCase()
    support[section] = {}
    continue
  }
  if (!section || !line.startsWith('|') || /^\| -+/.test(line)) continue
  const cells = line.split('|').map((cell) => cell.trim())
  if (cells.length < 4) continue
  const [, subject, android, ios] = cells
  if (!subject) continue
  const status = (cell: string) =>
    cell.startsWith('✅') ? 'native' : cell.startsWith('🟡') ? 'polyfill' : 'none'
  // android and ios never disagree today; keep the pin honest if they start to
  support[section][subject] =
    status(android) === status(ios) ? status(android) : `${android}/${ios}`
}

// the string unions the prop types reference by name
const propsSource = read('packages/react-strict-dom/src/types/StrictReactDOMProps.js')
const inputSource = read(
  'packages/react-strict-dom/src/types/StrictReactDOMInputProps.js'
)
const union = (source: string, declaration: string) => {
  const start = source.indexOf(declaration)
  if (start === -1) throw new Error(`no ${declaration}`)
  const body = source.slice(start + declaration.length).split(';')[0]
  return [...body.matchAll(/'([^']+)'/g)].map((m) => m[1])
}
const unions = {
  AriaRole: union(propsSource, 'type AriaRole ='),
  AutoComplete: union(propsSource, 'export type AutoComplete ='),
  inputType: union(inputSource, '  type?:'),
}

/**
 * The default element styles, flattened per tag exactly as the runtime layers
 * them. `create()` takes a plain object literal in both files, so evaluating it
 * is both simpler and more faithful than parsing each rule.
 */
const evalCreate = (
  source: string,
  call: string
): Record<string, Record<string, unknown>> => {
  const open = source.indexOf('(', source.indexOf(call))
  let depth = 0
  let end = open
  for (; end < source.length; end++) {
    if (source[end] === '(') depth++
    else if (source[end] === ')' && --depth === 0) break
  }
  // Platform.select survives as its branch map, so a per-platform value never
  // silently compares equal to a single cross-platform one
  const select = { Platform: { select: (branches: unknown) => ({ select: branches }) } }
  return new Function('ReactNative', `return ${source.slice(open + 1, end)}`)(select)
}

const styleRefs = (text: string) => [...text.matchAll(/styles\.(\w+)/g)].map((m) => m[1])
const flatten = (rules: Record<string, Record<string, unknown>>, refs: string[]) =>
  Object.assign({}, ...refs.map((ref) => rules[ref] ?? {}))

const nativeRules = evalCreate(nativeHtml, 'css.create')
const headingRefs = styleRefs(
  nativeHtml.slice(nativeHtml.indexOf('const headingProps')).split('};')[0]
)
const nativeStyles: Record<string, Record<string, unknown>> = {}
for (const tag of Object.keys(tags)) {
  const start = nativeHtml.indexOf(
    `createStrict`,
    nativeHtml.indexOf(`export const ${tag}:`)
  )
  const args = nativeHtml.slice(start, nativeHtml.indexOf(';', start))
  const refs = args.includes('headingProps') ? headingRefs : styleRefs(args)
  nativeStyles[tag] = flatten(nativeRules, refs)
}

const webHtml = read('packages/react-strict-dom/src/web/runtime.js')
const webRules = evalCreate(webHtml, 'stylex.create')
const webAliases: Record<string, string[]> = {}
for (const match of webHtml.matchAll(
  /^const (\w+): StrictReactDOMPropsStyle = ([\s\S]*?);$/gm
)) {
  webAliases[match[1]] = styleRefs(match[2])
}
const webStyles: Record<string, Record<string, unknown>> = {}
for (const match of webHtml.matchAll(/^ {2}(\w+): (\w+) as typeof \w+,?$/gm)) {
  webStyles[match[1]] = flatten(webRules, webAliases[match[2]] ?? [])
}
for (const tag of Object.keys(tags)) {
  if (!(tag in webStyles)) throw new Error(`no web default styles for <${tag}>`)
}

const version = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).version
const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: root,
  encoding: 'utf8',
}).trim()
const date = execFileSync('git', ['log', '-1', '--format=%cs'], {
  cwd: root,
  encoding: 'utf8',
}).trim()

const snapshot = {
  $comment:
    'Generated by scripts/extract-rsd-snapshot.ts from the pinned react-strict-dom checkout. Do not edit by hand.',
  version,
  commit,
  date,
  tags,
  allowlist: allowlist.sort(),
  propTypes,
  unions,
  styles: { web: webStyles, native: nativeStyles },
  support,
}

const out = join(import.meta.dirname, '..', 'src', '__tests__', 'rsd-snapshot.json')
writeFileSync(out, `${JSON.stringify(snapshot, null, 2)}\n`)

console.info(
  `react-strict-dom ${version} @ ${commit.slice(0, 10)} (${date}): ` +
    `${Object.keys(tags).length} tags, ${allowlist.length} allowed props, ` +
    `${Object.keys(support.tags ?? {}).length} documented tags`
)
