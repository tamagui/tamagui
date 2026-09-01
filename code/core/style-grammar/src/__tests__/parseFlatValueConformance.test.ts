import { describe, expect, test } from 'vitest'
import { parseFlatValueChecked, parseFlatValueProduction } from '../runtime/scanFlatValue'
import { constructCase, mulberry32 } from './valueCorpus'

// the production parser is a stripped copy of the checked parser. This pins
// the contract between them so they cannot drift apart silently:
// - segment boundaries, chain spans, and the base bit always agree
// - on clean input the tuples are identical
// - on any scan failure production refuses the WHOLE value (validity bits
//   cleared on every segment) while checked keeps per-segment validity for
//   diagnostics; production must never keep a validity bit checked cleared

const edgeCases = [
  '',
  ' ',
  'red',
  '  red  ',
  'red hover:blue',
  'hover:blue',
  'hover:blue red',
  'sm:hover:blue',
  'a:b:c',
  'hover:',
  '24px web:28px sm:32px',
  'rgb(1, 2, 3) hover:rgb(4, 5, 6)',
  'url(http://x/a:b.png)',
  "url('a b') hover:red",
  'calc(100% - 10px)',
  '"quoted value" hover:"other"',
  "'unterminated",
  '/* comment */ red',
  'red /* unterminated',
  'stray */ close',
  'semi;colon',
  'curly{brace}',
  'back\\:slash',
  'new\nline',
  '"new\nline in quote"',
  'paren(unclosed',
  'vídeo hover:ñe',
  'a  b   c',
  ':leading',
  'trailing:',
]

function conformanceCheck(source: string) {
  const [prodSegments, prodFailure, prodFailureIndex] = parseFlatValueProduction(source)
  const [checkedSegments, checkedFailure] = parseFlatValueChecked(source)
  const label = JSON.stringify(source)

  expect(prodFailure, label).toBe(null)
  expect(prodFailureIndex, label).toBe(-1)
  expect(prodSegments.length, label).toBe(checkedSegments.length)

  for (let index = 0; index < checkedSegments.length; index += 5) {
    // boundaries and chain spans always agree
    for (let offset = 0; offset < 4; offset++) {
      expect(prodSegments[index + offset], `${label} [${index + offset}]`).toBe(
        checkedSegments[index + offset]
      )
    }
    const prodFlags = prodSegments[index + 4]
    const checkedFlags = checkedSegments[index + 4]
    expect(prodFlags & 1, `${label} base bit [${index + 4}]`).toBe(checkedFlags & 1)
    if (checkedFailure === null) {
      expect(prodFlags, `${label} flags [${index + 4}]`).toBe(checkedFlags)
    } else {
      // production refuses the whole value: only the base bit survives, and it
      // must never keep a validity bit the checked parser cleared
      expect(prodFlags & ~1 & ~checkedFlags, `${label} over-valid [${index + 4}]`).toBe(0)
    }
  }
}

describe('production/checked flat value parser conformance', () => {
  test('edge cases', () => {
    for (const source of edgeCases) conformanceCheck(source)
  })

  test('constructed corpus, 3,000 cases', () => {
    const random = mulberry32(0xf1a7c0de)
    for (let caseIndex = 0; caseIndex < 3_000; caseIndex++) {
      const mode =
        caseIndex % 4 === 0 ? 'unregistered' : caseIndex % 4 === 1 ? 'invalid' : 'valid'
      conformanceCheck(constructCase(random, mode).source)
    }
  })
})
