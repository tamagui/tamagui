import { describe, expect, test, vi } from 'vitest'
import {
  createDefaultValidityState,
  createValidationCommitter,
  getValidationResult,
  isFilled,
  normalizeNativeValidity,
  shouldValidateOnChange,
} from './validation'

describe('field validation state machine', () => {
  test('starts unevaluated and suppresses required-only noise until dirty', () => {
    expect(createDefaultValidityState().valid).toBeNull()

    const nativeValidity = {
      ...createDefaultValidityState(false),
      valueMissing: true,
    }

    expect(normalizeNativeValidity(nativeValidity, false)).toMatchObject({
      valid: true,
      valueMissing: false,
    })
    expect(normalizeNativeValidity(nativeValidity, true)).toMatchObject({
      valid: false,
      valueMissing: true,
    })
  })

  test('normalizes function and Standard Schema errors', async () => {
    expect(
      await getValidationResult(() => ['First error', 'Second error'], 'value', {})
    ).toEqual(['First error', 'Second error'])

    const schema = {
      '~standard': {
        version: 1 as const,
        vendor: 'test',
        validate: () => ({
          issues: [{ message: 'Schema error' }, { message: 'Another schema error' }],
        }),
      },
    }

    expect(await getValidationResult(schema, 'value', {})).toEqual([
      'Schema error',
      'Another schema error',
    ])
  })

  test('drops stale async results using monotonic commit ids', async () => {
    const committed = vi.fn()
    const commits = createValidationCommitter(committed)
    let resolveFirst!: (errors: string[]) => void

    const first = commits.run(
      new Promise<string[]>((resolve) => {
        resolveFirst = resolve
      })
    )
    commits.run([])
    resolveFirst(['Stale error'])

    await first

    expect(committed).toHaveBeenCalledTimes(1)
    expect(committed).toHaveBeenLastCalledWith([])
  })

  test('revalidates on change after the first submit attempt', () => {
    expect(shouldValidateOnChange('onSubmit', false)).toBe(false)
    expect(shouldValidateOnChange('onSubmit', true)).toBe(true)
    expect(shouldValidateOnChange('onChange', false)).toBe(true)
    expect(shouldValidateOnChange('onBlur', true)).toBe(false)
  })

  test('tracks filled values across common control shapes', () => {
    expect(isFilled('')).toBe(false)
    expect(isFilled([])).toBe(false)
    expect(isFilled(false)).toBe(false)
    expect(isFilled('hello')).toBe(true)
    expect(isFilled(['one'])).toBe(true)
    expect(isFilled(0)).toBe(true)
  })
})
