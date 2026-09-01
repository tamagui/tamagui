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

export interface DynamicEvaluation {
  type: 'number' | 'string' | 'boolean' | 'null'
  values?: (number | string | boolean | null)[]
  dependencies: ResolvedModuleId[]
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
        output += quasiText(quasis[index])
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

function quasiText(quasi: AstNode | undefined): string {
  const cooked = (quasi?.value as { cooked?: unknown } | undefined)?.cooked
  const raw = (quasi?.value as { raw?: unknown } | undefined)?.raw
  return typeof cooked === 'string' ? cooked : typeof raw === 'string' ? raw : ''
}

function dynamicPrimitive(
  value: StaticEvaluationValue
): DynamicEvaluation['type'] | null {
  if (value === null) return 'null'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'boolean') return 'boolean'
  return null
}

function evaluateDynamicNode(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  input: AstNode,
  state: EvaluationState
): Omit<DynamicEvaluation, 'dependencies'> | null {
  const exact = evaluateNode(resolver, id, input, state)
  if (exact.ok) {
    const type = dynamicPrimitive(exact.value)
    return type
      ? { type, values: [exact.value as number | string | boolean | null] }
      : null
  }

  const node = unwrapExpression(input)
  if (node.type === 'Identifier') {
    if (!identifierName(node)) return null
    const definition = resolver.resolveReference(expressionReference(id, node))
    if (!definition?.constant || !definition.initializer) return null
    const key = `${definition.id}:${definition.span.start}`
    if (state.activeDefinitions.has(key)) return null
    const initializer = resolver.expressionNode(definition.initializer)
    if (!initializer) return null
    state.dependencies.add(definition.id)
    state.activeDefinitions.add(key)
    try {
      return evaluateDynamicNode(resolver, definition.id, initializer, state)
    } finally {
      state.activeDefinitions.delete(key)
    }
  }

  if (node.type === 'MemberExpression') {
    const objectNode = childNode(node, 'object')
    const propertyNode = childNode(node, 'property')
    if (!objectNode || !propertyNode) return null
    const object = evaluateNode(resolver, id, objectNode, state)
    if (!object.ok || !Array.isArray(object.value)) return null
    const property = evaluateDynamicNode(resolver, id, propertyNode, state)
    if (property?.type !== 'number' || object.value.length > 32) return null
    const values: (number | string | boolean | null)[] = []
    let type: DynamicEvaluation['type'] | null = null
    for (const value of object.value) {
      const nextType = dynamicPrimitive(value)
      if (!nextType || (type && type !== nextType)) return null
      type = nextType
      const primitive = value as number | string | boolean | null
      if (!values.includes(primitive)) values.push(primitive)
    }
    return type ? { type, values } : null
  }

  if (node.type === 'BinaryExpression') {
    const leftNode = childNode(node, 'left')
    const rightNode = childNode(node, 'right')
    if (!leftNode || !rightNode) return null
    const left = evaluateDynamicNode(resolver, id, leftNode, state)
    const right = evaluateDynamicNode(resolver, id, rightNode, state)
    if (node.operator === '+') {
      return left?.type === 'number' && right?.type === 'number'
        ? { type: 'number' }
        : null
    }
    if (
      node.operator === '-' ||
      node.operator === '*' ||
      node.operator === '/' ||
      node.operator === '%' ||
      node.operator === '**'
    ) {
      // successful javascript arithmetic with a number operand produces a
      // number. bigint mixed with the numeric literals used here throws before
      // the style value exists, so it does not create another runtime domain.
      if (left?.type === 'number' || right?.type === 'number') {
        return { type: 'number' }
      }
    }
  }

  return null
}

export type BranchDecisionNode =
  | {
      kind: 'leaf'
      value?: StaticEvaluationValue
      dependencies: ResolvedModuleId[]
    }
  | {
      kind: 'branch'
      test: SourceSpan
      whenTrue: BranchDecisionNode
      whenFalse: BranchDecisionNode
    }

export function collectLeaves(
  node: BranchDecisionNode
): { value?: StaticEvaluationValue; dependencies: ResolvedModuleId[] }[] {
  if (node.kind === 'leaf') return [node]
  return [...collectLeaves(node.whenTrue), ...collectLeaves(node.whenFalse)]
}

export function collectBranchDependencies(node: BranchDecisionNode): ResolvedModuleId[] {
  if (node.kind === 'leaf') return node.dependencies
  return [
    ...new Set([
      ...collectBranchDependencies(node.whenTrue),
      ...collectBranchDependencies(node.whenFalse),
    ]),
  ].sort()
}

function evaluateBranchChild(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  node: AstNode,
  depth: number,
  state: EvaluationState,
  sourceId: ResolvedModuleId
): BranchDecisionNode | null {
  const leafState: EvaluationState = {
    activeDefinitions: new Set(state.activeDefinitions),
    dependencies: new Set(state.dependencies),
  }
  const leafRes = evaluateNode(resolver, id, node, leafState)
  if (leafRes.ok) {
    return {
      kind: 'leaf',
      value: leafRes.value,
      dependencies: [...leafState.dependencies].sort(),
    }
  }
  return evaluateBranchesNode(resolver, id, node, depth + 1, leafState, sourceId)
}

function evaluateBranchesNode(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  input: AstNode,
  depth: number,
  state: EvaluationState,
  sourceId: ResolvedModuleId
): BranchDecisionNode | null {
  const node = unwrapExpression(input)
  if (!isAstNode(node)) return null

  if (node.type === 'Identifier') {
    const name = identifierName(node)
    if (!name) return null
    const definition = resolver.resolveBinding(id, name)
    if (!definition || !definition.constant || !definition.initializer) return null
    const initializer = resolver.expressionNode(definition.initializer)
    if (!initializer) return null
    const key = `${definition.id}:${definition.span.start}`
    if (state.activeDefinitions.has(key)) return null
    state.activeDefinitions.add(key)
    state.dependencies.add(definition.id)
    try {
      return evaluateBranchesNode(
        resolver,
        definition.id,
        initializer,
        depth,
        state,
        sourceId
      )
    } finally {
      state.activeDefinitions.delete(key)
    }
  }

  if (depth >= 3) return null

  if (node.type === 'ConditionalExpression') {
    const testNode = childNode(node, 'test')
    const consequent = childNode(node, 'consequent')
    const alternate = childNode(node, 'alternate')
    if (!testNode || !consequent || !alternate) return null

    const test = spanOf(id, testNode)
    if (test.id !== sourceId) return null
    const whenTrue = evaluateBranchChild(resolver, id, consequent, depth, state, sourceId)
    if (!whenTrue) return null
    const whenFalse = evaluateBranchChild(resolver, id, alternate, depth, state, sourceId)
    if (!whenFalse) return null

    return {
      kind: 'branch',
      test,
      whenTrue,
      whenFalse,
    }
  }

  if (node.type === 'TemplateLiteral') {
    return templateBranchesNode(
      resolver,
      id,
      childNodes(node, 'quasis'),
      childNodes(node, 'expressions'),
      0,
      '',
      depth,
      state,
      sourceId
    )
  }

  if (node.type === 'LogicalExpression') {
    const left = childNode(node, 'left')
    const right = childNode(node, 'right')
    if (!left || !right) return null

    if (node.operator === '&&') {
      const test = spanOf(id, left)
      if (test.id !== sourceId) return null
      const whenTrue = evaluateBranchChild(resolver, id, right, depth, state, sourceId)
      if (!whenTrue) return null
      const whenFalse: BranchDecisionNode = {
        kind: 'leaf',
        value: undefined,
        dependencies: [...state.dependencies].sort(),
      }
      return {
        kind: 'branch',
        test,
        whenTrue,
        whenFalse,
      }
    }

    if (node.operator === '||' || node.operator === '??') {
      const test = spanOf(id, left)
      if (test.id !== sourceId) return null
      const leftState: EvaluationState = {
        activeDefinitions: new Set(state.activeDefinitions),
        dependencies: new Set(state.dependencies),
      }
      const leftRes = evaluateNode(resolver, id, left, leftState)
      if (!leftRes.ok) return null
      const whenTrue: BranchDecisionNode = {
        kind: 'leaf',
        value: leftRes.value,
        dependencies: [...leftState.dependencies].sort(),
      }
      const whenFalse = evaluateBranchChild(resolver, id, right, depth, state, sourceId)
      if (!whenFalse) return null
      return {
        kind: 'branch',
        test,
        whenTrue,
        whenFalse,
      }
    }
  }

  return null
}

function mapBranchLeaves(
  node: BranchDecisionNode,
  map: (leaf: Extract<BranchDecisionNode, { kind: 'leaf' }>) => BranchDecisionNode | null
): BranchDecisionNode | null {
  if (node.kind === 'leaf') return map(node)
  const whenTrue = mapBranchLeaves(node.whenTrue, map)
  if (!whenTrue) return null
  const whenFalse = mapBranchLeaves(node.whenFalse, map)
  if (!whenFalse) return null
  return { kind: 'branch', test: node.test, whenTrue, whenFalse }
}

/**
 * A template literal is a decision tree once every value it interpolates is:
 * `${active ? 'red10' : 'blue10'}` names the same two strings the bare ternary
 * does, and the quasis around it are constants. Each interpolated tree
 * multiplies the leaves, so every step spends a level of the shared depth
 * budget and a wide template refuses instead of expanding.
 */
function templateBranchesNode(
  resolver: SymbolResolver,
  id: ResolvedModuleId,
  quasis: AstNode[],
  expressions: AstNode[],
  index: number,
  prefix: string,
  depth: number,
  state: EvaluationState,
  sourceId: ResolvedModuleId
): BranchDecisionNode | null {
  let text = prefix
  for (let position = index; position < quasis.length; position++) {
    text += quasiText(quasis[position])
    const expression = expressions[position]
    if (!expression) continue
    const exact = evaluateNode(resolver, id, expression, state)
    if (exact.ok) {
      const interpolated = templateInterpolation(exact.value)
      if (interpolated === null) return null
      text += interpolated
      continue
    }
    const tree = evaluateBranchesNode(
      resolver,
      id,
      expression,
      depth + 1,
      state,
      sourceId
    )
    if (!tree) return null
    return mapBranchLeaves(tree, (leaf) => {
      // an `&&` leaf carries `undefined` to mean "the falsy left operand", whose
      // string form is the operand itself and so is not known here
      if (leaf.value === undefined) return null
      const interpolated = templateInterpolation(leaf.value)
      if (interpolated === null) return null
      return templateBranchesNode(
        resolver,
        id,
        quasis,
        expressions,
        position + 1,
        text + interpolated,
        depth + 1,
        state,
        sourceId
      )
    })
  }
  return { kind: 'leaf', value: text, dependencies: [...state.dependencies].sort() }
}

/** ToString on a primitive, which is all a template can be folded through */
function templateInterpolation(value: StaticEvaluationValue): string | null {
  if (value === null) return 'null'
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value)
  }
  return null
}

/**
 * A conditional or logical expression whose test resists static evaluation while
 * its branch values evaluate statically or form a decision tree.
 */
export function evaluateBranches(
  resolver: SymbolResolver,
  reference: ExpressionReference
): BranchDecisionNode | null {
  const node = resolver.expressionNode(reference)
  if (!node) return null
  const state: EvaluationState = {
    activeDefinitions: new Set(),
    dependencies: new Set(),
  }
  const tree = evaluateBranchesNode(resolver, reference.id, node, 0, state, reference.id)
  return tree?.kind === 'branch' ? tree : null
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

/**
 * proves the runtime domain of a dynamic expression without evaluating its
 * changing inputs. this is deliberately narrow: numeric arithmetic and a
 * bounded lookup into a static primitive array are the two forms a host style
 * can consume directly without retaining the full Tamagui resolver.
 */
export function evaluateDynamicExpression(
  resolver: SymbolResolver,
  reference: ExpressionReference
): DynamicEvaluation | null {
  const node = resolver.expressionNode(reference)
  if (!node) return null
  const state: EvaluationState = {
    activeDefinitions: new Set(),
    dependencies: new Set(),
  }
  const result = evaluateDynamicNode(resolver, reference.id, node, state)
  return result ? { ...result, dependencies: [...state.dependencies].sort() } : null
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
