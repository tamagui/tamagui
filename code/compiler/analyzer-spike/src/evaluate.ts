import {
  childNode,
  childNodes,
  identifierName,
  literalValue,
  unwrapExpression,
} from './ast'
import type { AnalyzerCandidate, AstNode } from './contracts'

const evaluating = new Set<string>()

export function evaluateBinding(
  candidate: AnalyzerCandidate,
  id: string,
  localName: string
): unknown {
  const definition = candidate.definitionOf(id, localName)
  if (!definition?.initializer) {
    throw new Error(`${candidate.name}: ${id}:${localName} has no static initializer`)
  }

  const key = `${definition.id}:${definition.start}`
  if (evaluating.has(key)) throw new Error(`Static evaluation cycle at ${key}`)
  evaluating.add(key)
  try {
    return evaluateNode(candidate, definition.id, definition.initializer)
  } finally {
    evaluating.delete(key)
  }
}

export function evaluateNode(
  candidate: AnalyzerCandidate,
  id: string,
  input: AstNode
): unknown {
  const node = unwrapExpression(input)
  const literal = literalValue(node)
  if (literal !== undefined) return literal

  switch (node.type) {
    case 'Identifier': {
      const name = identifierName(node)
      if (!name) throw new Error(`Unnamed identifier at ${id}:${node.start}`)
      return evaluateBinding(candidate, id, name)
    }
    case 'ObjectExpression': {
      const output: Record<string, unknown> = {}
      for (const property of childNodes(node, 'properties')) {
        if (property.type === 'SpreadElement') {
          const spread = childNode(property, 'argument')
          const value = spread ? evaluateNode(candidate, id, spread) : null
          if (!value || typeof value !== 'object' || Array.isArray(value)) {
            throw new Error(`Non-object spread at ${id}:${property.start}`)
          }
          Object.assign(output, value)
          continue
        }
        if (property.type !== 'Property' && property.type !== 'ObjectProperty') continue
        const keyNode = childNode(property, 'key')
        const key = identifierName(keyNode) ?? literalValue(keyNode)
        if (typeof key !== 'string' && typeof key !== 'number') {
          throw new Error(`Unsupported object key at ${id}:${property.start}`)
        }
        const valueNode = childNode(property, 'value')
        if (!valueNode) throw new Error(`Missing object value at ${id}:${property.start}`)
        output[String(key)] = evaluateNode(candidate, id, valueNode)
      }
      return output
    }
    case 'MemberExpression': {
      const objectNode = childNode(node, 'object')
      const propertyNode = childNode(node, 'property')
      if (!objectNode || !propertyNode)
        throw new Error(`Invalid member expression at ${id}`)
      const object = evaluateNode(candidate, id, objectNode)
      const computed = node.computed === true
      const property = computed
        ? evaluateNode(candidate, id, propertyNode)
        : identifierName(propertyNode)
      if ((typeof object !== 'object' || object === null) && typeof object !== 'string') {
        throw new Error(
          `Cannot read ${String(property)} from non-object at ${id}:${node.start}`
        )
      }
      return (object as Record<string, unknown>)[String(property)]
    }
    case 'BinaryExpression': {
      const leftNode = childNode(node, 'left')
      const rightNode = childNode(node, 'right')
      if (!leftNode || !rightNode) throw new Error(`Invalid binary expression at ${id}`)
      const left = evaluateNode(candidate, id, leftNode)
      const right = evaluateNode(candidate, id, rightNode)
      switch (node.operator) {
        case '+':
          return (left as number) + (right as number)
        case '*':
          return (left as number) * (right as number)
        default:
          throw new Error(
            `Unsupported operator ${String(node.operator)} at ${id}:${node.start}`
          )
      }
    }
    default:
      throw new Error(`Unsupported static node ${node.type} at ${id}:${node.start}`)
  }
}
