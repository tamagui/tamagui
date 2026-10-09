process.env.TAMAGUI_TARGET = 'web'

import { act, renderHook } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import config from '../config-default'
import { createTamagui, setMediaState, updateMediaListeners, useMedia } from '../web/src'
import { setMediaShouldUpdate } from '../web/src/hooks/useMedia'

test.each(['updates', 'first-render'] as const)(
  '%s defers render emissions and keeps subscription emissions synchronous',
  async (optimizeFor) => {
    createTamagui({
      ...config.getDefaultTamaguiConfig(),
      settings: { disableSSR: true, optimizeFor },
    })
    setMediaState({ sm: false } as any)
    const uid = {}
    setMediaShouldUpdate(uid, true, new Set(['sm']))
    let inRender = false
    const emittedDuringRender: boolean[] = []
    const mediaEmit = vi.fn(() => emittedDuringRender.push(inRender))
    const { result, rerender, unmount } = renderHook(() => {
      inRender = true
      const media = useMedia({ mediaEmit } as any, undefined, uid)
      const sm = media.sm
      inRender = false
      return sm
    })
    expect(result.current).toBe(false)
    expect(mediaEmit).not.toHaveBeenCalled()

    // change the store without notifying subscribers, so the next render is
    // the first place the hook can discover it.
    const next = { sm: true } as any
    setMediaState(next)
    await act(async () => {
      rerender()
      expect(mediaEmit).not.toHaveBeenCalled()
      expect(result.current).toBe(false)
    })
    expect(mediaEmit).toHaveBeenCalledExactlyOnceWith(next)
    expect(emittedDuringRender).toEqual([false])

    rerender()
    expect(result.current).toBe(true)
    expect(mediaEmit).toHaveBeenCalledTimes(1)

    const subscribed = { sm: false } as any
    act(() => {
      setMediaState(subscribed)
      updateMediaListeners()
      // this assertion is inside the publish call's act, before a queued
      // microtask could satisfy it.
      expect(mediaEmit).toHaveBeenCalledTimes(2)
      expect(mediaEmit).toHaveBeenLastCalledWith(subscribed)
    })
    expect(emittedDuringRender).toEqual([false, false])
    unmount()
  }
)

test.each(['updates', 'first-render'] as const)(
  '%s captures the emitter before a later render changes context',
  async (optimizeFor) => {
    createTamagui({
      ...config.getDefaultTamaguiConfig(),
      settings: { disableSSR: true, optimizeFor },
    })
    setMediaState({ sm: false } as any)
    const uid = {}
    setMediaShouldUpdate(uid, true, new Set(['sm']))
    const original = vi.fn()
    const replacement = vi.fn()
    const { result, rerender, unmount } = renderHook(
      ({ mediaEmit }) => useMedia({ mediaEmit } as any, undefined, uid).sm,
      { initialProps: { mediaEmit: original } }
    )
    const next = { sm: true } as any
    setMediaState(next)
    rerender({ mediaEmit: original })
    expect(original).not.toHaveBeenCalled()
    expect(result.current).toBe(false)

    // adopt the pending snapshot and replace context before the microtask.
    rerender({ mediaEmit: replacement })
    expect(result.current).toBe(true)
    await act(async () => {})
    expect(original).toHaveBeenCalledExactlyOnceWith(next)
    expect(replacement).not.toHaveBeenCalled()
    unmount()
  }
)
