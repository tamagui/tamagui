import {
  childNode,
  childNodes,
  findAstNode,
  identifierName,
  isAstNode,
  walkAst,
} from './ast'
import {
  expressionReference,
  resolvedModuleId,
  spanOf,
  type AnalyzerCandidate,
  type AstNode,
  type DefinitionSite,
  type HostResolvedImport,
  type ResolvedModuleId,
  type SymbolDefinition,
} from './contracts'
import { linkedBailout, localBailout, type BailoutReason } from './diagnostics'
import type {
  ElementChildIR,
  ElementComponentIR,
  ElementEntryIR,
  ElementIR,
  ElementIRBase,
  ElementIRResult,
  ElementPropIR,
  ElementSpreadIR,
  ElementValue,
  StaticValue,
  StyledDefinitionIR,
} from './ir'
import { hostImportProvenance } from './ir'

function finalizeElement(
  base: ElementIRBase,
  entries: ElementEntryIR[],
  bailouts: BailoutReason[]
): ElementIR {
  if (bailouts.length === 0) {
    return { ...base, complete: true, entries, bailouts: [] }
  }
  return {
    ...base,
    complete: false,
    bailedEntries: entries,
    bailouts: bailouts as [BailoutReason, ...BailoutReason[]],
  }
}

export function definitionFromDeclaration(
  id: string,
  name: string,
  program: AstNode,
  declaration: AstNode
): DefinitionSite {
  let identifier = declaration
  let initializer: AstNode | null = null
  let constant = false

  if (declaration.type === 'VariableDeclarator') {
    identifier = childNode(declaration, 'id') ?? declaration
    initializer = childNode(declaration, 'init')
    constant = !!findAstNode(
      program,
      (node) =>
        node.type === 'VariableDeclaration' &&
        node.kind === 'const' &&
        childNodes(node, 'declarations').some(
          (candidate) => candidate.start === declaration.start
        )
    )
  } else if (declaration.type === 'Identifier') {
    const declarator = findAstNode(
      program,
      (node) =>
        node.type === 'VariableDeclarator' &&
        childNode(node, 'id')?.start === declaration.start
    )
    if (declarator) {
      initializer = childNode(declarator, 'init')
      constant = !!findAstNode(
        program,
        (node) =>
          node.type === 'VariableDeclaration' &&
          node.kind === 'const' &&
          childNodes(node, 'declarations').some(
            (candidate) => candidate.start === declarator.start
          )
      )
    }
  }

  return {
    id: resolvedModuleId(id),
    name,
    start: identifier.start,
    end: identifier.end,
    initializer,
    constant,
  }
}

interface ImportBinding {
  source: string
  imported: string
}

function importBinding(program: AstNode, localName: string): ImportBinding | null {
  for (const statement of childNodes(program, 'body')) {
    if (statement.type !== 'ImportDeclaration') continue
    const source = childNode(statement, 'source')
    const sourceValue = source && typeof source.value === 'string' ? source.value : null
    if (!sourceValue) continue

    for (const specifier of childNodes(statement, 'specifiers')) {
      if (identifierName(childNode(specifier, 'local')) !== localName) continue
      if (specifier.type === 'ImportDefaultSpecifier') {
        return { source: sourceValue, imported: 'default' }
      }
      if (specifier.type === 'ImportNamespaceSpecifier') {
        return { source: sourceValue, imported: '*' }
      }
      const imported = childNode(specifier, 'imported')
      const importedName =
        identifierName(imported) ??
        (typeof imported?.value === 'string' ? imported.value : null)
      return importedName ? { source: sourceValue, imported: importedName } : null
    }
  }
  return null
}

function asStaticValue(node: AstNode | null): StaticValue | undefined {
  if (!node) return undefined
  if (node.type === 'NullLiteral') return null
  if (node.type === 'Literal' || node.type.endsWith('Literal')) {
    const value = node.value
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      return value
    }
  }
  return undefined
}

function elementValue(id: ResolvedModuleId, node: AstNode): ElementValue {
  const staticValue = asStaticValue(node)
  return staticValue === undefined
    ? expressionReference(id, node)
    : { kind: 'static', value: staticValue, span: spanOf(id, node) }
}

function symbolDefinition(definition: DefinitionSite | null): SymbolDefinition | null {
  if (!definition) return null
  return {
    id: definition.id,
    name: definition.name,
    span: {
      id: definition.id,
      start: definition.start,
      end: definition.end,
    },
    initializer: definition.initializer
      ? expressionReference(definition.id, definition.initializer)
      : null,
    constant: definition.constant,
  }
}

function componentFromNode(
  candidate: AnalyzerCandidate,
  id: ResolvedModuleId,
  program: AstNode,
  imports: readonly HostResolvedImport[],
  node: AstNode,
  bailouts: BailoutReason[]
): ElementComponentIR | null {
  const literal = asStaticValue(node)
  if (typeof literal === 'string') {
    return {
      kind: 'intrinsic',
      name: literal,
      span: spanOf(id, node),
      closingSpan: null,
      definition: null,
      provenance: null,
    }
  }

  const name = identifierName(node)
  if (!name) {
    bailouts.push(
      localBailout(
        'local/unsupported-element-name',
        spanOf(id, node),
        `Element target ${node.type} is not a stable identifier or intrinsic tag`
      )
    )
    return null
  }

  const intrinsic = /^[a-z]/.test(name)
  const binding = intrinsic ? null : importBinding(program, name)
  const provenance = binding
    ? hostImportProvenance(imports, binding.source, binding.imported)
    : null
  const definition = intrinsic ? null : symbolDefinition(candidate.definitionOf(id, name))
  if (!intrinsic && !definition && !provenance) {
    bailouts.push(
      linkedBailout(
        'linked/unresolved-component-binding',
        spanOf(id, node),
        `Component binding ${name} has no linked definition`
      )
    )
  }
  return {
    kind: intrinsic ? 'intrinsic' : 'binding',
    name,
    span: spanOf(id, node),
    closingSpan: null,
    definition,
    provenance,
  }
}

function jsxComponentNode(opening: AstNode): AstNode | null {
  return childNode(opening, 'name')
}

function jsxEntries(
  id: ResolvedModuleId,
  element: AstNode,
  opening: AstNode,
  bailouts: BailoutReason[]
): ElementEntryIR[] {
  const entries: ElementEntryIR[] = []
  for (const attribute of childNodes(opening, 'attributes')) {
    if (attribute.type === 'JSXSpreadAttribute') {
      const argument = childNode(attribute, 'argument')
      if (argument) {
        entries.push({
          kind: 'spread',
          span: spanOf(id, attribute),
          value: expressionReference(id, argument),
        })
      }
      continue
    }
    if (attribute.type !== 'JSXAttribute') continue
    const nameNode = childNode(attribute, 'name')
    const name = identifierName(nameNode)
    if (!name) {
      bailouts.push(
        localBailout(
          'local/unsupported-prop-key',
          spanOf(id, attribute),
          'Namespaced JSX attributes are not statically supported'
        )
      )
      continue
    }

    const rawValue = childNode(attribute, 'value')
    let value: ElementValue
    if (!rawValue) {
      value = { kind: 'static', value: true, span: spanOf(id, attribute) }
    } else if (rawValue.type === 'JSXExpressionContainer') {
      const expression = childNode(rawValue, 'expression')
      if (!expression || expression.type === 'JSXEmptyExpression') {
        bailouts.push(
          localBailout(
            'local/unsupported-expression',
            spanOf(id, rawValue),
            `JSX prop ${name} has no expression`
          )
        )
        continue
      }
      value = elementValue(id, expression)
    } else {
      value = elementValue(id, rawValue)
    }
    entries.push({ kind: 'prop', name, span: spanOf(id, attribute), value })
  }

  for (const child of childNodes(element, 'children')) {
    let value: ElementChildIR['value']
    if (child.type === 'JSXText') {
      if (typeof child.value !== 'string' || child.value.trim() === '') continue
      value = {
        kind: 'static',
        value: child.value,
        span: spanOf(id, child),
      }
    } else if (child.type === 'JSXExpressionContainer') {
      const expression = childNode(child, 'expression')
      value =
        !expression || expression.type === 'JSXEmptyExpression'
          ? { kind: 'empty', span: spanOf(id, child) }
          : elementValue(id, expression)
    } else if (child.type === 'JSXElement' || child.type === 'JSXFragment') {
      value = { kind: 'element', span: spanOf(id, child) }
    } else {
      bailouts.push(
        localBailout(
          'local/unsupported-child',
          spanOf(id, child),
          `JSX child ${child.type} cannot be normalized`
        )
      )
      continue
    }
    entries.push({ kind: 'child', span: spanOf(id, child), value })
  }

  return entries.sort((left, right) => left.span.start - right.span.start)
}

function propertyName(property: AstNode): string | null {
  if (property.computed === true) return null
  const key = childNode(property, 'key')
  const name = identifierName(key)
  if (name) return name
  const literal = asStaticValue(key)
  return typeof literal === 'string' || typeof literal === 'number'
    ? String(literal)
    : null
}

function runtimeChildEntries(
  id: ResolvedModuleId,
  program: AstNode,
  node: AstNode,
  bailouts: BailoutReason[]
): ElementChildIR[] {
  const rawNodes = node.type === 'ArrayExpression' ? node.elements : null
  if (
    Array.isArray(rawNodes) &&
    rawNodes.some((child) => child === null || !isAstNode(child))
  ) {
    bailouts.push(
      localBailout(
        'local/unsupported-child',
        spanOf(id, node),
        'Sparse compiled children cannot be normalized without changing order'
      )
    )
    return []
  }
  const nodes = Array.isArray(rawNodes) ? rawNodes.filter(isAstNode) : [node]
  return nodes.flatMap((child): ElementChildIR[] => {
    if (child.type === 'SpreadElement') {
      bailouts.push(
        localBailout(
          'local/unsupported-child',
          spanOf(id, child),
          'Spread children cannot be statically ordered'
        )
      )
      return []
    }
    if (child.type === 'CallExpression' && runtimeCall(program, child)) {
      return [
        {
          kind: 'child',
          span: spanOf(id, child),
          value: { kind: 'element', span: spanOf(id, child) },
        },
      ]
    }
    return [{ kind: 'child', span: spanOf(id, child), value: elementValue(id, child) }]
  })
}

function objectEntries(
  id: ResolvedModuleId,
  program: AstNode,
  object: AstNode,
  bailouts: BailoutReason[]
): ElementEntryIR[] {
  const entries: ElementEntryIR[] = []
  for (const property of childNodes(object, 'properties')) {
    if (property.type === 'SpreadElement') {
      const argument = childNode(property, 'argument')
      if (argument) {
        const spread: ElementSpreadIR = {
          kind: 'spread',
          span: spanOf(id, property),
          value: expressionReference(id, argument),
        }
        entries.push(spread)
      }
      continue
    }
    if (property.type !== 'Property' && property.type !== 'ObjectProperty') {
      bailouts.push(
        localBailout(
          'local/unsupported-prop-key',
          spanOf(id, property),
          `Runtime props entry ${property.type} is not a data property`
        )
      )
      continue
    }
    const name = propertyName(property)
    const valueNode = childNode(property, 'value')
    if (!name || !valueNode) {
      bailouts.push(
        localBailout(
          'local/unsupported-prop-key',
          spanOf(id, property),
          'Computed runtime prop keys are not statically supported'
        )
      )
      continue
    }
    if (name === 'children') {
      entries.push(...runtimeChildEntries(id, program, valueNode, bailouts))
      continue
    }
    const prop: ElementPropIR = {
      kind: 'prop',
      name,
      span: spanOf(id, property),
      value: elementValue(id, valueNode),
    }
    entries.push(prop)
  }
  return entries
}

type RuntimeCall = { form: 'jsx-runtime' | 'create-element' }

function runtimeCall(program: AstNode, call: AstNode): RuntimeCall | null {
  const callee = childNode(call, 'callee')
  if (!callee) return null
  const directName = identifierName(callee)
  if (directName) {
    const provenance = importBinding(program, directName)
    if (
      provenance?.source === 'react/jsx-runtime' &&
      (provenance.imported === 'jsx' || provenance.imported === 'jsxs')
    ) {
      return { form: 'jsx-runtime' }
    }
    if (provenance?.source === 'react' && provenance.imported === 'createElement') {
      return { form: 'create-element' }
    }
  }

  if (callee.type !== 'MemberExpression' || callee.computed === true) return null
  const objectName = identifierName(childNode(callee, 'object'))
  const propertyName = identifierName(childNode(callee, 'property'))
  if (propertyName !== 'createElement' || !objectName) return null
  const provenance = importBinding(program, objectName)
  return provenance?.source === 'react' &&
    (provenance.imported === 'default' || provenance.imported === '*')
    ? { form: 'create-element' }
    : null
}

function normalizeRuntimeElement(
  candidate: AnalyzerCandidate,
  id: ResolvedModuleId,
  program: AstNode,
  imports: readonly HostResolvedImport[],
  call: AstNode,
  runtime: RuntimeCall,
  bailouts: BailoutReason[]
): ElementIR | null {
  const bailoutStart = bailouts.length
  const args = childNodes(call, 'arguments')
  const target = args[0]
  if (!target) {
    bailouts.push(
      localBailout(
        'local/invalid-element-call',
        spanOf(id, call),
        `${runtime.form} call has no element target`
      )
    )
    return null
  }
  const component = componentFromNode(candidate, id, program, imports, target, bailouts)
  if (!component) return null

  const entries: ElementEntryIR[] = []
  const props = args[1]
  if (props && asStaticValue(props) !== null) {
    if (props.type === 'ObjectExpression') {
      entries.push(...objectEntries(id, program, props, bailouts))
    } else {
      entries.push({
        kind: 'spread',
        span: spanOf(id, props),
        value: expressionReference(id, props),
      })
    }
  }
  if (runtime.form === 'create-element') {
    for (const child of args.slice(2)) {
      entries.push(...runtimeChildEntries(id, program, child, bailouts))
    }
  }

  return finalizeElement(
    {
      kind: 'element',
      form: runtime.form,
      id,
      span: spanOf(id, call),
      propsSpan: props ? spanOf(id, props) : null,
      component,
    },
    entries.sort((left, right) => left.span.start - right.span.start),
    bailouts.slice(bailoutStart)
  )
}

function styledDefinitions(
  candidate: AnalyzerCandidate,
  id: ResolvedModuleId,
  program: AstNode,
  imports: readonly HostResolvedImport[],
  bailouts: BailoutReason[]
): StyledDefinitionIR[] {
  const definitions: StyledDefinitionIR[] = []
  walkAst(program, (node) => {
    if (node.type !== 'VariableDeclarator') return
    const identifier = childNode(node, 'id')
    const name = identifierName(identifier)
    const call = childNode(node, 'init')
    if (!name || !identifier || call?.type !== 'CallExpression') return
    const callee = childNode(call, 'callee')
    const factoryName = callee && identifierName(callee)
    if (!factoryName) return
    const binding = importBinding(program, factoryName)
    if (!binding || binding.imported !== 'styled') return
    const factory = hostImportProvenance(imports, binding.source, binding.imported)
    if (!factory) return

    const definitionBailouts: BailoutReason[] = []
    const args = childNodes(call, 'arguments')
    const baseNode = args[0]
    const optionsNode = args.length >= 3 ? args[2] : args[1]
    if (!baseNode || !optionsNode) {
      definitionBailouts.push(
        localBailout(
          'local/unsupported-styled-definition',
          spanOf(id, call),
          `styled definition ${name} must provide a base and options object`
        )
      )
      bailouts.push(...definitionBailouts)
      return
    }
    const base = componentFromNode(
      candidate,
      id,
      program,
      imports,
      baseNode,
      definitionBailouts
    )
    if (!base) {
      bailouts.push(...definitionBailouts)
      return
    }
    const baseClassNode = args.length >= 3 ? args[1] : null
    const baseDefinition = {
      kind: 'styled-definition' as const,
      id,
      name,
      span: spanOf(id, call),
      definitionSpan: spanOf(id, identifier),
      factory,
      base,
      baseClassName: baseClassNode ? elementValue(id, baseClassNode) : null,
      options: expressionReference(id, optionsNode),
    }
    definitions.push(
      definitionBailouts.length === 0
        ? { ...baseDefinition, complete: true, bailouts: [] }
        : {
            ...baseDefinition,
            complete: false,
            bailouts: definitionBailouts as [BailoutReason, ...BailoutReason[]],
          }
    )
    bailouts.push(...definitionBailouts)
  })
  return definitions.sort((left, right) => left.span.start - right.span.start)
}

export function normalizeElements(
  candidate: AnalyzerCandidate,
  rawId: string,
  imports: readonly HostResolvedImport[] = []
): ElementIRResult {
  const id = resolvedModuleId(rawId)
  const program = candidate.programOf(id)
  const elements: ElementIR[] = []
  const bailouts: BailoutReason[] = []

  walkAst(program, (node) => {
    if (node.type === 'JSXElement') {
      const bailoutStart = bailouts.length
      const opening = childNode(node, 'openingElement')
      const target = opening && jsxComponentNode(opening)
      if (!opening || !target) return
      const component = componentFromNode(
        candidate,
        id,
        program,
        imports,
        target,
        bailouts
      )
      if (!component) return
      const closingElement = childNode(node, 'closingElement')
      const closingName = closingElement && childNode(closingElement, 'name')
      if (closingName) component.closingSpan = spanOf(id, closingName)
      const entries = jsxEntries(id, node, opening, bailouts)
      elements.push(
        finalizeElement(
          {
            kind: 'element',
            form: 'jsx',
            id,
            span: spanOf(id, node),
            propsSpan: spanOf(id, opening),
            component,
          },
          entries,
          bailouts.slice(bailoutStart)
        )
      )
      return
    }

    if (node.type !== 'CallExpression') return
    const runtime = runtimeCall(program, node)
    if (!runtime) return
    const element = normalizeRuntimeElement(
      candidate,
      id,
      program,
      imports,
      node,
      runtime,
      bailouts
    )
    if (element) elements.push(element)
  })

  return {
    elements: elements.sort((left, right) => left.span.start - right.span.start),
    styledDefinitions: styledDefinitions(candidate, id, program, imports, bailouts),
    bailouts: bailouts.sort((left, right) => left.span.start - right.span.start),
  }
}

export function declarationForName(program: AstNode, name: string): AstNode | null {
  return findAstNode(program, (node) => {
    if (node.type !== 'VariableDeclarator') return false
    return identifierName(childNode(node, 'id')) === name
  })
}

export function nodeAtSpan(program: AstNode, start: number, end: number): AstNode | null {
  return findAstNode(program, (node) => node.start === start && node.end === end)
}

export function asAstNode(value: unknown, label: string): AstNode {
  if (!isAstNode(value)) throw new Error(`${label} is not an AST node`)
  return value
}
