import { describe, expect, it } from 'vitest'
import { mergeCssRules } from '../src/build'

const base = (id: string, v: string) => `._p-${id}{padding:${v}}`
const hover = (id: string, v: string) =>
  `@media (hover: hover) {._p-${id}:where(:hover){padding:${v}}}`

describe('mergeCssRules', () => {
  it('writes each rule once and keeps each hover after its base rule', () => {
    const fileA = base('1', '12px') + hover('1', '16px') + '._b-9{background-color:red}'
    const fileB = '._b-9{background-color:red}' + base('1', '12px') + hover('1', '16px')

    const merged = mergeCssRules([fileA, fileB])
    const count = (rule: string) => merged.split(rule).length - 1

    expect(count(base('1', '12px'))).toBe(1)
    expect(count(hover('1', '16px'))).toBe(1)
    expect(count('._b-9{background-color:red}')).toBe(1)
    expect(merged.indexOf(hover('1', '16px'))).toBeGreaterThan(
      merged.indexOf(base('1', '12px'))
    )
  })
})
