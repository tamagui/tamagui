// The universal flat value parser.
//
//   value  := base? clause*
//   clause := modifier (":" modifier)* ":" payload
//
// See plans/dom-tailwind-flat-values.md — "The universal value grammar". The
// parser only splits: `base` and every `payload` come back as trimmed raw CSS
// component-value sequences with no interpretation and no token resolution.
//
// `reduceFlatValueIdentity` drives the one `scanFlatValue` lexer and owns clause
// spans, alias folding, and slot identity. This file adds the configured
// modifier registry and parser diagnostics. Read `scanFlatValue.ts` for why a
// top-level colon, brace or semicolon is structural and everything inside a
// string or a paren is not.

import {
  reduceFlatValueIdentity,
  type ClauseIdentityErrorCode,
  type ClauseIdentityHandler,
} from '../runtime/clauseIdentity'
import type {
  ModifierRegistryView,
  ParsedClause,
  ValueParseError,
  ValueParseErrorCode,
  ValueParseResult,
} from './valueTypes'

const noClauses: readonly ParsedClause[] = Object.freeze([])

export interface ValueSourceSpan {
  kind: 'base' | 'payload' | 'modifier' | 'word'
  start: number
  end: number
}

export interface ValueParseWithSourceSpans {
  result: ValueParseResult
  spans: readonly ValueSourceSpan[]
}

type ValueParseContext = {
  input: string
  registry: ModifierRegistryView
  sourceSpans?: ValueSourceSpan[]
  errors: ValueParseError[] | null
  base: string | null
  clauses: ParsedClause[] | null
  pending: string[] | null
  pendingValid: boolean
}

/**
 * NOT A SAFETY CHECK. A successful parse says the value is well-formed FLAT
 * VALUE SYNTAX. It does not say the value is safe to interpolate into CSS.
 *
 * `scanFlatValue` tracks the same constructs CSS's tokenizer does (comments,
 * strings that a newline ends, `url()`, paren nesting), so a value whose
 * delimiters do not actually close is an error rather than silently trusted.
 * That covers the constructs a value can leave OPEN; it is not an injection
 * guard. `emitValue` and `getStyleObject` used to call a
 * `carriesTopLevelInjection` guard independently; it was removed by owner
 * decision, on the grounds that a style value is authored rather than user
 * input, and the web lowering emits payloads verbatim by contract.
 *
 * So the rule lives upstream of this file: never put a user-controlled string
 * in a style value. A payload carrying `;}` closes its own rule and everything
 * after it is a selector block the author never wrote. Do not gate emission on
 * `parseValue(...).ok` either; it answers a syntax question, not a safety one.
 */
export function parseValue(
  input: string,
  registry: ModifierRegistryView
): ValueParseResult {
  return parseValueInternal(input, registry)
}

/**
 * Parses through the shared identity reduction while also retaining source
 * boundaries for editor tooling. The ordinary runtime path does not allocate
 * these spans.
 */
export function parseValueWithSourceSpans(
  input: string,
  registry: ModifierRegistryView
): ValueParseWithSourceSpans {
  const spans: ValueSourceSpan[] = []
  return {
    result: parseValueInternal(input, registry, spans),
    spans,
  }
}

function scanErrorMessage(
  code: Exclude<ClauseIdentityErrorCode, 'empty-modifier' | 'empty-payload'>,
  input: string,
  index: number
): string {
  if (code === 'invalid-character') {
    return `"${input[index]}" cannot appear in a value: it would end the declaration or rule`
  }
  if (code === 'unterminated-string') {
    return `unterminated ${input[index]} string`
  }
  if (code === 'unterminated-comment') {
    return 'unterminated "/*" comment: it would swallow the rules after this one'
  }
  if (code === 'stray-comment-close') {
    return 'stray "*/": it would close a comment opened somewhere else'
  }
  return 'unterminated "(" in value'
}

function addParseError(
  ctx: ValueParseContext,
  code: ValueParseErrorCode,
  index: number,
  message: string,
  modifier?: string
): void {
  ;(ctx.errors ||= []).push(
    modifier === undefined ? { code, index, message } : { code, index, message, modifier }
  )
}

const valueParserHandler: ClauseIdentityHandler<ValueParseContext> = {
  segment(ctx, start, end, isBase, valid) {
    ctx.sourceSpans?.push({ kind: isBase ? 'base' : 'payload', start, end })
    if (isBase) {
      ctx.base = valid && start < end ? ctx.input.slice(start, end) : null
    } else if (!valid) {
      ctx.pendingValid = false
    }
  },

  chain(ctx) {
    ctx.pending = []
    ctx.pendingValid = true
  },

  modifier(ctx, start, end) {
    const name = ctx.input.slice(start, end)
    ctx.sourceSpans?.push({ kind: 'modifier', start, end })
    if (ctx.registry.get(name) === undefined) {
      ctx.pendingValid = false
      addParseError(
        ctx,
        'unregistered-modifier',
        start,
        `"${name}" is not a registered modifier`,
        name
      )
    }
    ctx.pending!.push(name)
  },

  clause(ctx, _start, _chainEnd, start, end) {
    if (!ctx.pendingValid) return
    ;(ctx.clauses ||= []).push({
      modifiers: ctx.pending!,
      payload: ctx.input.slice(start, end),
    })
  },

  error(ctx, code, index) {
    if (code === 'empty-modifier') {
      ctx.pendingValid = false
      addParseError(ctx, code, index, 'a modifier chain has an empty segment')
      return
    }
    if (code === 'empty-payload') {
      addParseError(
        ctx,
        code,
        index,
        `the "${ctx.pending!.join(':')}:" clause has no value`
      )
      return
    }
    addParseError(ctx, code, index, scanErrorMessage(code, ctx.input, index))
  },

  word(ctx, start, end, isChain) {
    // only the trailing bare word is a completion position the spans have no
    // other name for: every earlier word is inside a base or a payload span
    if (ctx.sourceSpans && !isChain && end === ctx.input.length) {
      ctx.sourceSpans.push({ kind: 'word', start, end })
    }
  },
}

function parseValueInternal(
  input: string,
  registry: ModifierRegistryView,
  sourceSpans?: ValueSourceSpan[]
): ValueParseResult {
  const ctx: ValueParseContext = {
    input,
    registry,
    sourceSpans,
    errors: null,
    base: null,
    clauses: null,
    pending: null,
    pendingValid: true,
  }

  reduceFlatValueIdentity(input, valueParserHandler, ctx)

  const value = { base: ctx.base, clauses: ctx.clauses ?? noClauses }
  if (ctx.errors !== null) return { ok: false, value, errors: ctx.errors }
  return { ok: true, value }
}
