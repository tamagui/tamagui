import '@testing-library/jest-dom'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

type IntersectionCallback = (
  entries: Pick<IntersectionObserverEntry, 'isIntersecting'>[]
) => void

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionCallback
  options?: IntersectionObserverInit

  constructor(callback: IntersectionCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    MockIntersectionObserver.instances.push(this)
  }

  observe() {}
  disconnect() {}

  setIntersecting(isIntersecting: boolean) {
    this.callback([{ isIntersecting }])
  }
}

describe('Slider measurement interval', () => {
  let previousDisableInterval: string | undefined

  beforeEach(() => {
    previousDisableInterval = process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
    delete process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
    vi.useFakeTimers()
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    MockIntersectionObserver.instances = []
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.restoreAllMocks()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    if (previousDisableInterval === undefined) {
      delete process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
    } else {
      process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL = previousDisableInterval
    }
  })

  it('is lazy, shared, and scoped to intersecting sliders', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { Slider } = await import('@tamagui/slider')

    expect(setIntervalSpy).not.toHaveBeenCalled()

    const first = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Slider defaultValue={[50]} />
      </TamaguiProvider>
    )
    const second = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Slider defaultValue={[50]} />
      </TamaguiProvider>
    )

    const measurementObservers = MockIntersectionObserver.instances.filter((instance) =>
      Array.isArray(instance.options?.threshold)
    )
    expect(measurementObservers).toHaveLength(2)
    expect(setIntervalSpy).not.toHaveBeenCalled()

    act(() => measurementObservers[0].setIntersecting(true))
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)

    act(() => measurementObservers[1].setIntersecting(true))
    expect(setIntervalSpy).toHaveBeenCalledTimes(1)

    act(() => measurementObservers[0].setIntersecting(false))
    expect(clearIntervalSpy).not.toHaveBeenCalled()

    act(() => measurementObservers[1].setIntersecting(false))
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)

    act(() => measurementObservers[0].setIntersecting(true))
    act(() => measurementObservers[1].setIntersecting(true))
    expect(setIntervalSpy).toHaveBeenCalledTimes(2)

    first.unmount()
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1)
    second.unmount()
    expect(clearIntervalSpy).toHaveBeenCalledTimes(2)
  })

  it('respects the interval disable guard when a slider becomes active', async () => {
    process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL = '1'
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval')
    const { Slider } = await import('@tamagui/slider')

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Slider defaultValue={[50]} />
      </TamaguiProvider>
    )
    const measurementObserver = MockIntersectionObserver.instances.find((instance) =>
      Array.isArray(instance.options?.threshold)
    )
    expect(measurementObserver).toBeDefined()
    act(() => measurementObserver!.setIntersecting(true))

    expect(setIntervalSpy).not.toHaveBeenCalled()
  })
})
