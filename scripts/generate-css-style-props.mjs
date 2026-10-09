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

// existing hand-authored tables own their names; the generated registry only
// adds unprefixed css names that are not represented there already.
const declarations = new Map()
for (const relative of [
  'code/core/helpers/src/validStyleProps.ts',
  'code/core/helpers/src/webOnlyStyleProps.ts',
]) {
  const source = resolve(root, relative)
  const ast = parseSync(source, await readFile(source, 'utf8'), { lang: 'ts' })
  if (ast.errors.length) throw new Error(`style table did not parse: ${relative}`)
  for (const node of ast.program.body) {
    const declaration = node.declaration ?? node
    if (declaration.type !== 'VariableDeclaration') continue
    for (const variable of declaration.declarations) {
      declarations.set(variable.id.name, variable.init)
    }
  }
}
function tableKeys(expression, seen = new Set()) {
  if (!expression) return []
  if (expression.type === 'Literal' && typeof expression.value === 'string')
    return expression.value.split(' ')
  if (expression.type === 'Identifier') {
    if (seen.has(expression.name)) throw new Error('cyclic style table')
    if (!declarations.has(expression.name)) {
      if (
        ['undefined', 'cssStyleProps', 'cssStylePropsUnitless'].includes(expression.name)
      )
        return []
      throw new Error(`unknown style table: ${expression.name}`)
    }
    return tableKeys(
      declarations.get(expression.name),
      new Set([...seen, expression.name])
    )
  }
  if (expression.type === 'ConditionalExpression') {
    return [
      ...tableKeys(expression.consequent, seen),
      ...tableKeys(expression.alternate, seen),
    ]
  }
  if (expression.type === 'CallExpression' && expression.callee.name === 'toObj') {
    return expression.arguments.flatMap((argument) => tableKeys(argument, seen))
  }
  if (expression.type === 'ObjectExpression') {
    return expression.properties.map((property) => property.key.name)
  }
  throw new Error(`unsupported style table expression: ${expression.type}`)
}
const existing = new Set(tableKeys(declarations.get('stylePropsAll')))
const existingUnitless = new Set(tableKeys(declarations.get('stylePropsUnitless')))
const entries = [...properties('Properties')]
  .filter(([name]) => !/^(Webkit|Moz|ms)/.test(name))
  .sort(([a], [b]) => a.localeCompare(b, 'en'))
const keys = entries.map(([name]) => name).filter((name) => !existing.has(name))
const unitless = entries
  .filter(([name, type]) => acceptsUnitlessNumber(type) && !existingUnitless.has(name))
  .map(([name]) => name)
if (
  (!existing.has('textWrap') && !keys.includes('textWrap')) ||
  (!existingUnitless.has('opacity') && !unitless.includes('opacity')) ||
  unitless.includes('width')
) {
  throw new Error('canonical css key or unitless controls failed')
}
const object = (name, names) =>
  `export const ${name} = {\n${names.map((key) => `  ${key}: true,`).join('\n')}\n} as const\n`
const output = `// generated from csstype ${version}; run node scripts/generate-css-style-props.mjs.\n\n${object('cssStyleProps', keys)}\n${object('cssStylePropsUnitless', unitless)}`
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
