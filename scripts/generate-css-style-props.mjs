import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from 'oxc-parser'

// the runtime must recognize the same css keys its public types accept.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(resolve(root, 'code/core/web/package.json'))
const manifest = require.resolve('csstype/package.json')
const version = JSON.parse(await readFile(manifest, 'utf8')).version
const path = resolve(dirname(manifest), 'index.d.ts')
const parsed = parseSync(path, await readFile(path, 'utf8'), { lang: 'ts' })
if (parsed.errors.length) throw new Error('csstype did not parse')

const interfaces = new Map()
const aliases = new Map()
function collect(nodes, namespace = '') {
  for (const node of nodes) {
    const declaration = node.declaration ?? node
    if (declaration.type === 'TSInterfaceDeclaration') {
      interfaces.set(declaration.id.name, declaration)
    } else if (declaration.type === 'TSTypeAliasDeclaration') {
      aliases.set(namespace + declaration.id.name, declaration.typeAnnotation)
    } else if (declaration.type === 'TSModuleDeclaration') {
      collect(declaration.body.body, namespace + declaration.id.name + '.')
    }
  }
}
collect(parsed.program.body)

function properties(name, result = new Map()) {
  const declaration = interfaces.get(name)
  if (!declaration) throw new Error(`unknown css interface ${name}`)
  for (const parent of declaration.extends) properties(parent.expression.name, result)
  for (const property of declaration.body.body) {
    if (property.type !== 'TSPropertySignature' || property.key.type !== 'Identifier') {
      throw new Error(`unexpected css property in ${name}`)
    }
    result.set(property.key.name, property.typeAnnotation.typeAnnotation)
  }
  return result
}

function qualifiedName(name) {
  return name.type === 'Identifier'
    ? name.name
    : qualifiedName(name.left) + '.' + name.right.name
}

function acceptsUnitlessNumber(type, seen = new Set()) {
  if (type.type === 'TSNumberKeyword') return true
  if (type.type === 'TSUnionType' || type.type === 'TSIntersectionType') {
    return type.types.some((part) => acceptsUnitlessNumber(part, seen))
  }
  if (type.type === 'TSParenthesizedType') {
    return acceptsUnitlessNumber(type.typeAnnotation, seen)
  }
  if (type.type === 'TSTypeReference') {
    const name = qualifiedName(type.typeName)
    const alias = aliases.get(name)
    if (!alias || seen.has(name)) return false
    return acceptsUnitlessNumber(alias, new Set([...seen, name]))
  }
  // generic lengths and times do not make a numeric value unitless.
  return false
}

const entries = [...properties('Properties')].sort(([a], [b]) => a.localeCompare(b, 'en'))
const keys = entries.map(([name]) => name)
const unitless = entries
  .filter(([, type]) => acceptsUnitlessNumber(type))
  .map(([name]) => name)
if (
  !keys.includes('textWrap') ||
  !unitless.includes('opacity') ||
  unitless.includes('width')
) {
  throw new Error('canonical css key or unitless controls failed')
}
const object = (name, names) => {
  const chunks = []
  // bound the shared key parser's template-literal recursion.
  for (let index = 0; index < names.length; index += 128) {
    chunks.push(`  '${names.slice(index, index + 128).join(' ')}'`)
  }
  const declaration = `export const ${name}: Readonly<typeof ${name}Values> =`
  const assignment =
    `${declaration} ${name}Values`.length > 90
      ? `${declaration}\n  ${name}Values`
      : `${declaration} ${name}Values`
  return `const ${name}Values = /* @__PURE__ */ toObj(\n${chunks.join(',\n')}\n)\n\n${assignment}\n`
}
const output = `// generated from csstype ${version}; run node scripts/generate-css-style-props.mjs.\n\nimport { toStylePropsObject as toObj } from './toStylePropsObject'\n\n${object('cssStyleProps', keys)}\n${object('cssStylePropsUnitless', unitless)}`
const destination = resolve(root, 'code/core/helpers/src/cssStyleProps.ts')
if (process.argv.includes('--check')) {
  if ((await readFile(destination, 'utf8')) !== output)
    throw new Error('css style metadata is stale; regenerate it')
} else {
  await writeFile(destination, output)
}
console.log(
  `css style metadata: ${keys.length} properties, ${unitless.length} unitless numeric properties`
)
