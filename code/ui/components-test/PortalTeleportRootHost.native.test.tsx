import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { getPortal } from '@tamagui/native'
import { PortalHost, PortalProvider } from '@tamagui/portal'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig('native'))

const recordedHostNames: string[] = []

function Portal({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

function PortalHostFake({ name }: { name: string }) {
  recordedHostNames.push(name)
  return null
}

function PortalProviderFake({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children}
      <PortalHostFake name="root" />
    </>
  )
}

function installFakeTeleport() {
  recordedHostNames.length = 0
  ;(globalThis as any).__tamagui_teleport = {
    Portal,
    PortalHost: PortalHostFake,
    PortalProvider: PortalProviderFake,
  }
  getPortal().set({ enabled: true, type: 'teleport' })
}

describe('portal teleport root host', () => {
  afterEach(() => {
    getPortal().set({ enabled: false, type: null })
    delete (globalThis as any).__tamagui_teleport
    recordedHostNames.length = 0
  })

  test('renders a single root host under teleport', async () => {
    installFakeTeleport()

    await act(async () => {
      TestRenderer.create(
        <TamaguiProvider config={conf} defaultTheme="light">
          <PortalProvider>{null}</PortalProvider>
        </TamaguiProvider>
      )
    })

    expect(recordedHostNames).toEqual(['root'])
  })

  test('renders a named teleport host', async () => {
    installFakeTeleport()

    await act(async () => {
      TestRenderer.create(
        <TamaguiProvider config={conf} defaultTheme="light">
          <PortalProvider>
            <PortalHost name="x" />
          </PortalProvider>
        </TamaguiProvider>
      )
    })

    expect(recordedHostNames.filter((name) => name === 'root')).toEqual(['root'])
    expect(recordedHostNames).toContain('x')
  })
})
