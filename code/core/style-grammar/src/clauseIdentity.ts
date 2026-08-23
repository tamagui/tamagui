import {
  scanFlatValue,
  type FlatScanErrorCode,
  type FlatValueHandler,
} from './scanFlatValue'
import { coreStateModifierNames, modifierAliases } from './stateModifiers'
import { componentStateNames } from './states'

export type ClauseIdentityErrorCode =
  | FlatScanErrorCode
  | 'empty-modifier'
  | 'empty-payload'

export interface ClauseIdentityHandler<Context> {
  segment(ctx: Context, start: number, end: number, isBase: boolean): void
  chain?(ctx: Context, start: number, end: number): void
  modifier?(ctx: Context, start: number, end: number, canonical: string): void
  clause?(
    ctx: Context,
    start: number,
    chainEnd: number,
    payloadStart: number,
    end: number,
    slot: string
  ): void
  error?(ctx: Context, code: ClauseIdentityErrorCode, index: number): void
  word?(ctx: Context, start: number, end: number, isChain: boolean): void
}

export interface GroupModifier {
  state: string
  group: string | null
}

export const stateModifierNames: readonly string[] = Object.freeze([
  ...coreStateModifierNames,
  ...Object.keys(modifierAliases),
  ...componentStateNames,
])

const stateModifierSet: ReadonlySet<string> = new Set(stateModifierNames)

/** the shared identifier rule for parameterized modifier names */
export function isModifierName(text: string, start: number, end: number): boolean {
  if (start >= end) return false
  for (let index = start; index < end; index++) {
    const code = text.charCodeAt(index)
    if (
      !(code >= 97 && code <= 122) &&
      !(code >= 65 && code <= 90) &&
      !(code >= 48 && code <= 57) &&
      code !== 45 &&
      code !== 95
    ) {
      return false
    }
  }
  return true
}

/** parses the config-independent spelling of a named or unnamed group modifier */
export function parseGroupModifier(name: string): GroupModifier | null {
  if (!name.startsWith('group-')) return null
  const slash = name.indexOf('/')
  if (slash !== -1 && !isModifierName(name, slash + 1, name.length)) return null
  const state = name.slice(6, slash === -1 ? name.length : slash)
  if (!stateModifierSet.has(state)) return null
  const canonicalState = modifierAliases[state] || state
  if (canonicalState === 'enter' || canonicalState === 'exit') return null
  return { state, group: slash === -1 ? null : name.slice(slash + 1) }
}

/** canonical spelling used by every clause identity and matching consumer */
export function canonicalClauseModifier(name: string): string {
  const direct = modifierAliases[name]
  if (direct) return direct
  if (!name.startsWith('group-')) return name
  const slash = name.indexOf('/')
  if (slash !== -1 && !isModifierName(name, slash + 1, name.length)) return name
  const state = modifierAliases[name.slice(6, slash === -1 ? name.length : slash)]
  if (!state || state === 'enter' || state === 'exit') return name
  return slash === -1 ? `group-${state}` : `group-${state}${name.slice(slash)}`
}

function canonicalConditionSetKey(modifiers: string[]): string {
  if (modifiers.length === 0) return ''
  if (modifiers.length === 1) return modifiers[0]
  modifiers.sort()
  let length = 1
  for (let index = 1; index < modifiers.length; index++) {
    if (modifiers[index] !== modifiers[length - 1]) {
      modifiers[length++] = modifiers[index]
    }
  }
  modifiers.length = length
  return modifiers.join(':')
}

/** order-insensitive identity for the distinct canonical modifiers in a clause */
export function clauseConditionSetKey(modifiers: readonly string[]): string {
  if (modifiers.length === 0) return ''
  if (modifiers.length === 1) return canonicalClauseModifier(modifiers[0])
  const canonical: string[] = []
  for (const modifier of modifiers) canonical.push(canonicalClauseModifier(modifier))
  return canonicalConditionSetKey(canonical)
}

type ClauseIdentityContext<Context> = {
  source: string
  handler: ClauseIdentityHandler<Context>
  consumer: Context
  chainStart: number
  chainEnd: number
  payloadStart: number
  canonical: string[]
}

const clauseIdentityScanner: FlatValueHandler<ClauseIdentityContext<unknown>> = {
  segment(ctx, start, end, isBase) {
    ctx.handler.segment(ctx.consumer, start, end, isBase)
    if (isBase) return
    if (start === end) {
      ctx.handler.error?.(ctx.consumer, 'empty-payload', ctx.payloadStart)
      return
    }
    ctx.handler.clause?.(
      ctx.consumer,
      ctx.chainStart,
      ctx.chainEnd,
      start,
      end,
      canonicalConditionSetKey(ctx.canonical)
    )
  },

  chain(ctx, start, end) {
    ctx.chainStart = start
    ctx.chainEnd = end
    ctx.payloadStart = end + 1
    ctx.canonical.length = 0
    ctx.handler.chain?.(ctx.consumer, start, end)

    let modifierStart = start
    for (let index = start; index <= end; index++) {
      if (index !== end && ctx.source.charCodeAt(index) !== 58) continue
      if (index === modifierStart) {
        ctx.handler.error?.(ctx.consumer, 'empty-modifier', index)
      } else {
        const canonical = canonicalClauseModifier(ctx.source.slice(modifierStart, index))
        ctx.canonical.push(canonical)
        ctx.handler.modifier?.(ctx.consumer, modifierStart, index, canonical)
      }
      modifierStart = index + 1
    }
    return true
  },

  error(ctx, code, index) {
    ctx.handler.error?.(ctx.consumer, code, index)
  },

  word(ctx, start, end, isChain) {
    ctx.handler.word?.(ctx.consumer, start, end, isChain)
  },
}

/**
 * Reduces one flat value to config-independent clause identity in the lexer's
 * single pass. Consumers receive source spans, canonical alias spellings, and
 * the unordered clause slot without re-scanning or classifying modifiers.
 */
export function reduceFlatValueIdentity<Context>(
  source: string,
  handler: ClauseIdentityHandler<Context>,
  consumer: Context
): void {
  scanFlatValue(source, clauseIdentityScanner, {
    source,
    handler,
    consumer,
    chainStart: 0,
    chainEnd: 0,
    payloadStart: 0,
    canonical: [],
  } as ClauseIdentityContext<unknown>)
}
