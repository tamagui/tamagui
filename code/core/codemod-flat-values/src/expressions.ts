// Two different questions get asked about a dynamic style value, each answered
// exactly one way.
//
// 1. Can the expression be rewritten? Only a tree of literals can: its `$token`
//    spellings are right there in the source, so `active ? '$red10' : '$blue10'`
//    becomes `active ? 'red10' : 'blue10'`. `literalTree` answers this from the
//    AST.
// 2. Can the expression be left alone? Only if its runtime type cannot carry a
//    legacy `$token` string. `runtimeType` answers this from the type checker, so
//    `const GREY = 'rgb(217, 215, 210)'` is provably safe while an untyped
//    identifier is not.

import { Node, SyntaxKind, type Expression, type TemplateExpression } from 'ts-morph'
import { flatStringValue, type ModifierRegistryView } from './grammar'

export function unwrapExpression(expression: Expression): Expression {
  let current = expression
  while (
    Node.isParenthesizedExpression(current) ||
    Node.isAsExpression(current) ||
    Node.isTypeAssertion(current) ||
    Node.isNonNullExpression(current)
  ) {
    current = current.getExpression()
  }
  return current
}

export function numericValue(expression: Expression): number | null {
  const current = unwrapExpression(expression)
  if (Node.isNumericLiteral(current)) return Number(current.getText())
  if (Node.isPrefixUnaryExpression(current)) {
    const operand = current.getOperand()
    if (!Node.isNumericLiteral(operand)) return null
    const value = Number(operand.getText())
    const operator = current.getOperatorToken()
    if (operator === SyntaxKind.MinusToken) return -value
    if (operator === SyntaxKind.PlusToken) return value
  }
  return null
}

/** the statically known value of a legacy condition object leaf */
export function staticLeafValue(
  expression: Expression
): { found: true; value: unknown } | null {
  const current = unwrapExpression(expression)
  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    return { found: true, value: current.getLiteralValue() }
  }
  const number = numericValue(current)
  if (number !== null) return { found: true, value: number }
  if (current.getKind() === SyntaxKind.TrueKeyword) return { found: true, value: true }
  if (current.getKind() === SyntaxKind.FalseKeyword) return { found: true, value: false }
  if (current.getKind() === SyntaxKind.NullKeyword) return { found: true, value: null }
  return null
}

export type LiteralKind = 'number' | 'string' | 'nullish'

export interface TreeError {
  code: string
  message: string
}

export interface LiteralTree {
  kind: LiteralKind
  /** the expression source with legacy token spellings rewritten */
  text: string
  /** set when a token spelling in the tree has no flat name */
  error: TreeError | null
}

/**
 * One literal chunk's flat spelling. A chunk with no `$` is already flat, and one
 * that has a `$` goes through the shared converter, so the same value refused as
 * a clause payload (`url($asset)`) is refused here instead of being rewritten.
 */
function literalText(
  value: string,
  registry: ModifierRegistryView
): { text: string; error: TreeError | null } {
  if (!value.includes('$')) return { text: value, error: null }
  const flat = flatStringValue(value, registry)
  if (flat.text === null) {
    return {
      text: value,
      error: {
        code: flat.error?.code ?? 'unsupported-legacy-value',
        message: flat.error?.message ?? `"${value}" has no flat spelling`,
      },
    }
  }
  return { text: flat.text, error: null }
}

function templateTree(
  template: TemplateExpression,
  registry: ModifierRegistryView
): LiteralTree {
  // every literal chunk converts on its own: `\`$accent${i}\`` names one token
  // whose tail is computed, and a chunk holding quoted or url() content is refused
  const head = literalText(template.getHead().getLiteralText(), registry)
  let error = head.error
  let text = `\`${head.text}`
  for (const span of template.getTemplateSpans()) {
    const tail = literalText(span.getLiteral().getLiteralText(), registry)
    error ??= tail.error
    text += `\${${span.getExpression().getText().trim()}}${tail.text}`
  }
  return { kind: 'string', text: `${text}\``, error }
}

/**
 * The expression as a tree of literals, or null when any leaf is computed. Every
 * literal is reprinted, which is what strips `$` from token spellings.
 */
export function literalTree(
  expression: Expression,
  registry: ModifierRegistryView
): LiteralTree | null {
  const current = unwrapExpression(expression)

  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    const literal = literalText(current.getLiteralValue(), registry)
    return { kind: 'string', text: JSON.stringify(literal.text), error: literal.error }
  }
  if (Node.isTemplateExpression(current)) return templateTree(current, registry)

  const number = numericValue(current)
  if (number !== null) return { kind: 'number', text: String(number), error: null }

  if (
    current.getKind() === SyntaxKind.UndefinedKeyword ||
    current.getKind() === SyntaxKind.NullKeyword ||
    (Node.isIdentifier(current) && current.getText() === 'undefined')
  ) {
    return { kind: 'nullish', text: current.getText(), error: null }
  }

  if (Node.isConditionalExpression(current)) {
    const whenTrue = literalTree(current.getWhenTrue(), registry)
    const whenFalse = literalTree(current.getWhenFalse(), registry)
    if (!whenTrue || !whenFalse) return null
    if (
      whenTrue.kind !== whenFalse.kind &&
      whenTrue.kind !== 'nullish' &&
      whenFalse.kind !== 'nullish'
    ) {
      return null
    }
    return {
      kind: whenTrue.kind === 'nullish' ? whenFalse.kind : whenTrue.kind,
      text: `${current.getCondition().getText().trim()} ? ${whenTrue.text} : ${whenFalse.text}`,
      error: whenTrue.error ?? whenFalse.error,
    }
  }

  return null
}

export interface RuntimeType {
  kind: 'number' | 'string' | 'unknown'
  /** every string literal the type can be, or null when the set is open */
  literals: readonly string[] | null
}

/** what the type checker can prove the expression evaluates to */
export function runtimeType(expression: Expression): RuntimeType {
  const type = unwrapExpression(expression).getType()
  const parts = type.isUnion() ? type.getUnionTypes() : [type]
  const literals: string[] = []
  let numbers = 0
  let strings = 0
  let known = 0

  for (const part of parts) {
    if (part.isUndefined() || part.isNull()) continue
    known++
    if (part.isNumber() || part.isNumberLiteral()) {
      numbers++
      continue
    }
    if (part.isStringLiteral()) {
      strings++
      literals.push(String(part.getLiteralValue()))
      continue
    }
    if (part.isString()) {
      strings++
      continue
    }
    return { kind: 'unknown', literals: null }
  }

  if (!known) return { kind: 'unknown', literals: null }
  if (numbers === known) return { kind: 'number', literals: null }
  if (strings === known) {
    return { kind: 'string', literals: literals.length === known ? literals : null }
  }
  return { kind: 'unknown', literals: null }
}

export function compact(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
