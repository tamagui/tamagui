import { describe, expect, test } from 'vitest'

import { mergeComponentProps, mergeProps } from './mergeProps'

describe('mergeProps', () => {
  test('explicit undefined does not clobber a default', () => {
    expect(mergeProps({ size: 'md' }, { size: undefined })).toEqual({ size: 'md' })
  })

  test('explicit undefined without a default passes through', () => {
    expect(mergeProps({}, { size: undefined })).toEqual({ size: undefined })
  })

  test('defined values still override defaults', () => {
    expect(mergeProps({ size: 'md' }, { size: 'lg' })).toEqual({ size: 'lg' })
  })

  test('key order still lists defaults first', () => {
    expect(Object.keys(mergeProps({ a: 1 }, { b: 2 }))).toEqual(['a', 'b'])
  })
})

describe('mergeComponentProps', () => {
  test('explicit undefined does not clobber a default', () => {
    expect(
      mergeComponentProps({ size: 'md' }, undefined, { size: undefined })[0]
    ).toEqual({
      size: 'md',
    })
  })

  test('explicit undefined does not clobber context', () => {
    const [out, overridden] = mergeComponentProps(
      null,
      { size: 'lg' },
      { size: undefined }
    )
    expect(out).toEqual({ size: 'lg' })
    expect(overridden).toBe(null)
  })

  test('explicit undefined without default or context passes through', () => {
    expect(mergeComponentProps(null, undefined, { size: undefined })[0]).toEqual({
      size: undefined,
    })
  })

  test('defined values still override and record context overrides', () => {
    const [out, overridden] = mergeComponentProps(
      { size: 'md' },
      { size: 'lg' },
      { size: 'sm' }
    )
    expect(out).toEqual({ size: 'sm' })
    expect(overridden).toEqual({ size: 'sm' })
  })
})
