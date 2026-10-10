import { act, renderHook } from '@testing-library/react'
import { createChangeEventDetails, type TamaguiChangeEventDetails } from '@tamagui/core'
import { useControllableState } from '@tamagui/use-controllable-state'
import { describe, expect, test, vi } from 'vitest'

describe('event callback details', () => {
  test('cancel is idempotent and never touches the native event', () => {
    const preventDefault = vi.fn()
    const event = { preventDefault }
    const details = createChangeEventDetails('escape-key', event)

    details.cancel()
    details.cancel()

    expect(details.event).toBe(event)
    expect(details.isCanceled).toBe(true)
    // vetoing the state change must not cancel native defaults: outside-press
    // details wrap a shared document pointerdown, where preventDefault breaks
    // unrelated interactions (Select trigger press regression, 2026-07-16)
    expect(preventDefault).not.toHaveBeenCalled()
  })

  test('keeps event undefined for imperative and native sources', () => {
    const imperative = createChangeEventDetails('imperative-action')
    const native = createChangeEventDetails('native-change')

    expect(imperative.event).toBeUndefined()
    expect(native.event).toBeUndefined()
    expect(() => native.cancel()).not.toThrow()
  })

  test('does not update uncontrolled state after cancellation', () => {
    type Details = TamaguiChangeEventDetails<'trigger-press'>
    const onChange = vi.fn((_next: number, details?: Details) => details?.cancel())
    const { result } = renderHook(() =>
      useControllableState<number, Details>({
        defaultProp: 0,
        onChange,
      })
    )
    const details = createChangeEventDetails('trigger-press')

    act(() => result.current[1](1, details))

    expect(result.current[0]).toBe(0)
    expect(onChange).toHaveBeenCalledWith(1, details)
  })

  test('does not update controlled state after cancellation', () => {
    type Details = TamaguiChangeEventDetails<'trigger-press'>
    const onChange = vi.fn((_next: number, details?: Details) => details?.cancel())
    const { result } = renderHook(() =>
      useControllableState<number, Details>({
        prop: 0,
        defaultProp: 0,
        onChange,
        strategy: 'most-recent-wins',
      })
    )
    const details = createChangeEventDetails('trigger-press')

    act(() => result.current[1](1, details))

    expect(result.current[0]).toBe(0)
    expect(onChange).toHaveBeenCalledWith(1, details)
  })

  test('keeps the existing setter behavior without details', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() =>
      useControllableState({
        defaultProp: 0,
        onChange,
      })
    )

    act(() => result.current[1](1))

    expect(result.current[0]).toBe(1)
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
