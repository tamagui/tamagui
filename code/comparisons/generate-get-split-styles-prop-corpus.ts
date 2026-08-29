#!/usr/bin/env bun

import { parse } from '@babel/parser'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { stylePropsAll } from '../core/helpers/src/validStyleProps'
import { shorthands } from '../core/shorthands/src'

const root = resolve(import.meta.dir, '../..')
const sourceRoots = ['code/tamagui.dev', 'code/kitchen-sink', 'code/demos'] as const
const excludedParts = new Set([
  '.next',
  '.tamagui',
  'coverage',
  'dist',
  'e2e',
  'node_modules',
  'tests',
])
const corpusPath = resolve(import.meta.dir, 'get-split-styles-prop-corpus.json')
const notesPath = resolve(import.meta.dir, 'get-split-styles-prop-corpus.md')

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue }
type ComponentKind = 'custom' | 'intrinsic' | 'text' | 'view'
type Scenario =
  | 'zero-props'
  | 'one-prop'
  | 'plain-props'
  | 'clause-strings'
  | 'conditional-objects'
  | 'variant-props'
  | 'shorthand-heavy'
  | 'style-prop-heavy'

type RawElement = {
  component: string
  componentKind: ComponentKind
  dynamicPropCount: number
  line: number
  localVariantProps: Set<string>
  props: Record<string, JsonValue>
  source: string
}

type CorpusElement = Omit<RawElement, 'localVariantProps'> & {
  scenarios: Scenario[]
  staticPropCount: number
  variantPropNames: string[]
}

const knownHostProps = new Set([
  'accessibilityLabel',
  'accessibilityRole',
  'alt',
  'asChild',
  'autoComplete',
  'checked',
  'className',
  'contentEditable',
  'defaultChecked',
  'defaultValue',
  'disabled',
  'download',
  'draggable',
  'form',
  'href',
  'id',
  'key',
  'lang',
  'max',
  'min',
  'multiple',
  'name',
  'placeholder',
  'readOnly',
  'rel',
  'required',
  'role',
  'scope',
  'src',
  'step',
  'tabIndex',
  'target',
  'testID',
  'title',
  'type',
  'value',
])
const textIntrinsics = new Set([
  'a',
  'abbr',
  'b',
  'blockquote',
  'code',
  'em',
  'figcaption',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'label',
  'li',
  'p',
  'pre',
  'q',
  'small',
  'span',
  'strong',
])
const viewComponentPattern =
  /(?:^|\.)(?:View|Stack|XStack|YStack|ZStack|Card|Button|Group|ListItem|Separator|ScrollView|Sheet|Dialog|Popover|Tabs|Form|Image|Spinner|Switch|Checkbox|RadioGroup|Slider|Progress|Avatar|Theme)$/
const textComponentPattern =
  /(?:^|\.)(?:Text|SizableText|Paragraph|Label|Heading|Anchor|Code|H[1-6]|Input|TextArea|ButtonText)$/
const stateModifiers = new Set([
  'active',
  'default',
  'disabled',
  'enter',
  'exit',
  'focus',
  'focus-visible',
  'focus-within',
  'hover',
  'ios',
  'android',
  'native',
  'press',
  'press-in',
  'tvos',
  'web',
])
const mediaModifiers = new Set([
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
  'gtXs',
  'gtSm',
  'gtMd',
  'gtLg',
  'short',
  'tall',
  'hoverNone',
  'pointerCoarse',
])

function sourceFiles(directory: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excludedParts.has(entry.name)) continue
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...sourceFiles(path))
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
      files.push(path)
    }
  }
  return files.sort()
}

function propertyName(node: any): string | undefined {
  if (!node || node.computed) return
  if (node.key?.type === 'Identifier' || node.key?.type === 'StringLiteral') {
    return node.key.name ?? node.key.value
  }
  if (node.key?.type === 'NumericLiteral') return String(node.key.value)
}

function unwrapExpression(node: any) {
  while (
    node &&
    (node.type === 'TSAsExpression' ||
      node.type === 'TSSatisfiesExpression' ||
      node.type === 'TypeCastExpression' ||
      node.type === 'ParenthesizedExpression')
  ) {
    node = node.expression
  }
  return node
}

function staticValue(node: any): { value: JsonValue } | undefined {
  node = unwrapExpression(node)
  if (!node) return
  switch (node.type) {
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return { value: node.value }
    case 'NullLiteral':
      return { value: null }
    case 'TemplateLiteral':
      if (node.expressions.length === 0) {
        return { value: node.quasis[0]?.value.cooked ?? '' }
      }
      return
    case 'UnaryExpression': {
      if (node.operator !== '+' && node.operator !== '-') return
      const argument = staticValue(node.argument)?.value
      if (typeof argument !== 'number') return
      return { value: node.operator === '-' ? -argument : argument }
    }
    case 'ArrayExpression': {
      const value: JsonValue[] = []
      for (const element of node.elements) {
        if (!element || element.type === 'SpreadElement') return
        const resolved = staticValue(element)
        if (!resolved) return
        value.push(resolved.value)
      }
      return { value }
    }
    case 'ObjectExpression': {
      const value: Record<string, JsonValue> = {}
      for (const property of node.properties) {
        if (property.type === 'SpreadElement') {
          const spread = staticValue(property.argument)?.value
          if (!spread || Array.isArray(spread) || typeof spread !== 'object') return
          Object.assign(value, spread)
          continue
        }
        if (property.type !== 'ObjectProperty') return
        const key = propertyName(property)
        const resolved = staticValue(property.value)
        if (key === undefined || !resolved) return
        value[key] = resolved.value
      }
      return { value }
    }
  }
}

function jsxName(node: any): string {
  if (node.type === 'JSXIdentifier') return node.name
  if (node.type === 'JSXMemberExpression') {
    return `${jsxName(node.object)}.${jsxName(node.property)}`
  }
  return `${jsxName(node.namespace)}:${jsxName(node.name)}`
}

function componentKind(component: string): ComponentKind {
  const leaf = component.split('.').at(-1)!
  if (leaf[0] === leaf[0]?.toLowerCase()) {
    return textIntrinsics.has(leaf) ? 'text' : 'intrinsic'
  }
  if (textComponentPattern.test(component)) return 'text'
  if (viewComponentPattern.test(component)) return 'view'
  return 'custom'
}

function walk(ast: any, visit: (node: any, parent: any) => void) {
  const stack: Array<[any, any]> = [[ast, null]]
  while (stack.length) {
    const [node, parent] = stack.pop()!
    visit(node, parent)
    const children: any[] = []
    for (const key in node) {
      if (
        key === 'loc' ||
        key === 'start' ||
        key === 'end' ||
        key === 'extra' ||
        key === 'leadingComments' ||
        key === 'trailingComments' ||
        key === 'innerComments'
      ) {
        continue
      }
      const value = node[key]
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof child.type === 'string') children.push(child)
        }
      } else if (value && typeof value.type === 'string') {
        children.push(value)
      }
    }
    for (let index = children.length - 1; index >= 0; index--) {
      stack.push([children[index], node])
    }
  }
}

function styledVariant(node: any, parent: any) {
  const options = unwrapExpression(node.arguments?.[1])
  if (
    node.type !== 'CallExpression' ||
    node.callee?.type !== 'Identifier' ||
    node.callee.name !== 'styled' ||
    options?.type !== 'ObjectExpression'
  ) {
    return
  }
  const variants = unwrapExpression(
    options.properties.find(
      (property: any) =>
        property.type === 'ObjectProperty' && propertyName(property) === 'variants'
    )?.value
  )
  if (variants?.type !== 'ObjectExpression') return
  const names = new Set<string>()
  for (const property of variants.properties) {
    if (property.type !== 'ObjectProperty') continue
    const name = propertyName(property)
    if (name) names.add(name)
  }
  if (!names.size) return
  let component: string | undefined
  if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
    component = parent.id.name
  }
  return { component, names }
}

function isModifier(key: string) {
  if (stateModifiers.has(key) || mediaModifiers.has(key)) return true
  if (key.startsWith('$') || key.startsWith('@')) return true
  if (key.startsWith('theme-') || key.startsWith('group-')) return true
  return false
}

function isClauseString(value: string) {
  let segmentStart = 0
  while (segmentStart < value.length) {
    while (value.charCodeAt(segmentStart) === 32) segmentStart++
    const colon = value.indexOf(':', segmentStart)
    if (colon === -1) return false
    const space = value.indexOf(' ', segmentStart)
    if (space !== -1 && space < colon) {
      segmentStart = space + 1
      continue
    }
    if (isModifier(value.slice(segmentStart, colon))) return true
    segmentStart = space === -1 ? value.length : space + 1
  }
  return false
}

function isConditionalObject(value: JsonValue) {
  if (!value || Array.isArray(value) || typeof value !== 'object') return false
  if ('default' in value) return true
  const first = Object.keys(value)[0]
  return first !== undefined && isModifier(first.split(':')[0]!)
}

const files = sourceRoots.flatMap((path) => sourceFiles(resolve(root, path)))
const rawElements: RawElement[] = []
const localVariants = new Map<string, Set<string>>()
const globalVariantProps = new Set<string>()

for (const file of files) {
  const source = readFileSync(file, 'utf8')
  const ast = parse(source, {
    sourceType: 'unambiguous',
    plugins: [
      'decorators-legacy',
      'explicitResourceManagement',
      'importAttributes',
      'jsx',
      'typescript',
    ],
  })
  walk(ast, (node, parent) => {
    const variant = styledVariant(node, parent)
    if (variant) {
      for (const name of variant.names) globalVariantProps.add(name)
      if (variant.component) localVariants.set(variant.component, variant.names)
    }
    if (node.type !== 'JSXOpeningElement') return
    const component = jsxName(node.name)
    const props: Record<string, JsonValue> = {}
    let dynamicPropCount = 0
    for (const attribute of node.attributes) {
      if (attribute.type === 'JSXSpreadAttribute') {
        const spread = staticValue(attribute.argument)?.value
        if (spread && !Array.isArray(spread) && typeof spread === 'object') {
          Object.assign(props, spread)
        } else {
          dynamicPropCount++
        }
        continue
      }
      const name = jsxName(attribute.name)
      if (attribute.value === null) {
        props[name] = true
        continue
      }
      if (attribute.value.type === 'StringLiteral') {
        props[name] = attribute.value.value
        continue
      }
      if (attribute.value.type !== 'JSXExpressionContainer') {
        dynamicPropCount++
        continue
      }
      const resolved = staticValue(attribute.value.expression)
      if (resolved) {
        props[name] = resolved.value
      } else {
        dynamicPropCount++
      }
    }
    if (!Object.keys(props).length) return
    rawElements.push({
      component,
      componentKind: componentKind(component),
      dynamicPropCount,
      line: node.loc?.start.line ?? 0,
      localVariantProps: new Set(),
      props,
      source: relative(root, file),
    })
  })
}

for (const element of rawElements) {
  const variants = localVariants.get(element.component)
  if (variants) element.localVariantProps = variants
}

const valueTypes: Record<string, number> = {
  array: 0,
  boolean: 0,
  null: 0,
  number: 0,
  object: 0,
  string: 0,
}
const scenarioCounts: Record<Scenario | 'total', number> = {
  total: 0,
  'plain-props': 0,
  'clause-strings': 0,
  'conditional-objects': 0,
  'variant-props': 0,
  'shorthand-heavy': 0,
  'style-prop-heavy': 0,
}
const componentKinds: Record<ComponentKind, number> = {
  custom: 0,
  intrinsic: 0,
  text: 0,
  view: 0,
}
let clauseStrings = 0
let conditionalObjects = 0
let dynamicAttributes = 0
let shorthandProps = 0
let staticAttributes = 0
let variantProps = 0

const elements: CorpusElement[] = rawElements
  .sort(
    (left, right) =>
      left.source.localeCompare(right.source) ||
      left.line - right.line ||
      left.component.localeCompare(right.component)
  )
  .map(({ localVariantProps, ...element }) => {
    let elementClauseStrings = 0
    let elementConditionalObjects = 0
    let elementShorthands = 0
    let elementStyleProps = 0
    let elementVariants = 0
    const variantPropNames: string[] = []
    for (const name in element.props) {
      const value = element.props[name]
      staticAttributes++
      if (value === null) valueTypes.null++
      else if (Array.isArray(value)) valueTypes.array++
      else valueTypes[typeof value]++

      if (typeof value === 'string' && isClauseString(value)) {
        clauseStrings++
        elementClauseStrings++
      }
      if (isConditionalObject(value)) {
        conditionalObjects++
        elementConditionalObjects++
      }
      if (name in shorthands) {
        shorthandProps++
        elementShorthands++
        elementStyleProps++
      } else if (name in stylePropsAll) {
        elementStyleProps++
      }
      if (
        name === 'style' &&
        value &&
        !Array.isArray(value) &&
        typeof value === 'object'
      ) {
        for (const styleName in value) {
          const styleValue = value[styleName]
          if (styleName in shorthands) {
            elementShorthands++
            elementStyleProps++
          } else if (styleName in stylePropsAll) {
            elementStyleProps++
          }
          if (typeof styleValue === 'string' && isClauseString(styleValue)) {
            elementClauseStrings++
          }
          if (isConditionalObject(styleValue)) elementConditionalObjects++
        }
      }
      const couldBeVariant =
        element.component[0] === element.component[0]?.toUpperCase() &&
        !(name in stylePropsAll) &&
        !(name in shorthands) &&
        !knownHostProps.has(name) &&
        (localVariantProps.has(name) || globalVariantProps.has(name))
      if (couldBeVariant) {
        variantProps++
        elementVariants++
        variantPropNames.push(name)
      }
    }
    dynamicAttributes += element.dynamicPropCount
    componentKinds[element.componentKind]++
    const scenarios: Scenario[] = []
    if (!elementClauseStrings && !elementConditionalObjects && !elementVariants) {
      scenarios.push('plain-props')
    }
    if (elementClauseStrings) scenarios.push('clause-strings')
    if (elementConditionalObjects) scenarios.push('conditional-objects')
    if (elementVariants) scenarios.push('variant-props')
    if (elementShorthands >= 2 && elementShorthands * 2 >= elementStyleProps) {
      scenarios.push('shorthand-heavy')
    }
    if (
      elementStyleProps >= 5 &&
      elementStyleProps * 2 >= Object.keys(element.props).length
    ) {
      scenarios.push('style-prop-heavy')
    }
    scenarioCounts.total++
    for (const scenario of scenarios) scenarioCounts[scenario]++
    return {
      ...element,
      scenarios,
      staticPropCount: Object.keys(element.props).length,
      variantPropNames,
    }
  })

const corpus = {
  schemaVersion: 2,
  sourceRoots,
  exclusions: [...excludedParts].sort(),
  filesParsed: files.length,
  fixedOverheadScenarios: {
    'zero-props': {
      component: 'View',
      componentKind: 'view',
      props: {},
      scenarios: [],
      staticPropCount: 0,
      variantPropNames: [],
    },
    'one-prop': {
      component: 'View',
      componentKind: 'view',
      props: { opacity: 1 },
      scenarios: [],
      staticPropCount: 1,
      variantPropNames: [],
    },
  },
  elements,
  distribution: {
    componentKinds,
    dynamicAttributes,
    staticAttributes,
    valueTypes,
    clauseStrings,
    conditionalObjects,
    shorthandProps,
    variantProps,
    scenarioCounts,
    discoveredVariantNames: [...globalVariantProps].sort(),
  },
}
const json = `${JSON.stringify(corpus, null, 2)}\n`
writeFileSync(corpusPath, json)

const percentage = (value: number, total: number) =>
  `${((value / Math.max(1, total)) * 100).toFixed(2)}%`
const notes = `# getSplitStyles real-world prop corpus

This corpus statically parses JSX in \`${sourceRoots.join('`, `')}\`. Generated output excludes \`${[
  ...excludedParts,
]
  .sort()
  .join(
    '`, `'
  )}\` path segments. Run \`bun code/comparisons/generate-get-split-styles-prop-corpus.ts\` from the repository root to reproduce both files.

The generator keeps JSX attributes whose complete value is statically known. It supports scalar literals, literal templates, signed numbers, arrays, objects, and literal object spreads. Dynamic attributes are counted but omitted from replay. Each corpus row preserves the element, source line, component kind, and the full static prop object.

The \`zero-props\` and \`one-prop\` lanes are fixed synthetic controls. They replay \`View\` with \`{}\` and \`{ opacity: 1 }\` so the benchmark can separate fixed call cost from the first property contribution without depending on the harvested application mix.

## Distribution

Denominator for value and prop percentages: ${staticAttributes.toLocaleString()} static attributes from ${elements.length.toLocaleString()} elements in ${files.length.toLocaleString()} parsed files. Another ${dynamicAttributes.toLocaleString()} dynamic attributes were observed and omitted.

| Category | Count | Static attributes |
| --- | ---: | ---: |
| Strings | ${valueTypes.string.toLocaleString()} | ${percentage(valueTypes.string, staticAttributes)} |
| Numbers | ${valueTypes.number.toLocaleString()} | ${percentage(valueTypes.number, staticAttributes)} |
| Booleans | ${valueTypes.boolean.toLocaleString()} | ${percentage(valueTypes.boolean, staticAttributes)} |
| Nulls | ${valueTypes.null.toLocaleString()} | ${percentage(valueTypes.null, staticAttributes)} |
| Arrays | ${valueTypes.array.toLocaleString()} | ${percentage(valueTypes.array, staticAttributes)} |
| Objects | ${valueTypes.object.toLocaleString()} | ${percentage(valueTypes.object, staticAttributes)} |
| Clause strings | ${clauseStrings.toLocaleString()} | ${percentage(clauseStrings, staticAttributes)} (${percentage(clauseStrings, valueTypes.string)} of strings) |
| Conditional objects | ${conditionalObjects.toLocaleString()} | ${percentage(conditionalObjects, staticAttributes)} |
| Variant props | ${variantProps.toLocaleString()} | ${percentage(variantProps, staticAttributes)} |
| Shorthands | ${shorthandProps.toLocaleString()} | ${percentage(shorthandProps, staticAttributes)} |

Variant classification uses variant keys declared in \`styled()\` calls across the corpus. A prop counts when its uppercase component has that key locally, or the key is used by another corpus component, and the prop is neither a style, shorthand, nor known host prop. This keeps the benchmark grounded in app-authored variant names without pretending every unknown JSX prop is a variant.

## Benchmark lanes

| Scenario | Elements | Corpus elements |
| --- | ---: | ---: |
| zero-props | 1 | fixed control |
| one-prop | 1 | fixed control |
${(
  [
    'plain-props',
    'clause-strings',
    'conditional-objects',
    'variant-props',
    'shorthand-heavy',
    'style-prop-heavy',
  ] as const
)
  .map(
    (scenario) =>
      `| ${scenario} | ${scenarioCounts[scenario].toLocaleString()} | ${percentage(scenarioCounts[scenario], elements.length)} |`
  )
  .join('\n')}

The lanes overlap where a real element combines behaviors. \`plain-props\` excludes clause strings, conditional objects, and classified variants. \`shorthand-heavy\` requires at least two shorthands and at least half of the element's static style props to be shorthand. \`style-prop-heavy\` requires at least five static style props and at least half of all static attributes to be style props.

Corpus SHA-256: \`${createHash('sha256').update(json).digest('hex')}\`.
`
writeFileSync(notesPath, notes)
console.log(`wrote ${relative(root, corpusPath)} (${elements.length} elements)`)
console.log(`wrote ${relative(root, notesPath)}`)
