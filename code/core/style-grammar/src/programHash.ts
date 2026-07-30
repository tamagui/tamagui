// Deterministic identity for one lowered program.
//
// A (longhand property, program, config revision) triple hashes to one class
// name, which is the whole dedup mechanism for the program block encoding: a
// class name fully determines its block, so duplicate arrival is idempotent and
// dedup is a name check. See plans/dom-tailwind-flat-values.md — "The program
// block encoding".
//
// Server and client must agree, so nothing here may depend on iteration order,
// config object identity, or insertion history. The config revision is the
// caller's opaque stamp for "the resolved config that produced these payloads".

import type { ParsedValue } from './valueTypes'

// The hash is the algorithm from @tamagui/simple-hash
// (code/core/simple-hash/src/index.ts), copied rather than imported because this
// package stays dependency-free. Same accumulator, same CSS-safe character
// rules, so identifiers behave like the ones core already generates. Keep in
// sync if that file changes. Two deliberate differences: no memo cache (callers
// own caching, and a shared module-level cache in the grammar package would
// outlive every config), and `strict` mode at the call site below.
function hashChar(hash: number, char: string): number {
  return (Math.imul(31, hash) + char.charCodeAt(0)) | 0
}

function isValidCssCharCode(code: number): boolean {
  return (
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122) || // a-z
    code === 95 || // _
    code === 45 || // -
    (code >= 48 && code <= 57) // 0-9
  )
}

function simpleHash(input: string, hashMin: number | 'strict' = 10): string {
  let str = input

  // remove var()
  if (str[0] === 'v' && str.startsWith('var(')) {
    str = str.slice(6, str.length - 1)
  }

  let hash = 0
  let valids = ''
  let added = 0
  const len = str.length

  for (let i = 0; i < len; i++) {
    if (hashMin !== 'strict' && added <= hashMin) {
      const char = str.charCodeAt(i)
      if (char === 46) {
        valids += '--'
        continue
      }
      if (isValidCssCharCode(char)) {
        added++
        valids += str[i]
        continue
      }
    }
    hash = hashChar(hash, str[i])
  }

  return valids + (hash ? Math.abs(hash) : '')
}

/**
 * The exact string that identifies a program. Every variable-length part is
 * length-prefixed, so no payload can forge a boundary and two different
 * programs cannot normalize to the same key. Also usable as the upstream
 * parse/lower cache key.
 */
export function normalizeProgramKey(
  property: string,
  value: ParsedValue,
  configRevision: string
): string {
  let key = `${configRevision.length}:${configRevision}${property.length}:${property}`
  key += value.base === null ? 'n' : `b${value.base.length}:${value.base}`
  for (const clause of value.clauses) {
    const modifiers = clause.modifiers.join(',')
    key += `c${modifiers.length}:${modifiers}${clause.payload.length}:${clause.payload}`
  }
  return key
}

/**
 * Short per-property prefix for readability in devtools: the first letter of
 * each camelCase word, so `backgroundColor` is `bc` and `borderTopLeftRadius`
 * is `btlr`. Abbreviations may collide (`backgroundColor` and `backgroundClip`
 * are both `bc`); the hash carries the property name, so the full class name
 * still differs. This is a label, not identity.
 */
export function propertyAbbreviation(property: string): string {
  let out = ''
  for (let index = 0; index < property.length; index++) {
    const code = property.charCodeAt(index)
    if (index === 0 || (code >= 65 && code <= 90)) {
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
        out += property[index].toLowerCase()
      }
    }
  }
  return out || 'x'
}

/** the css-safe class name that owns this program's block, eg `_bc-1076745300` */
export function programClassName(
  property: string,
  value: ParsedValue,
  configRevision: string
): string {
  const hash = simpleHash(normalizeProgramKey(property, value, configRevision), 'strict')
  // `strict` returns '' when the accumulator lands on 0, which would make every
  // such program share one name
  return `_${propertyAbbreviation(property)}-${hash || '0'}`
}
