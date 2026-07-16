import { childNode, childNodes, identifierName, isAstNode, unwrapExpression } from './ast'
import type {
  AstNode,
  ExpressionReference,
  ResolvedModuleId,
  SourceSpan,
  SymbolDefinition,
  SymbolResolver,
} from './contracts'
import { expressionReference, spanOf } from './contracts'
import { linkedBailout, localBailout, type BailoutReason } from './diagnostics'

export type StaticEvaluationValue =
  | string
  | number
  | boolean
  | null
  | StaticEvaluationValue[]
  | { [key: string]: StaticEvaluationValue }

export type EvaluationResult =
  | {
      ok: true
      value: StaticEvaluationValue
      dependencies: ResolvedModuleId[]
    }
  | {
      ok: false
      bailout: BailoutReason
    }

type InternalResult =
  | { ok: true; value: StaticEvaluationValue }
  | { ok: false; bailout: BailoutReason }

interface EvaluationState {
  activeDefinitions: Set<string>
  dependencies: Set<ResolvedModuleId>
}

function success(value: StaticEvaluationValue): InternalResult {
  return { ok: true, value }
}

function literal(node: AstNode): StaticEvaluationValue | undefined {
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

function unsupported(
  id: ResolvedModuleId,
  node: AstNode,
  detail = `Expression ${node.type} is not statically supported`
): InternalResult {
  return {
    ok: false,
    bailout: localBailout('local/unsupported-expression', spanOf(id, node), detail),
  }
}

function evaluateDefinition(
  resolver: SymbolResolver,
  definition: SymbolDefinition,
  useSpan: SourceSpan,
  state: EvaluationState
): InternalResult {
  const key = `${definition.id}:${definition.span.start}`
  if (state.activeDefinitions.has(key)) {
    return {
      ok: false,
      bailout: localBailout(
        'local/static-evaluation-cycle',
        useSpan,
        `Static evaluation cycle reached ${definition.name}`
      ),
    }
  }
  if (!definition.initializer) {
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/missing-initializer',
        useSpan,
        `Binding ${definition.name} has no static initializer`,
        definition.id
      ),
    }
  }
  if (!definition.constant) {
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/unresolved-binding',
        useSpan,
        `Binding ${definition.name} is mutable and cannot be statically evaluated`,
        definition.id
      ),
    }
  }
  const initializer = resolver.expressionNode(definition.initializer)
  if (!initializer) {
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/missing-initializer',
        useSpan,
        `Binding ${definition.name} initializer is outside the linked graph`,
        definition.id
      ),
    }
  }

  state.dependencies.add(definition.id)
  state.activeDefinitions.add(key)
  try {
    return evaluateNode(resolver, definition.id, initializer, state)
  } finally {
    state.activeDefinitions.delete(key)
  }
}

function evaluateObject(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  node: AstNode,
  state: EvaluationState
): InternalResult {
  const output: Record<string, StaticEvaluationValue> = {}
  for (const property of childNodes(node, 'properties')) {
    if (property.type === 'SpreadElement') {
      const argument = childNode(property, 'argument')
      if (!argument) return unsupported(id, property)
      const spread = evaluateNode(resolver, id, argument, state)
      if (!spread.ok) return spread
      if (
        !spread.value ||
        typeof spread.value !== 'object' ||
        Array.isArray(spread.value)
      ) {
        return {
          ok: false,
          bailout: localBailout(
            'local/non-object-spread',
            spanOf(id, property),
            'Static object spread did not evaluate to an object'
          ),
        }
      }
      Object.assign(output, spread.value)
      continue
    }
    if (property.type !== 'Property' && property.type !== 'ObjectProperty') {
      return unsupported(id, property)
    }
    const keyNode = childNode(property, 'key')
    const valueNode = childNode(property, 'value')
    if (!keyNode || !valueNode) return unsupported(id, property)
    let key: StaticEvaluationValue | undefined = identifierName(keyNode) ?? undefined
    if (property.computed === true || key === undefined) {
      const evaluatedKey = evaluateNode(resolver, id, keyNode, state)
      if (!evaluatedKey.ok) return evaluatedKey
      key = evaluatedKey.value
    }
    if (typeof key !== 'string' && typeof key !== 'number') {
      return unsupported(id, keyNode, 'Static object key is not a string or number')
    }
    const value = evaluateNode(resolver, id, valueNode, state)
    if (!value.ok) return value
    output[String(key)] = value.value
  }
  return success(output)
}

function evaluateArray(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  node: AstNode,
  state: EvaluationState
): InternalResult {
  const output: StaticEvaluationValue[] = []
  const rawElements = node.elements
  if (
    !Array.isArray(rawElements) ||
    rawElements.some((element) => element === null || !isAstNode(element))
  ) {
    return unsupported(id, node, 'Sparse arrays are not statically supported')
  }
  for (const element of rawElements.filter(isAstNode)) {
    if (element.type === 'SpreadElement') {
      const argument = childNode(element, 'argument')
      if (!argument) return unsupported(id, element)
      const spread = evaluateNode(resolver, id, argument, state)
      if (!spread.ok) return spread
      if (!Array.isArray(spread.value)) {
        return unsupported(
          id,
          element,
          'Static array spread did not evaluate to an array'
        )
      }
      output.push(...spread.value)
      continue
    }
    const value = evaluateNode(resolver, id, element, state)
    if (!value.ok) return value
    output.push(value.value)
  }
  return success(output)
}

function evaluateNode(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  input: AstNode,
  state: EvaluationState
): InternalResult {
  const node = unwrapExpression(input)
  const literalValue = literal(node)
  if (literalValue !== undefined) return success(literalValue)

  switch (node.type) {
    case 'Identifier': {
      const name = identifierName(node)
      if (!name) return unsupported(id, node)
      const definition = resolver.resolveBinding(id, name)
      if (!definition) {
        return {
          ok: false,
          bailout: linkedBailout(
            'linked/unresolved-binding',
            spanOf(id, node),
            `Binding ${name} has no host-linked definition`
          ),
        }
      }
      return evaluateDefinition(resolver, definition, spanOf(id, node), state)
    }
    case 'ObjectExpression':
      return evaluateObject(resolver, id, node, state)
    case 'ArrayExpression':
      return evaluateArray(resolver, id, node, state)
    case 'MemberExpression': {
      const objectNode = childNode(node, 'object')
      const propertyNode = childNode(node, 'property')
      if (!objectNode || !propertyNode) return unsupported(id, node)
      const object = evaluateNode(resolver, id, objectNode, state)
      if (!object.ok) return object
      let property: StaticEvaluationValue | null = identifierName(propertyNode)
      if (node.computed === true || property === null) {
        const evaluatedProperty = evaluateNode(resolver, id, propertyNode, state)
        if (!evaluatedProperty.ok) return evaluatedProperty
        property = evaluatedProperty.value
      }
      if (
        (typeof object.value !== 'object' || object.value === null) &&
        typeof object.value !== 'string'
      ) {
        return unsupported(id, node, 'Static member target is not indexable')
      }
      if (typeof property !== 'string' && typeof property !== 'number') {
        return unsupported(
          id,
          propertyNode,
          'Static member key is not a string or number'
        )
      }
      const value = (object.value as Record<string, StaticEvaluationValue>)[
        String(property)
      ]
      return value === undefined
        ? unsupported(id, node, `Static member ${String(property)} does not exist`)
        : success(value)
    }
    case 'UnaryExpression': {
      const argument = childNode(node, 'argument')
      if (!argument) return unsupported(id, node)
      const value = evaluateNode(resolver, id, argument, state)
      if (!value.ok) return value
      if (node.operator === '-' && typeof value.value === 'number') {
        return success(-value.value)
      }
      if (node.operator === '+' && typeof value.value === 'number') {
        return success(value.value)
      }
      if (node.operator === '!') return success(!value.value)
      return unsupported(
        id,
        node,
        `Unary operator ${String(node.operator)} is unsupported`
      )
    }
    case 'BinaryExpression':
    case 'LogicalExpression': {
      const leftNode = childNode(node, 'left')
      const rightNode = childNode(node, 'right')
      if (!leftNode || !rightNode) return unsupported(id, node)
      const left = evaluateNode(resolver, id, leftNode, state)
      if (!left.ok) return left
      if (node.type === 'LogicalExpression') {
        if (node.operator === '&&' && !left.value) return left
        if (node.operator === '||' && left.value) return left
        if (node.operator === '??' && left.value !== null) return left
      }
      const right = evaluateNode(resolver, id, rightNode, state)
      if (!right.ok) return right
      switch (node.operator) {
        case '+':
          if (typeof left.value === 'number' && typeof right.value === 'number') {
            return success(left.value + right.value)
          }
          if (typeof left.value === 'string' || typeof right.value === 'string') {
            return success(String(left.value) + String(right.value))
          }
          break
        case '-':
          if (typeof left.value === 'number' && typeof right.value === 'number') {
            return success(left.value - right.value)
          }
          break
        case '*':
          if (typeof left.value === 'number' && typeof right.value === 'number') {
            return success(left.value * right.value)
          }
          break
        case '/':
          if (typeof left.value === 'number' && typeof right.value === 'number') {
            return success(left.value / right.value)
          }
          break
        case '&&':
        case '||':
        case '??':
          return right
      }
      return unsupported(
        id,
        node,
        `Binary operator ${String(node.operator)} is unsupported`
      )
    }
    case 'ConditionalExpression': {
      const testNode = childNode(node, 'test')
      const consequent = childNode(node, 'consequent')
      const alternate = childNode(node, 'alternate')
      if (!testNode || !consequent || !alternate) return unsupported(id, node)
      const test = evaluateNode(resolver, id, testNode, state)
      if (!test.ok) return test
      return evaluateNode(resolver, id, test.value ? consequent : alternate, state)
    }
    case 'TemplateLiteral': {
      const quasis = childNodes(node, 'quasis')
      const expressions = childNodes(node, 'expressions')
      let output = ''
      for (let index = 0; index < quasis.length; index++) {
        const quasi = quasis[index]
        const cooked = (quasi?.value as { cooked?: unknown } | undefined)?.cooked
        const raw = (quasi?.value as { raw?: unknown } | undefined)?.raw
        output += typeof cooked === 'string' ? cooked : typeof raw === 'string' ? raw : ''
        const expression = expressions[index]
        if (expression) {
          const value = evaluateNode(resolver, id, expression, state)
          if (!value.ok) return value
          output += String(value.value)
        }
      }
      return success(output)
    }
    default:
      return unsupported(id, node)
  }
}

export function evaluateExpression(
  resolver: SymbolResolver,
  reference: ExpressionReference
): EvaluationResult {
  const node = resolver.expressionNode(reference)
  if (!node) {
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/missing-initializer',
        reference,
        'Expression is outside the linked project graph',
        reference.id
      ),
    }
  }
  const state: EvaluationState = {
    activeDefinitions: new Set(),
    dependencies: new Set(),
  }
  const result = evaluateNode(resolver, reference.id, node, state)
  return result.ok
    ? {
        ok: true,
        value: result.value,
        dependencies: [...state.dependencies].sort(),
      }
    : result
}

export function evaluateBinding(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  localName: string
): EvaluationResult {
  const definition = resolver.resolveBinding(id, localName)
  if (!definition) {
    const emptySpan: SourceSpan = { id, start: 0, end: 0 }
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/unresolved-binding',
        emptySpan,
        `Binding ${localName} has no host-linked definition`
      ),
    }
  }
  if (!definition.initializer) {
    return {
      ok: false,
      bailout: linkedBailout(
        'linked/missing-initializer',
        definition.span,
        `Binding ${localName} has no static initializer`,
        definition.id
      ),
    }
  }
  return evaluateExpression(
    resolver,
    expressionReference(definition.id, definition.initializer)
  )
}
