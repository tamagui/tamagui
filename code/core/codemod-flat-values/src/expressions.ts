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

export interface LiteralTree {
  kind: LiteralKind
  /** the expression source with legacy token spellings rewritten */
  text: string
  /** set when a token spelling in the tree has no flat name */
  error: string | null
}

function tokenText(value: string): { text: string; error: string | null } {
  if (!value.startsWith('$')) return { text: JSON.stringify(value), error: null }
  const token = value.slice(1)
  if (!token) {
    return { text: JSON.stringify(value), error: 'a bare "$" is not a token name' }
  }
  if (token.includes('.')) {
    return {
      text: JSON.stringify(value),
      error: `token "${value}" uses dot-path naming and needs an explicit flat name`,
    }
  }
  return { text: JSON.stringify(token), error: null }
}

function templateTree(template: TemplateExpression): LiteralTree {
  const head = template.getHead()
  // `\`$accent${i}\`` names one token whose tail is computed, so only the `$`
  // prefix is legacy syntax
  const headText = head.getLiteralText()
  const rewritten = headText.startsWith('$') ? headText.slice(1) : headText
  let text = `\`${rewritten}`
  for (const span of template.getTemplateSpans()) {
    text += `\${${span.getExpression().getText().trim()}}${span.getLiteral().getLiteralText()}`
  }
  return { kind: 'string', text: `${text}\``, error: null }
}

/**
 * The expression as a tree of literals, or null when any leaf is computed. Every
 * literal is reprinted, which is what strips `$` from token spellings.
 */
export function literalTree(expression: Expression): LiteralTree | null {
  const current = unwrapExpression(expression)

  if (Node.isStringLiteral(current) || Node.isNoSubstitutionTemplateLiteral(current)) {
    const token = tokenText(current.getLiteralValue())
    return { kind: 'string', text: token.text, error: token.error }
  }
  if (Node.isTemplateExpression(current)) return templateTree(current)

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
    const whenTrue = literalTree(current.getWhenTrue())
    const whenFalse = literalTree(current.getWhenFalse())
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

export interface StrippedTokens {
  text: string
  /** token spellings that have no flat name */
  errors: string[]
  converted: boolean
}

/**
 * V3 values do not use `$`, and a token can appear anywhere inside a composite
 * value: `boxShadow="0 4px 12px $shadowColor"` names one token in the middle of a
 * shadow. Every component-leading `$identifier` loses its prefix, and a dot-path
 * name is reported instead, because `$1.5` would silently become the number 1.5.
 */
export function stripTokenPrefixes(value: string): StrippedTokens {
  const errors: string[] = []
  let converted = false
  const text = value.replace(
    /(^|[\s(,/])\$([A-Za-z0-9_][A-Za-z0-9_.-]*)/g,
    (whole, boundary: string, name: string) => {
      if (name.includes('.')) {
        errors.push(`$${name}`)
        return whole
      }
      converted = true
      return `${boundary}${name}`
    }
  )
  return { text, errors, converted }
}
