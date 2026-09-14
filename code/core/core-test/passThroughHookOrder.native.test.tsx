// on native, hooks.useChildren reads the TextAncestor context (a React hook)
// via createOptimizedView. passThrough is a per-render prop (Adapt/Popover
// toggle it when a breakpoint flips), so the context read must run on every
// render — passthrough and non-passthrough alike — to keep the hook count
// stable (rules of hooks). createComponent calls useChildren unconditionally
// and useChildren reads TextAncestor before any per-render branch.
//
// verification notes (React 19.1): useContext holds no hook slot, so a
// TRAILING conditional useContext currently neither throws nor warns — the
// pre-fix violation was latent, one added slot-hook away from real state
// corruption. a runtime crash repro is therefore not possible here; this test
// instead locks the contract that toggling passThrough neither throws nor
// breaks render output / descendant state. note also that the vitest native
// build (dist/test.native.cjs) inlines NODE_ENV='test', which makes
// useChildren return before the optimized-view path — the context read still
// runs in test builds since it sits above that return.
process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { act, render } from '@testing-library/react-native'
import { Profiler, useState } from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

let lastStatefulId = ''
function StatefulChild() {
  const [id] = useState(() => Math.random().toString(36).slice(2, 10))
  lastStatefulId = id
  return <View testID="stateful-child" width={10} height={10} />
}

function app(passThrough: boolean) {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View passThrough={passThrough} backgroundColor="red">
        <StatefulChild />
      </View>
    </TamaguiProvider>
  )
}

describe('passThrough toggling (native)', () => {
  test('toggling passThrough on and back off keeps hook order, output, and child state', () => {
    const rendered = render(app(false))
    const styledTree = JSON.stringify(rendered.toJSON())
    expect(styledTree).toContain('"backgroundColor":"red"')
    const idBefore = lastStatefulId

    expect(() => {
      rendered.rerender(app(true))
    }).not.toThrow()

    // passthrough renders the display: contents wrapper, no styles
    const passthroughTree = JSON.stringify(rendered.toJSON())
    expect(passthroughTree).toContain('"display":"contents"')
    expect(passthroughTree).not.toContain('"backgroundColor":"red"')

    expect(() => {
      rendered.rerender(app(false))
    }).not.toThrow()
    expect(JSON.stringify(rendered.toJSON())).toContain('"backgroundColor":"red"')

    // the child kept its fiber (no corruption-forced remount) across both flips
    expect(lastStatefulId).toBe(idBefore)
  })

  test('mounting in passthrough then leaving it works', () => {
    const rendered = render(app(true))
    expect(JSON.stringify(rendered.toJSON())).toContain('"display":"contents"')
    expect(() => {
      rendered.rerender(app(false))
    }).not.toThrow()
    expect(JSON.stringify(rendered.toJSON())).toContain('"backgroundColor":"red"')
  })

  test('a passthrough mount does not schedule an enter-state render', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    const onRender = vi.fn()

    render(
      <Profiler id="passthrough" onRender={onRender}>
        {app(true)}
      </Profiler>
    )

    expect(onRender).toHaveBeenCalledTimes(1)
    expect(frames).toHaveLength(0)
  })

  test('forceStyle preserves finalized mount state across parent renders', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    const styled = (testID: string) => (
      <TamaguiProvider config={config} defaultTheme="light">
        <View testID={testID} forceStyle="hover" backgroundColor="red" />
      </TamaguiProvider>
    )
    const rendered = render(styled('first'))

    expect(frames).toHaveLength(0)
    act(() => rendered.rerender(styled('second')))
    expect(frames).toHaveLength(0)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})
