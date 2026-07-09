import {
  Adapt,
  AdaptCapabilities,
  AdaptParent,
  AdaptPortalContents,
  type AdaptTarget,
  useAdaptTarget,
  useAdaptedCapabilities,
} from '@tamagui/adapt'
import { getPortal } from '@tamagui/native'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test } from 'vitest'

const scope = 'AdaptTeleportTest'

function enableTeleport() {
  getPortal().set({ enabled: true, type: 'teleport' })
}

function disableTeleport() {
  getPortal().set({ enabled: false, type: null })
}

afterEach(() => {
  disableTeleport()
})

describe('Adapt native live slot contents', () => {
  test('keeps active published children mounted across parent re-renders', async () => {
    enableTeleport()

    const mounts: string[] = []
    const unmounts: string[] = []

    function Marker({ label }: { label: string }) {
      React.useEffect(() => {
        mounts.push(label)
        return () => {
          unmounts.push(label)
        }
      }, [])

      return <>{label}</>
    }

    function Harness({ label }: { label: string }) {
      return (
        <AdaptParent scope={scope} portal>
          <Adapt when>
            <Adapt.Contents />
          </Adapt>
          <AdaptPortalContents scope={scope}>
            <Marker label={label} />
          </AdaptPortalContents>
        </AdaptParent>
      )
    }

    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(<Harness label="first" />)
    })

    expect(rendered!.toJSON()).toBe('first')
    mounts.length = 0
    unmounts.length = 0

    await act(async () => {
      rendered!.update(<Harness label="second" />)
    })

    expect(mounts).toEqual([])
    expect(unmounts).toEqual([])
    expect(rendered!.toJSON()).toBe('second')

    await act(async () => {
      rendered!.unmount()
    })

    expect(unmounts).toEqual(['first'])
  })

  test('exposes target state and releases the presence latch on handoff completion', async () => {
    const targetScope = 'AdaptTargetContract'
    let latestTarget: AdaptTarget<{ label: string }> | null = null
    const openChanges: boolean[] = []
    const mounts: string[] = []
    const unmounts: string[] = []

    function Target() {
      const adapt = useAdaptTarget<{ label: string }>(targetScope)
      latestTarget = adapt

      React.useEffect(() => {
        mounts.push('target')
        return () => {
          unmounts.push('target')
        }
      }, [])

      if (!adapt) {
        return null
      }

      return (
        <>
          {`open:${adapt.open} hidden:${adapt.handoff.hidden} state:${adapt.state.label}`}
        </>
      )
    }

    function Harness({ active }: { active: boolean }) {
      return (
        <AdaptParent
          scope={targetScope}
          open
          onOpenChange={(value) => openChanges.push(value)}
          state={{ label: 'dialog-state' }}
        >
          <Adapt when={active}>
            <Target />
          </Adapt>
        </AdaptParent>
      )
    }

    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(<Harness active />)
    })

    expect(rendered!.toJSON()).toBe('open:true hidden:false state:dialog-state')
    latestTarget!.onOpenChange?.(false)
    expect(openChanges).toEqual([false])

    await act(async () => {
      rendered!.update(<Harness active={false} />)
    })

    expect(rendered!.toJSON()).toBe('open:true hidden:true state:dialog-state')
    expect(mounts).toEqual(['target'])
    expect(unmounts).toEqual([])

    await act(async () => {
      latestTarget!.handoff.onAnimationComplete({ open: false })
    })

    expect(rendered!.toJSON()).toBe(null)
    expect(unmounts).toEqual(['target'])
  })

  test('passes resolved state to the render callback escape hatch', async () => {
    const callbackScope = 'AdaptRenderCallback'

    function Harness() {
      return (
        <AdaptParent scope={callbackScope} open state={{ label: 'callback-state' }}>
          <Adapt when>
            {(contents, adapt) => {
              const state = adapt.state as { label: string }
              return (
                <>
                  {`callback:${adapt.active}:${adapt.open}:${state.label}:${
                    contents ? 'contents' : 'empty'
                  }`}
                </>
              )
            }}
          </Adapt>
        </AdaptParent>
      )
    }

    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(<Harness />)
    })

    expect(rendered!.toJSON()).toBe('callback:true:true:callback-state:contents')
  })

  test('merges adapt target capabilities through context', async () => {
    function CapabilityReader() {
      const capabilities = useAdaptedCapabilities()
      return (
        <>
          {`scroll:${capabilities.scroll} overlay:${capabilities.overlay} dismiss:${capabilities.dismiss}`}
        </>
      )
    }

    let rendered: TestRenderer.ReactTestRenderer | null = null

    await act(async () => {
      rendered = TestRenderer.create(
        <AdaptCapabilities scroll overlay={false}>
          <AdaptCapabilities overlay dismiss>
            <CapabilityReader />
          </AdaptCapabilities>
        </AdaptCapabilities>
      )
    })

    expect(rendered!.toJSON()).toBe('scroll:true overlay:true dismiss:true')
  })
})
