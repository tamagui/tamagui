import { Adapt, AdaptParent, AdaptPortalContents } from '@tamagui/adapt'
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

describe('Adapt native teleport contents', () => {
  test('keeps active teleported children mounted across parent re-renders', async () => {
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
})
