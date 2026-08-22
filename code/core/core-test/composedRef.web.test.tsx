process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { act, render } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'

import { TamaguiProvider, View, createTamagui } from '@tamagui/core'

const conf = createTamagui(getDefaultTamaguiConfig())

/**
 * Regression for GitHub issue #4031.
 *
 * createComponent caches the composed ref on stateRef so the host isn't detached
 * and reattached every render. The cached callback closed over the forwardedRef
 * from the first render forever, so a parent that swaps ref identity — which is
 * what react-hook-form does when it re-registers a field after reset() — never
 * received the node again, and setFocus()/shouldFocusError silently stopped
 * working.
 */

describe('composed ref', () => {
  test('a swapped forwarded ref receives the host node', () => {
    const first: { current: HTMLElement | null } = { current: null }
    const second: { current: HTMLElement | null } = { current: null }

    let swap: () => void = () => {}

    function Test() {
      const [useSecond, setUseSecond] = useState(false)
      swap = () => setUseSecond(true)
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          <View ref={useSecond ? (second as any) : (first as any)} />
        </TamaguiProvider>
      )
    }

    render(<Test />)
    expect(first.current).not.toBe(null)

    act(() => swap())

    // the newly passed ref must hold the node...
    expect(second.current).not.toBe(null)
    // ...and the one that was swapped out must be released
    expect(first.current).toBe(null)
  })

  test('a swapped callback ref is invoked with the host node', () => {
    const calls: Array<['a' | 'b', boolean]> = []
    const refA = (node: any) => calls.push(['a', !!node])
    const refB = (node: any) => calls.push(['b', !!node])

    let swap: () => void = () => {}

    function Test() {
      const [useB, setUseB] = useState(false)
      swap = () => setUseB(true)
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          <View ref={useB ? refB : refA} />
        </TamaguiProvider>
      )
    }

    render(<Test />)
    expect(calls).toContainEqual(['a', true])

    act(() => swap())

    expect(calls).toContainEqual(['a', false])
    expect(calls).toContainEqual(['b', true])
  })

  test('a stable forwarded ref is not detached on re-render', () => {
    // the cache exists so react doesn't tear the host off and reattach it every
    // render — the fix must only invalidate it when the ref identity changes
    const calls: boolean[] = []
    const ref = (node: any) => calls.push(!!node)

    let rerender: () => void = () => {}

    function Test() {
      const [, setTick] = useState(0)
      rerender = () => setTick((t) => t + 1)
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          <View ref={ref} />
        </TamaguiProvider>
      )
    }

    render(<Test />)
    expect(calls).toEqual([true])

    act(() => rerender())
    act(() => rerender())

    expect(calls).toEqual([true])
  })
})
